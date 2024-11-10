<script>
    import { ArrowLeft, Plus } from 'lucide-svelte';
    // import { t } from '$lib/translations/translations';
    export let title;
    export let showBackButton = false;
    export let onBack = () => {};
    export let onReset = () => {};
  </script>
  
  <div class="p-4 border-b border-base-300 flex justify-between items-center flex-none">
    <div class="flex items-center gap-2">
      {#if showBackButton}
        <button class="btn btn-ghost btn-sm md:hidden" on:click={onBack}>
          <ArrowLeft class="w-6 h-6" />
        </button>
      {/if}
      <h3 class="text-lg font-bold">{title}</h3>
    </div>
    
    <button class="btn btn-ghost btn-circle" on:click={onReset}>
      <Plus class="w-6 h-6" />
    </button>
  </div>