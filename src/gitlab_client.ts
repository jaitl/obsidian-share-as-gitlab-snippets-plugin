import { Gitlab, CreateSnippetOptions, EditSnippetOptions } from '@gitbeaker/rest';

export const sharePublic = async (url: string, token: string, fileName: string, fileContent: string): Promise<string> => {
    const api = new Gitlab({
        host: url,
        token: token
      });

    const fileOptions: CreateSnippetOptions = {
        visibility: 'public',
        files: [
            {
                content: fileContent,
                filePath: "note.md"
            }
        ]
    }

    const res = await api.Snippets.create(fileName, fileOptions)
    return res.web_url
}

export const updatePublic = async (url: string, token: string, snippetId: number, fileContent: string): Promise<string> => {
    const api = new Gitlab({
        host: url,
        token: token
      });
      
    const fileOptions: EditSnippetOptions = {
        files: [
            {
                content: fileContent,
                filePath: "note.md",
                action: 'update'
            }
        ]
    }

    const res = await api.Snippets.edit(snippetId, fileOptions)
    return res.web_url
}
