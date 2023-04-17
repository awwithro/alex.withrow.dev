<script>
	import Markdown from '@magidoc/plugin-svelte-marked';
	export let data;
</script>

<Markdown source={data.markdown} />
