<script>
   import "../app.postcss";
   import IconSettings from "~icons/tabler/settings";
   import IconDots from "~icons/tabler/dots-vertical";
   import speaker from "../lib/getSpeaker.js";
</script>

<div class="vce vce-main-div">
   <div class="border border-foundry-border-light-primary rounded-md p-0.5 my-1">
      <div class="grid-cols-6 grid gap-1 h-8">
         <div id="icon" class="col-span-1 ml-0.5">
            <img src={$speaker.img} alt={$speaker.alias} class="w-8 h-8 scale-[{$speaker.scale * 100}%]" />
         </div>
         <div
            id="name"
            class="p-0.5 col-span-4 truncate align-middle text-center text-lg"
            data-tooltip={$speaker.alias}
            data-tooltip-direction="UP"
         >
            {$speaker.alias}
         </div>
         <div class="col-span-1 flex">
            <button id="settings" class="w-1/2"> <IconSettings class="w-full" /> </button>
            <button id="settings" class="w-1/2"> <IconDots class="w-full" /> </button>
         </div>
      </div>
   </div>
</div>

<style>
   .vce-main-div {
      flex: 0;
      margin: -3px 6px 0;
   }
</style>
