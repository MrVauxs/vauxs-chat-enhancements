import BasicAppShell from "./view/BasicAppShell.svelte";
// eslint-disable-next-line no-unused-vars
Hooks.on('renderChatLog', (chatlog, html, args) => {
    const chatControls = document.getElementById('chat-controls');
    chatlog._vauxsChatEnhancements = new BasicAppShell({ target: chatControls.parentElement, anchor: chatControls });
});