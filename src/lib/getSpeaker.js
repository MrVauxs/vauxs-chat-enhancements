import { writable } from "svelte/store";
const speaker = writable(getSpeaker());

/**
 * @returns {object} The speaker object
 */
function getSpeaker() {
    const spk = ChatMessage.getSpeaker();
    return {
        img: spk.token ? game.scenes.get(spk.scene).tokens.get(spk.token).texture.src : game.user.avatar,
        scale: spk.token ? game.scenes.get(spk.scene).tokens.get(spk.token).texture.scaleX : 1,
        ...spk,
    };
}

Hooks.on("controlToken", () => {
    speaker.set(getSpeaker());
});

export default speaker;