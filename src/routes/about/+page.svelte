<script>
	import MdPage from '$lib/MDPage.svelte';
	export let data;
</script>

<MdPage markdown={data.markdown} />
