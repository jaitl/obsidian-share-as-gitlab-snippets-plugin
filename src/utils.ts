export const extractIdFromSnippetUrl = (snippetUrl: string): number | null => {
    const segments = new URL(snippetUrl).pathname.split('/');
    const snippetId = segments.pop() || segments.pop();
    if (snippetId == null) return null
    return parseInt(snippetId)
}
