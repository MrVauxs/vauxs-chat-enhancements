import { get, writable } from "svelte/store";
import { getSetting } from "./settings";

export const override = writable(false);

// eslint-disable-next-line no-unused-vars
Hooks.on("preCreateChatMessage", (message, data, options, userId) => {
	if (CONST.CHAT_MESSAGE_TYPES.IC !== message.type && CONST.CHAT_MESSAGE_TYPES.OOC !== message.type) return;

	const newData = {
		type: message.type,
		speaker: message.speaker,
	};

	const overridingData = get(override);
	if (overridingData) {
		if (overridingData.actor || overridingData.token) {
			newData.type = CONST.CHAT_MESSAGE_TYPES.IC;
		} else {
			newData.type = CONST.CHAT_MESSAGE_TYPES.OOC;
		}
		newData.speaker = overridingData;
		message.updateSource(newData);
	}

	switch (getSetting("speakerMode", false)) {
		case 1:
			// Never Speak as PC
			if (ChatMessage.getSpeakerActor(message.speaker)?.hasPlayerOwner) {
				newData.type = CONST.CHAT_MESSAGE_TYPES.OOC;
				newData.speaker = ChatMessage._getSpeakerFromUser({ scene: message.speaker.scene, user: game.user });
			}
			break;
		case 2:
			// Always Out-of-Character
			newData.type = CONST.CHAT_MESSAGE_TYPES.OOC;
			newData.speaker = ChatMessage._getSpeakerFromUser({ scene: message.speaker.scene, user: game.user });
			break;
	}

	message.updateSource(newData);
});

