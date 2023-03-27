<script>
	import { onMount } from 'svelte';
	import { baseTheme } from './themes';
	import { fs } from './filesystem';

	let terminal;
	let xterm;
	let command = '';
	let ps1 = `\r\n${fs.CWD()} $ `;

	var commands = {
		help: {
			f: (term) => {
				term.writeln('Help!\n\r');
				console.log(commands);
				for (let [name, cmd] of Object.entries(commands)) {
					term.writeln(`${name}\t${cmd.help}`);
				}
			},
			help: 'Print this help text'
		},
		pwd: {
			f: (term) => {
				term.writeln(fs.CWD());
			},
			help: 'Print the working dir'
		},
		clear: {
			f: (term) => {
				term.reset();
				term.clear();
			},
			help: 'Clear the contents of the terminal'
		},
		ls: {
			f: (term, path) => {
				if (path == undefined) {
					path = fs.CWD();
				}
				var result = fs.getDirContent(path);
				console.log(result);
				if (result.success) {
					result.result.forEach((e) => {
						term.writeln(e.name);
					});
				} else {
					term.writeln(result.error);
				}
			},
			help: '<path> - list the contents of the given dir or the current dir'
		},
		cd: {
			f: (term, path) => {
				if (path == undefined) {
					path = '/';
				}
				let result = fs.changeDir(path);
				if (!result.success) {
					term.writeln(result.error);
				}
			},
			help: '<path> - change to the given dir or back to the root dir'
		},
		cat: {
			f: (term, file) => {
				if (file == undefined) {
					term.writeln('Usage: cat <filename>');
				} else {
					let result = fs.getFileContent(file);
					console.log(result);
					if (result.success) {
						let content = fs.getFileContent(file);
						term.writeln(content.result);
					} else {
						term.writeln(result.error);
					}
				}
			},
			help: '<file> - display the contents of the given file'
		}
	};
	function prompt(term) {
		command = '';
		ps1 = `\r\n${fs.CWD()} $ `;
		term.write(ps1);
	}

	function runCommand(term, text) {
		term.writeln('');
		if (text == '') {
			return;
		}
		const command = text.trim().split(' ')[0];
		const args = text.trim().split(' ').slice(1);
		if (command in commands) {
			commands[command].f(term, ...args);
		} else {
			term.writeln(`Command '${command}' not found. Type 'help' for commands.`);
		}
	}

	function initializeTerminal() {
		var term = new xterm.Terminal({
			fontFamily: '"Cascadia Code", Menlo, monospace',
			theme: baseTheme,
			cursorBlink: true,
			allowProposedApi: true
		});
		term.open(terminal);
		prompt(term);
		term.onData((e) => {
			switch (e) {
				case '\r':
					runCommand(term, command);
					command = '';
					prompt(term);
					break;
				case '\u007F': // Backspace (DEL)
					// Do not delete the prompt
					if (term._core.buffer.x > ps1.length - 2) {
						term.write('\b \b');
						if (command.length > 0) {
							command = command.substr(0, command.length - 1);
						}
					}
					break;
				case '\u0003': // Ctrl+C
					term.write('^C');
					command = '';
					prompt(term);
					break;
				default:
					if ((e >= String.fromCharCode(0x20) && e <= String.fromCharCode(0x7e)) || e >= '\u00a0') {
						term.write(e);
						command += e;
					}
			}
		});
	}

	onMount(async () => {
		xterm = await import('xterm');
		initializeTerminal();
	});
</script>

<link rel="stylesheet" href="node_modules/xterm/css/xterm.css" />
<div id="terminal" bind:this={terminal} />
