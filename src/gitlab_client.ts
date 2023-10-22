import { Gitlab, CreateSnippetOptions, EditSnippetOptions } from '@gitbeaker/rest';

export const sharePublic = async (url: string, token: string, fileName: string, fileContent: string): Promise<string> => {
    const api = new Gitlab({
        host: url,
        token: token
      });

    const snippets = api.Snippets

    const cFile: CreateSnippetOptions = {
        visibility: 'public',
        files: [
            {
                content: fileContent,
                filePath: "note.md"
            }
        ]
    }

    const res = await snippets.create(fileName, cFile)
    return res.web_url
}

export const updatePublic = async (url: string, token: string, snippetId: number, fileName: string, fileContent: string): Promise<string> => {
    const api = new Gitlab({
        host: url,
        token: token
      });

    const snippets = api.Snippets

    const cFile: EditSnippetOptions = {
        files: [
            {
                content: fileContent,
                filePath: "note.md",
                action: 'update'
            }
        ]
    }

    const res = await snippets.edit(snippetId, cFile)
    return res.web_url
}
