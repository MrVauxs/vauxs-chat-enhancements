import { TJSGameSettings } from "#runtime/svelte/store/fvtt/settings";
import { ArchiveShim } from "../view/Archive/ArchiveApp.js";
import { mId } from "./utils.js";

export const settings = new TJSGameSettings(mId);

/**
 * Get a setting store, or the game setting value itself.
 *
 * @param {string} setting - The setting to get.
 *
 * @param {boolean} store - Whether to get the store or the game setting value.
 *
 * @returns {*} - The setting store or the game setting value.
 */
export const getSetting = (setting, store = true) =>
	store ? settings.getStore(setting) : game.settings.get(mId, setting);

const array = [
	{
		folder: mId,
		namespace: mId,
		key: "dfceArchivesParsed",
		options: {
			scope: "world",
			config: false,
			type: Array,
			default: [],
		},
	},
	{
		folder: mId,
		namespace: mId,
		key: "chatBar",
		options: {
			name: "vauxs-chat-enhancements.settings.chatBar.title",
			hint: "vauxs-chat-enhancements.settings.chatBar.hint",
			scope: "user",
			config: true,
			type: Boolean,
			default: true,
		},
	},
	{
		folder: mId,
		namespace: mId,
		key: "loadLastArchive",
		options: {
			name: "vauxs-chat-enhancements.settings.loadLastArchive.title",
			hint: "vauxs-chat-enhancements.settings.loadLastArchive.hint",
			scope: "user",
			config: true,
			type: Boolean,
			default: false,
		},
	},
	{
		folder: mId,
		namespace: mId,
		key: "speakerMode",
		options: {
			name: "vauxs-chat-enhancements.settings.speakerMode.title",
			hint: "vauxs-chat-enhancements.settings.speakerMode.hint",
			scope: "user",
			config: true,
			type: Number,
			choices: {
				0: "vauxs-chat-enhancements.settings.speakerMode.choices.0", // Default (In-Character when Assigned or Selected)
				1: "vauxs-chat-enhancements.settings.speakerMode.choices.1", // Never Speak as PC
				2: "vauxs-chat-enhancements.settings.speakerMode.choices.2", // Always Out-of-Character
			},
		},
	},
];

Hooks.on("init", () => {
	settings.registerAll(array);

	game.settings.registerMenu(mId, "chat-archive", {
		name: "vauxs-chat-enhancements.settings.archive.title",
		hint: "vauxs-chat-enhancements.settings.archive.hint",
		label: "vauxs-chat-enhancements.controls.buttons.archive",
		icon: "fas fa-message",
		type: ArchiveShim,
	});
});

