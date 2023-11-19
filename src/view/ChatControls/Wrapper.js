import Wrapper from "./Wrapper.svelte";

// eslint-disable-next-line no-unused-vars
Hooks.on("renderChatLog", (chatlog, html, args) => {
   const chatControls = html[0].querySelector("#chat-controls");
   chatlog._vauxsChatEnhancements = new Wrapper({
      target: chatControls.parentElement,
      anchor: chatControls,
   });
});

// eslint-disable-next-line no-unused-vars
Hooks.on("closeChatLog", (chatlog, html, args) => {
   chatlog._vauxsChatEnhancements.$destroy();
   delete chatlog._vauxsChatEnhancements;
});

