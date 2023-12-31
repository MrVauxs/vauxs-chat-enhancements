import { writable } from "svelte/store";
import { createEasyHook, slugify } from "./utils";
import { getSetting } from "./settings";

export default class ChatArchiver {
	constructor(messages, { name, description } = {}) {
		this._ogMessages = messages;
		this.chatMessages = messages;
		this.name = name ?? new Date(Date.now()).toDateString();
		this.description = description ?? "";
	}

	get firstMessage() {
		return this.chatMessages.at(0);
	}

	set firstMessage(message) {
		this.chatMessages = this._ogMessages.filter((m) =>
			m.timestamp >= typeof message === "number" ? message : message.timestamp
		);
	}

	get lastMessage() {
		return this.chatMessages.at(-1);
	}

	set lastMessage(message) {
		this.chatMessages = this._ogMessages.filter((m) =>
			m.timestamp <= typeof message === "number" ? message : message.timestamp
		);
	}

	toJSON() {
		return this.chatMessages.map((m) => (m.toJSON ? m.toJSON() : m));
	}

	deleteMessages() {
		this.chatMessages.forEach((m) => m.delete());
	}

	createArchive(deleteMessages = false) {
		const data = {
			name: this.name,
			date: Date.now(),
			description: this.description,
			id: randomID(),
			messages: this.toJSON(),
		};
		const content = JSON.stringify(data, null, "\t");
		const file = new File([content], `${slugify(`${data.name}-${data.id}`)}.json`, { type: "application/json" });

		FilePicker.upload("data", ChatArchiver.chatPath(), file).then(() => {
			Hooks.call("createChatArchive", true);
			if (deleteMessages) {
				this.deleteMessages();
			}
		});
	}

	static worldPath(suffix) {
		return suffix ? `worlds/${game.world.id}/${suffix}` : `worlds/${game.world.id}`;
	}

	static chatPath() {
		return ChatArchiver.worldPath("chat-archive");
	}

	static async createFolder() {
		await FilePicker.browse("data", ChatArchiver.worldPath()).then(async (result) => {
			if (!result.dirs.includes(ChatArchiver.chatPath())) {
				await FilePicker.createDirectory("data", ChatArchiver.chatPath());
			}
		});
	}

	static async getFiles() {
		await ChatArchiver.createFolder();
		return FilePicker.browse("data", ChatArchiver.chatPath(), { extensions: [".json"] }).then((result) => {
			return result.files;
		});
	}

	static async parseDFCE(path, isFine = false) {
		const fixedPath = isFine ? path : encodeURI(path);
		ui.notifications.error("Error parsing JSON message archive file! Attempting to parse it as a DFCE file...");

		const response = await fetch(fixedPath);
		if (response.ok) {
			const messages = await response.json();

			if (!getSetting("dfceArchivesParsed", false).includes(fixedPath)) {
				ui.notifications.notify("Successfully parsed DFCE file! Creating a new archive.");

				new ChatArchiver(messages, {
					name: decodeURI(decodeURI(path)).replace(".json", "").split("chat-archive/").pop(),
					description: `DF Chat Enhancements`,
				}).createArchive();

				getSetting("dfceArchivesParsed").set([...getSetting("dfceArchivesParsed", false), fixedPath]);
			} else {
				ui.notifications.warn(
					`The file ${path} has already been parsed! Please remove it from the chat-archive folder.`
				);
			}

			return messages;
		} else {
			throw Error("Failed to parse the file!");
		}
	}

	static async parsePathJSON(path) {
		const response = await fetch(path);
		if (!response.ok) {
			return await ChatArchiver.parseDFCE(path);
		}
		const json = await response.json();
		if (Array.isArray(json)) {
			return await ChatArchiver.parseDFCE(path, true);
		}
		return json;
	}

	static scrollToMessage(message) {
		const chatMessage = document.querySelector(`[data-message-id="${message.id}"]`);

		if (chatMessage) {
			chatMessage.scrollIntoView({ behavior: "smooth", block: "center" });
			chatMessage.classList.add("vce-highlight");
			setTimeout(() => {
				chatMessage.classList.remove("vce-highlight");
			}, 4000);
		} else {
			ui.notifications.warn(`Cannot find message! ID: ${message.id}`);
		}
	}

	static fromChatLog(store = false) {
		let result;
		if (store) {
			const archive = new ChatArchiver(game.messages.contents);
			result = writable(archive, (set) => {
				const trackingHooks = [
					createEasyHook("createChatMessage", () => {
						set(new ChatArchiver(game.messages.contents, archive));
					}),

					createEasyHook("deleteChatMessage", () => {
						set(new ChatArchiver(game.messages.contents, archive));
					}),
				];
				return () => trackingHooks.forEach((h) => h());
			});
		} else {
			result = new ChatArchiver(game.messages.contents);
		}
		return result;
	}

	/**
	 * Gets all chat archives in the world folder.
	 *
	 * @param {boolean} store Whether or not to return the archives as a writable store.
	 *
	 * @returns {Promise<Array<string>>} An array of file paths found in the chat-archive folder.
	 */
	static getArchives(store = false) {
		if (store) {
			return {
				...writable([], (set) => {
					const trackingHooks = [
						createEasyHook("createChatArchive", async () => {
							set(await ChatArchiver.getArchives());
						}),
					];
					return () => trackingHooks.forEach((h) => h());
				}),
				async init() {
					this.set(await ChatArchiver.getArchives());
				},
			};
		}
		return ChatArchiver.getFiles().then((res) =>
			Promise.all(res.map((path) => ChatArchiver.parsePathJSON(path))).then((jsons) =>
				jsons
					.filter((dfce) => !Array.isArray(dfce) && !dfce.DFCEparsed)
					.sort((a, b) => a.date - b.date)
					.map((json) => {
						return { ...json, _ogMessages: json.messages };
					})
			)
		);
	}
}

