<script>
   import { getSetting } from "../../lib/settings";
   import AboveChatControls from "./AboveChatControls.svelte";
   import { currentSpeaker } from "../../lib/speakerTracker";

   const showBar = getSetting("chatBar");
</script>

<!--
   $showbar for smooth animations when changing the setting, and
   $currentSpeaker to avoid having the player see "undefined" when loading the game.
-->
{#if $showBar && $currentSpeaker}
   <AboveChatControls />
{/if}
