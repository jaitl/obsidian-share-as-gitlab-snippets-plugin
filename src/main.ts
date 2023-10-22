import { App, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { sharePublic, updatePublic } from './gitlab_client';
import { saveSnippetUrl, extractSnippetUrl, extractFileBody } from './obsidian_client';
import { extractIdFromSnippetUrl } from './utils'

// Remember to rename these classes and interfaces!

interface ShareToGitLabSnippetsPluginSettings {
	gitlabUrl: string;
	accessToken: string;
}

const DEFAULT_SETTINGS: ShareToGitLabSnippetsPluginSettings = {
	gitlabUrl: 'https://gitlab.com',
	accessToken: ''
}

export default class ShareToGitLabSnippetsPlugin extends Plugin {
	settings: ShareToGitLabSnippetsPluginSettings;

	async onload() {
		await this.loadSettings();

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'share-or-update-public-snippet',
			name: 'share or update public snippet',
			callback: async() => {
				const curFile = this.app.workspace.getActiveFile();
				if (curFile == null) return;
				const fileName = curFile.basename
				const fileBody = await extractFileBody(curFile, this.app);
				const snippetUrl = extractSnippetUrl(curFile, this.app)
				if (snippetUrl == null) {
					const url = await sharePublic(this.settings.gitlabUrl, this.settings.accessToken, fileName, fileBody)
					await saveSnippetUrl(url, curFile, this.app);
					new Notice(`shared to ${url}`)
				} else {
					const snippetId = extractIdFromSnippetUrl(snippetUrl)
					if (snippetId == null) {
						new Notice(`snippetId not found in ${snippetUrl}`)
						return
					}
					const url = await updatePublic(this.settings.gitlabUrl, this.settings.accessToken, snippetId, fileName, fileBody)
					new Notice(`shared to ${url}`)
				}
			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new ShareToGitLabSnippetsSettingTab(this.app, this));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class ShareToGitLabSnippetsSettingTab extends PluginSettingTab {
	plugin: ShareToGitLabSnippetsPlugin;

	constructor(app: App, plugin: ShareToGitLabSnippetsPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('GitLab url')
			.addText(text => text
				.setValue(this.plugin.settings.gitlabUrl)
				.onChange(async (value) => {
					this.plugin.settings.gitlabUrl = value;
					await this.plugin.saveSettings();
				}));
		new Setting(containerEl)
			.setName('GitLab access token')
			.setDesc('Token must have access to api scope')
			.addText(text => text
				.setPlaceholder('Enter GitLab access token')
				.setValue(this.plugin.settings.accessToken)
				.onChange(async (value) => {
					this.plugin.settings.accessToken = value;
					await this.plugin.saveSettings();
				}));
	}
}
