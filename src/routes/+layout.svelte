<script>
	import ThemeSwitch from '$lib/ThemeSwitch/ThemeSwitch.svelte';
</script>

<svelte:head>
	<title>awithrow.dev</title>
</svelte:head>
<header>
	<nav>
		<a href="/">awithrow.dev</a>
		<span class="links">
			<a href="/projects">Projects</a>
			<a href="/about">About</a>
			<a href="/cli">CLI</a>
			<ThemeSwitch />
		</span>
	</nav>
</header>

<article>
	<slot />
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
