<script>
   export let condition = false;
   export let classes = "";
</script>

<div class="relative flex {classes}">
   {#if condition}
      <span
         class="z-10 animate-ping absolute right-0 inline-flex h-2 w-2 -m-[0.075rem] rounded-full bg-foundry-border-highlight opacity-75"
      />
      <span
         class="z-10 absolute right-0 inline-flex h-1.5 w-1.5 rounded-full bg-foundry-border-highlight-alt opacity-60"
      />
   {/if}
   <slot />
</div>
