<script>
	import { onMount } from 'svelte';
	import { baseTheme } from './themes';

	let terminal;
	let xterm;
	let command = '';

	var commands = {
		help: {
			f: (term) => {
				term.writeln('Help text goes here');
			}
		}
	};
	function prompt(term) {
		command = '';
		term.write('\r\n$ ');
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
					prompt(term);
					break;
				case '\u007F': // Backspace (DEL)
					// Do not delete the prompt
					if (term._core.buffer.x > 2) {
						term.write('\b \b');
						if (command.length > 0) {
							command = command.substr(0, command.length - 1);
						}
					}
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
