<script>
   import { getSetting } from "../../lib/settings";
   import AboveChatControls from "./AboveChatControls.svelte";

   const showBar = getSetting("chatBar");
</script>

{#if $showBar}
   <AboveChatControls />
{/if}
