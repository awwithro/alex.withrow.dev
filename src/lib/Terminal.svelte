<script>
	import { onMount } from 'svelte';
	import { baseTheme } from './themes';
	import FFS from 'fakefilesystem';

	export let data;
	let ffs = new FFS();
	for (const dir of data.fileData.dirs) {
		ffs.createDir(dir.path, dir.name);
	}
	for (const file of data.fileData.files) {
		ffs.createFile(file.path, file.name, file.content);
	}
	let terminal;
	let xterm;
	let addon;
	let command = '';
	let history = [];
	let displayedHints = false;
	let historyIndex = 0;
	const black = `\x1b[30m`;
	const red = `\x1b[31m`;
	const green = `\x1b[32m`;
	const yellow = `\x1b[33m`;
	const blue = `\x1b[34m`;
	const magenta = `\x1b[35m`;
	const cyan = `\x1b[36m`;
	const white = `\x1b[37m`;
	const clear = `\x1b[0m`;
	const italic = `\x1b[3m`;
	var ps1 = `\r\n${yellow}visitor${clear}@${blue}alex.withrow.dev${clear}:${ffs.CWD()} $ `;
	let ps1Offset = 20; // lenght of non visible chars
	let commands = {
		help: {
			f: (term) => {
				term.writeln('Help!\n\r');
				for (let [name, cmd] of Object.entries(commands)) {
					term.writeln(`${name}\t${cmd.help}`);
				}
			},
			help: 'Print this help text'
		},
		pwd: {
			f: (term) => {
				term.writeln(ffs.CWD());
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
					path = ffs.CWD();
				}
				let ls = ffs.getDirContent(path);
				if (ls.success) {
					ls.result.forEach((file) => {
						let write = file.name;
						if (file.type == 'directory') {
							write = green + file.name + '/' + clear;
						}
						term.writeln(write);
					});
				} else {
					term.writeln(ls.error);
				}
			},
			help: '<path> - list the contents of the given dir or the current dir'
		},
		cd: {
			f: (term, path) => {
				if (path == undefined) {
					path = '/';
				}
				let result = ffs.changeDir(path);
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
					let content = ffs.getFileContent(file);
					if (content.success) {
						term.writeln(content.result.replaceAll('\n', '\n\r'));
					} else {
						term.writeln(content.error);
					}
				}
			},
			help: '<file> - display the contents of the given file'
		},
		welcome: {
			f: (term) => {
				welcomeText(term);
			},
			help: 'Display the initial welcome text'
		}
	};
	function prompt(term) {
		command = '';
		historyIndex = 0;
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
		let term = new xterm.Terminal({
			fontFamily: '"Cascadia Code", Menlo, monospace',
			theme: baseTheme,
			cursorBlink: true,
			allowProposedApi: true
		});
		term.loadAddon(new addon.WebLinksAddon());
		term.open(terminal);
		welcomeText(term);
		prompt(term);
		term.focus();
		term.write('\x9b4h');
		term.onData((e) => {
			if (displayedHints) {
				term.write(`\x9Bs`); // save cursor
				term.write(`\n\r`); // next line
				term.write(`\x9B1M`); // delete hints line
				term.write(`\x9Bu`); //restore cursor
				displayedHints = false;
			}
			switch (e) {
				case '\r': // Enter
					runCommand(term, command);
					if (history.at(-1) != command && command != '') {
						history.push(command);
					}
					command = '';
					prompt(term);
					break;
				case '\u007F': // Backspace (DEL)
					// Do not delete the prompt
					if (term._core.buffer.x > ps1.length - ps1Offset) {
						term.write('\b\x9B1P');
						if (command.length > 0) {
							command = command.substr(0, command.length - 1);
						}
					}
					break;
				case `\x1b[D`: //left-arrow
					if (term._core.buffer.x > ps1.length - 20) {
						term.write('\b');
					}
					break;
				case `\x1b[C`: //right-arrow
					if (term._core.buffer.x < command.length + ps1.length - ps1Offset) {
						term.write('\x9BC');
					}
					break;
				case `\x1b[A`: //up-arrow
					if (command.length > 0) {
						term.write(`\x9B${command.length}D\x9B${command.length}P`);
						command = '';
					}
					if (history.length > 0) {
						historyIndex++;
						if (historyIndex >= history.length) {
							historyIndex = history.length;
						}
						let cmd = history[history.length - historyIndex];
						term.write(cmd);
						command = cmd;
					}
					break;
				case `\x1b[B`: //down-arrow
					if (command.length > 0) {
						term.write(`\x9B${command.length}D\x9B${command.length}P`);
						command = '';
					}
					if (history.length > 0) {
						historyIndex--;
						if (historyIndex < 0) {
							historyIndex = 0;
						}
						if (historyIndex != 0) {
							let cmd = history[history.length - historyIndex];
							term.write(cmd);
							command = cmd;
						}
					}
					break;
				case '\t':
					let hints = [];
					let line = command.split(' ');
					// a command is started
					if (line.length == 2) {
						if (['cat'].includes(line[0])) {
							let files = ffs.getDirContent(ffs.CWD());
							if (files.success) {
								files.result.forEach((file) => {
									if (file.type == 'file' && file.name.startsWith(line[1])) {
										hints.push(file.name);
									}
								});
							}
						} else if (['cd', 'ls'].includes(line[0])) {
							let dirs = ffs.getDirContent(ffs.CWD());
							if (line[1].length == 0) {
								hints.push('./');
								hints.push('../');
							}
							if (dirs.success) {
								dirs.result.forEach((dir) => {
									if (dir.type == 'directory' && dir.name.startsWith(line[1])) {
										hints.push(dir.name);
									}
								});
							}
						}
					} else {
						for (let cmd in commands) {
							if (cmd.startsWith(command)) {
								hints.push(cmd);
							}
						}
					}
					if (hints.length == 1) {
						let cmd;
						if (line.length == 1) {
							cmd = hints[0].substring(command.length);
						} else {
							cmd = hints[0].substring(line[1].length);
						}
						cmd += ' ';
						command += cmd;
						term.write(cmd);
					} else if (hints.length > 1) {
						term.write(`\x9Bs`); // save cursor
						term.write(`\n\r`); // next line
						let hintTxt = hints.join(' ');
						term.write(hintTxt);
						term.write(`\x9Bu`); //restore cursor
						displayedHints = true;
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

	function welcomeText(term) {
		term.writeln(
			[
				'    This is an emulated terminal version of the website made with XTerm.js',
				'      all the various pages are available via this cli tool.',
				` ┌ ${white}Features${clear} ──────────────────────────────────────────────────────────────────┐`,
				' │                                                                            │',
				` │  ${green}Directories${clear}                            ${cyan}Text Files${clear}                         │`,
				' │   Directories are green.                 Text files can be read.           │',
				` │   use ${italic}cd${clear} to change                       use ${italic}cat${clear} to display them           │`,
				' │                                                                            │',
				` │  ${yellow}History${clear}                                ${blue}Tab Completion${clear}                     │`,
				` │   Arrows can be used for                 Use ${italic}tab${clear} to show command           │`,
				' │   seeing your command history            completion options                │',
				' │                                                                            │',
				` │  ${magenta}Clickable links                        ${red}And much more...${clear}                   │`,
				` │   Any links that are rendered            Type the ${italic}help${clear} command             │`,
				' │   can be clicked on                      to see what is available          │',
				' │                                                                            │',
				' └────────────────────────────────────────────────────────────────────────────┘',
				''
			].join('\n\r')
		);
	}

	onMount(async () => {
		xterm = await import('xterm');
		addon = await import('xterm-addon-web-links');
		initializeTerminal();
	});
</script>

<link rel="stylesheet" href="xterm.css" />
<div id="terminal" bind:this={terminal} />

<style>
	#terminal {
		display: flex;
		justify-content: center;
		margin: 2pc;
	}
</style>
