<script>
	import ThemeSwitch from '$lib/ThemeSwitch/ThemeSwitch.svelte';
	/**
	 * @typedef {Object} Props
	 * @property {import('svelte').Snippet} [children]
	 */

	/** @type {Props} */
	let { children } = $props();
</script>

<svelte:head>
	<title>alex.withrow.dev</title>
</svelte:head>
<header>
	<nav>
		<a href="/">alex.withrow.dev</a>
		<span class="links">
			<a href="/about">About</a>
			<a href="/resume">Resume</a>
			<a href="/projects">Projects</a>
			<a href="/cli">CLI</a>
			<ThemeSwitch />
		</span>
	</nav>
</header>

<article>
	{@render children?.()}
</article>

<style>
	@import url(https://fonts.googleapis.com/css?family=Roboto+Mono);
	header {
		font-family: 'Roboto Mono';
	}
	.links {
		display: flex;
	}
	a {
		margin-right: 5px;
	}

	.links {
		float: right;
	}
</style>
