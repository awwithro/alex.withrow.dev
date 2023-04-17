import { loadMarkdown } from "$lib/server/MDLoader"

export async function load(){
    return {
        markdown: await loadMarkdown("about/about.md")
    }
}