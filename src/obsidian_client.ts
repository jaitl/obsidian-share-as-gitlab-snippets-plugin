
import { App, TFile } from 'obsidian';

const SNIPPET_URL_PROPERTY_NAME = 'gitlab-snippet-url'

export const saveSnippetUrl = async(url: string, file: TFile, app: App): Promise<void> => {
    return app.fileManager.processFrontMatter(file, (frontmatter) => {
        if (frontmatter[SNIPPET_URL_PROPERTY_NAME] == null) {
            frontmatter[SNIPPET_URL_PROPERTY_NAME] = url
        }
    });
}

export const extractSnippetUrl = (file: TFile, app: App): string | undefined => {
    const metadata = app.metadataCache.getFileCache(file)
    const frontmatter = metadata?.frontmatter
    if (frontmatter == undefined) {
        return undefined;
    }
    return frontmatter[SNIPPET_URL_PROPERTY_NAME]
}

export const extractFileBody = async(file: TFile, app: App): Promise<string> => {
    const fileContent = await app.vault.cachedRead(file)
    const fileCache = app.metadataCache.getFileCache(file)
    const frontMatterEndOffset = fileCache?.frontmatterPosition?.end.offset
    if (frontMatterEndOffset == null) {
        return fileContent
    }
    return fileContent.substring(frontMatterEndOffset)
}
