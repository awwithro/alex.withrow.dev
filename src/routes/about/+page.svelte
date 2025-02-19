<script>
	import MdPage from '$lib/MDPage.svelte';
	let { data } = $props();
</script>

<MdPage markdown={data.markdown} />
