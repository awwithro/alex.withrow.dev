<script>
	import Markdown from '@magidoc/plugin-svelte-marked';
	let { markdown } = $props();
</script>

<Markdown source={markdown} />
