export const extractIdFromSnippetUrl = (snippetUrl: string): number | undefined => {
    const segments = new URL(snippetUrl).pathname.split('/');
    const snippetId = segments.pop() || segments.pop();
    if (snippetId == null) return undefined
    return parseInt(snippetId)
}
