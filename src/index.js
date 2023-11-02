import AboveChatControls from "./view/AboveChatControls.svelte";

// eslint-disable-next-line no-unused-vars
Hooks.on('renderChatLog', (chatlog, html, args) => {
    const chatControls = document.getElementById('chat-controls');
    chatlog._vauxsChatEnhancements = new AboveChatControls({ target: chatControls.parentElement, anchor: chatControls });
});