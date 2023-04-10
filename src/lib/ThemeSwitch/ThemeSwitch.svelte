<script>
	const toggleColorMode = (e) => {
		// Switch to Light Mode
		if (e.currentTarget.classList.contains('light--hidden')) {
			// Sets the custom HTML attribute
			document.documentElement.setAttribute('color-mode', 'light');

			//Sets the user's preference in local storage
			localStorage.setItem('color-mode', 'light');
			return;
		}

		/* Switch to Dark Mode
    Sets the custom HTML attribute */
		document.documentElement.setAttribute('color-mode', 'dark');

		// Sets the user's preference in local storage
		localStorage.setItem('color-mode', 'dark');
	};
</script>

<svelte:head>
	<script>
		if (
			/* This condition checks whether the user has set a site preference for dark mode OR a OS-level preference for Dark Mode AND no site preference */
			localStorage.getItem('color-mode') === 'dark' ||
			(window.matchMedia('(prefers-color-scheme: dark)').matches &&
				!localStorage.getItem('color-mode'))
		) {
			// if true, set the site to Dark Mode
			document.documentElement.setAttribute('color-mode', 'dark');
		}
	</script>
</svelte:head>
<svg>
	<symbol id="sm-moon-icon" viewBox="0 0 24 24" aria-hidden="true"
		><path fill="none" d="M0 0h24v24H0z" /><path
			d="M10 6a8 8 0 0 0 11.955 6.956C21.474 18.03 17.2 22 12 22 6.477 22 2 17.523 2 12c0-5.2 3.97-9.474 9.044-9.955A7.963 7.963 0 0 0 10 6zm-6 6a8 8 0 0 0 8 8 8.006 8.006 0 0 0 6.957-4.045c-.316.03-.636.045-.957.045-5.523 0-10-4.477-10-10 0-.321.015-.64.045-.957A8.006 8.006 0 0 0 4 12zm14.164-9.709L19 2.5v1l-.836.209a2 2 0 0 0-1.455 1.455L16.5 6h-1l-.209-.836a2 2 0 0 0-1.455-1.455L13 3.5v-1l.836-.209A2 2 0 0 0 15.29.836L15.5 0h1l.209.836a2 2 0 0 0 1.455 1.455zm5 5L24 7.5v1l-.836.209a2 2 0 0 0-1.455 1.455L21.5 11h-1l-.209-.836a2 2 0 0 0-1.455-1.455L18 8.5v-1l.836-.209a2 2 0 0 0 1.455-1.455L20.5 5h1l.209.836a2 2 0 0 0 1.455 1.455z"
		/></symbol
	>
	<symbol id="sm-sun-icon" viewBox="0 0 24 24" aria-hidden="true"
		><path fill="none" d="M0 0h24v24H0z" /><path
			d="M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12zm0-2a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM11 1h2v3h-2V1zm0 19h2v3h-2v-3zM3.515 4.929l1.414-1.414L7.05 5.636 5.636 7.05 3.515 4.93zM16.95 18.364l1.414-1.414 2.121 2.121-1.414 1.414-2.121-2.121zm2.121-14.85l1.414 1.415-2.121 2.121-1.414-1.414 2.121-2.121zM5.636 16.95l1.414 1.414-2.121 2.121-1.414-1.414 2.121-2.121zM23 11v2h-3v-2h3zM4 11v2H1v-2h3z"
		/></symbol
	>
</svg>
<!--- Light mode button --->
<button
	class="color-mode__btn light--hidden"
	aria-label="Turn on light mode"
	on:click={toggleColorMode}
>
	<svg aria-hidden="true"><use href="#sm-sun-icon" /></svg>
</button>

<!--- Dark mode button --->
<button
	class="color-mode__btn dark--hidden"
	aria-label="Turn on dark mode"
	on:click={toggleColorMode}
>
	<svg aria-hidden="true"><use href="#sm-moon-icon" /></svg>
</button>

<style>
	button {
		background: none;
		border: none;
		margin: 0;
		padding: 0;
	}
	svg {
		fill: var(--base0);
		height: 25px;
		width: 25px;
	}
</style>
