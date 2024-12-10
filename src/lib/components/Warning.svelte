<script>
  import { ArrowBigDownDashIcon, XIcon } from 'lucide-svelte';
  import { t } from '$lib/translations/translations';
  import { writable } from 'svelte/store';
  
  const isVisible = writable(true);
  
  function closeAlert() {
    isVisible.set(false);
  }
  </script>
  
  {#if $isVisible}
    <div class="bg-warning/20 p-3 text-sm">
      <div class="container mx-auto flex items-center justify-between gap-2">
        <div class="flex items-center gap-2">
          <ArrowBigDownDashIcon class="h-5 w-5 text-warning" />
          <p>{$t('chat.aiHeaderDisclaimer')}</p>
        </div>
        <button 
          on:click={closeAlert}
          class="text-warning hover:text-warning/80 transition-colors"
          aria-label="Close alert"
        >
          <XIcon class="h-5 w-5" />
        </button>
      </div>
    </div>
  {/if}