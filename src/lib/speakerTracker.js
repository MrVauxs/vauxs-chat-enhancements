// https://github.com/MrVauxs/speaking-as/blob/master/scripts/speaking-as.js#L192
// https://github.com/cs96and/FoundryVTT-CGMP/blob/master/module/scripts/chat-resolver.js#L136
import { readable } from "svelte/store";

export const currentSpeaker = readable(false, (set) => {
	Hooks.on("vce-changeSpeaker", (data = ChatMessage.getSpeaker()) => {
		const enhSpeaker = {
			...data,
			get img() {
				if (this.token) {
					return game.scenes.get(this.scene).tokens.get(this.token).texture.src;
				} else {
					return game.user.avatar;
				}
			},
			get scale() {
				if (this.token) {
					return game.scenes.get(this.scene).tokens.get(this.token).texture.scaleX;
				} else {
					return 1;
				}
			},
		};

		set(enhSpeaker);

		if (CONFIG.debug.vce) {
			console.log(
				`%cVauxs Chat Enhancements%c, | %cNew Speaker`,
				"color:#53b0cf",
				"",
				"color:yellow",
				enhSpeaker
			);
		}
	});
});

Hooks.on("init", () => {
	// Trigger the changeSpeaker hook so it doesn't start empty.
	Hooks.on("ready", () => Hooks.call("vce-changeSpeaker", ChatMessage.getSpeaker()));

	// Trigger the changeSpeaker hook when the speaker changes.
	Hooks.on("controlToken", () => Hooks.call("vce-changeSpeaker", ChatMessage.getSpeaker()));
	Hooks.on("updateToken", () => Hooks.call("vce-changeSpeaker", ChatMessage.getSpeaker()));
});

// const img = spk.token ? game.scenes.get(spk.scene).tokens.get(spk.token).texture.src : game.user.avatar;
// const scale = spk.token ? game.scenes.get(spk.scene).tokens.get(spk.token).texture.scaleX : 1;

