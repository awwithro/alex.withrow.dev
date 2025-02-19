<script>
	import Markdown from '@magidoc/plugin-svelte-marked';
	let { data } = $props();
</script>

<Markdown source={data.markdown} />
