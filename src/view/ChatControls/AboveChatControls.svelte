<script context="module">
   export const whispering = writable(false);
   export const overridingSpeaker = writable(false);
</script>

<script>
   import "../../app.css";
   import IconMessages from "~icons/tabler/messages";
   import IconDots from "~icons/tabler/dots-vertical";
   import IconLockOpen from "~icons/tabler/lock-open";
   import IconLock from "~icons/tabler/lock";
   import { get, writable } from "svelte/store";
   import { localize } from "../../lib/utils.js";
   import Tooltip from "../Components/Tooltip.svelte";
   import Ping from "../Components/Ping.svelte";
   import Options from "./Components/Options.svelte";
   import Whisper from "./Components/Whisper.svelte";
   import { fly } from "svelte/transition";
   import { currentSpeaker } from "../../lib/speakerTracker";
   import { getSetting } from "../../lib/settings";

   let tooltipButton = {};
   let toggleTooltip = {};

   const speakerMode = getSetting("speakerMode");
   const realSpeaker = writable($currentSpeaker);

   function updateRealSpeaker(speaker) {
      let newSpeaker = speaker;
      switch (getSetting("speakerMode", false)) {
         case 1:
            // Never Speak as PC
            if (ChatMessage.getSpeakerActor(speaker)?.hasPlayerOwner) {
               newSpeaker = ChatMessage._getSpeakerFromUser({ scene: speaker.scene, user: game.user });
               newSpeaker.overriden = 2;
            }
            break;
         case 2:
            // Always Out-of-Character
            if (speaker.actor || speaker.token) {
               newSpeaker = ChatMessage._getSpeakerFromUser({ scene: speaker.scene, user: game.user });
               newSpeaker.overriden = 2;
            }
            break;
      }

      realSpeaker.set({
         overriden: 0,
         ...newSpeaker,
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
      });
   }

   // Change shown speaker on Settings Change
   speakerMode.subscribe(() => updateRealSpeaker($currentSpeaker));
   // Change shown speaker on Speaker Change
   currentSpeaker.subscribe((speaker) => updateRealSpeaker(speaker));
   // Notify whenever the speaker is Overriden
   realSpeaker.subscribe((speaker) => {
      if (speaker.overriden) {
         overridingSpeaker.set(true);
      } else {
         overridingSpeaker.set(false);
      }
   });
</script>

<Tooltip tooltipButton={tooltipButton.options} bind:toggleTooltip={toggleTooltip.options}>
   <Options />
</Tooltip>

<Tooltip tooltipButton={tooltipButton.whisper} bind:toggleTooltip={toggleTooltip.whisper}>
   <Whisper />
</Tooltip>

<div class="vce vce-main-div" transition:fly={{ y: 50, duration: 750 }}>
   <div class="border border-foundry-border-light-primary rounded-md p-0.5 my-1">
      <div class="grid-cols-5 grid h-8">
         <div id="icon" class="col-span-1 ml-0.5">
            <img
               src={$realSpeaker.img}
               alt={$realSpeaker.alias}
               class="w-8 h-8 object-contain border-none"
               style="transform: scale({$realSpeaker.scale});"
            />
         </div>
         <div
            id="name"
            class="p-0.5 col-span-3 truncate align-middle text-center text-lg"
            data-tooltip={$realSpeaker.alias}
            data-tooltip-direction="UP"
         >
            {$realSpeaker.alias}
         </div>
         <div class="col-span-1 flex right-0 ml-auto gap-x-0.5">
            <!-- Whisper Button -->
            <Ping condition={$whispering}>
               <button
                  id="whisperTo"
                  class="hover:bg-foundry-checkbox-checked click border-none"
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

            <!-- Lock Button -->

            <Ping condition={$overridingSpeaker}>
               <button
                  id="lockSpeaker"
                  class="hover:bg-foundry-checkbox-checked click border-none"
                  on:click={() => {
                     console.log("heck");
                  }}
                  data-tooltip-direction="UP"
                  data-tooltip={localize(`vce.controls.buttons.lockSpeaker.${$realSpeaker.overriden}`)}
               >
                  {#if $overridingSpeaker}
                     <IconLock class="w-full" />
                  {:else}
                     <IconLockOpen class="w-full" />
                  {/if}
               </button>
            </Ping>

            <!-- Options Button -->
            <Ping condition={$overridingSpeaker || $whispering}>
               <button
                  id="options"
                  class="relative hover:bg-foundry-checkbox-checked click border-none"
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
