<script>
   import "../app.css";
   import IconMessages from "~icons/tabler/messages";
   import IconDots from "~icons/tabler/dots-vertical";
   import IconLockOpen from "~icons/tabler/lock-open";
   import IconLock from "~icons/tabler/lock";
   import { get, writable } from "svelte/store";
   import { onDestroy } from "svelte";
   import { localize } from "../lib/utils.js";
   import Tooltip from "./Components/Tooltip.svelte";
   import { overridingSpeaker } from "../features/getSpeakerOverride.js";
   import Ping from "./Components/Ping.svelte";
   import { getSetting } from "../lib/settings";
   import Options from "./Options.svelte";

   const speaker = writable(getSpeaker());
   const whispering = writable(false);

   function toggleSpeakerLock() {
      if (get(overridingSpeaker)) {
         overridingSpeaker.set(false);
      } else {
         overridingSpeaker.set(ChatMessage.getSpeaker());
      }
   }

   /**
    * @returns {object} The speaker object
    */
   function getSpeaker() {
      const spk = ChatMessage.getSpeaker();
      const img = spk.token ? game.scenes.get(spk.scene).tokens.get(spk.token).texture.src : game.user.avatar;
      const scale = spk.token ? game.scenes.get(spk.scene).tokens.get(spk.token).texture.scaleX : 1;

      return {
         img,
         scale,
         ...spk,
      };
   }

   const tokenHookId = Hooks.on("controlToken", () => {
      speaker.set(getSpeaker());
   });

   overridingSpeaker.subscribe(() => {
      speaker.set(getSpeaker());
   });

   let pinnedButtons = getSetting("pinnedButtons");

   onDestroy(() => {
      Hooks.off("controlToken", tokenHookId);
      Object.keys(cleanup).forEach((key) => {
         cleanup[key]();
      });
   });

   let tooltipButton = {};
   let toggleTooltip = {};
   let cleanup = {};
</script>

<Tooltip
   tooltipButton={tooltipButton.options}
   bind:toggleTooltip={toggleTooltip.options}
   bind:cleanup={cleanup.options}
>
   <Options />
</Tooltip>

<Tooltip
   tooltipButton={tooltipButton.whisper}
   bind:toggleTooltip={toggleTooltip.whisper}
   bind:cleanup={cleanup.whisper}
>
   Whisper Whisper Whisper Whisper
</Tooltip>

<div class="vce vce-main-div">
   <div class="border border-foundry-border-light-primary rounded-md p-0.5 my-1">
      <div class="grid-cols-5 grid h-8">
         <div id="icon" class="col-span-1 ml-0.5 hover:scale-110 transition-transform">
            <img
               src={$speaker.img}
               alt={$speaker.alias}
               class="w-8 h-8 object-contain"
               style="transform: scale({$speaker.scale});"
            />
         </div>
         <div
            id="name"
            class="p-0.5 col-span-3 truncate align-middle text-center text-lg"
            data-tooltip={$speaker.alias}
            data-tooltip-direction="UP"
         >
            {$speaker.alias}
         </div>
         <div class="col-span-1 flex right-0 ml-auto gap-x-0.5">
            <!-- Whisper Button -->
            {#if $pinnedButtons.includes("whisperTo")}
               <Ping condition={$whispering}>
                  <button
                     id="whisperTo"
                     class="hover:bg-foundry-checkbox-checked click"
                     data-tooltip-direction="UP"
                     data-tooltip={localize("vce.controls.buttons.whisperTo")}
                     on:click={toggleTooltip.whisper}
                     bind:this={tooltipButton.whisper}
                  >
                     {#if $whispering}
                        <IconMessages class="w-full" />
                     {:else}
                        <IconMessages class="w-full" />
                     {/if}
                  </button>
               </Ping>
            {/if}

            <!-- Lock Button -->
            {#if $pinnedButtons.includes("lockSpeaker")}
               <Ping condition={$overridingSpeaker}>
                  <button
                     id="lockSpeaker"
                     class="hover:bg-foundry-checkbox-checked click"
                     on:click={toggleSpeakerLock}
                     data-tooltip-direction="UP"
                     data-tooltip={localize("vce.controls.buttons.lockSpeaker")}
                  >
                     {#if $overridingSpeaker}
                        <IconLock class="w-full" />
                     {:else}
                        <IconLockOpen class="w-full" />
                     {/if}
                  </button>
               </Ping>
            {/if}

            <!-- Options Button -->
            <Ping condition={$overridingSpeaker || $whispering}>
               <button
                  id="options"
                  class="relative hover:bg-foundry-checkbox-checked click"
                  on:click={toggleTooltip.options}
                  bind:this={tooltipButton.options}
               >
                  <IconDots class="w-full" />
               </button>
            </Ping>
         </div>
      </div>
   </div>
</div>

<style>
   .vce-main-div {
      flex: 0;
      margin: 0 6px;
   }
</style>
