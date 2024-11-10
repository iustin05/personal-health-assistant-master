<script>
    import { fade } from 'svelte/transition';
    import { AlertCircle } from 'lucide-svelte';
    import { t } from '$lib/translations/translations';
    export let message;
  </script>
  
  <div class="bg-error/30 p-4 flex-none" transition:fade>
    <div class="container mx-auto flex items-start gap-3">
      <AlertCircle class="animate-ping h-6 w-6 text-error flex-shrink-0 mt-1" />
      <div class="flex flex-col gap-1">
        <h3 class="font-bold text-error">{$t('chat.emergencyNotice')}</h3>
        <p class="text-error text-sm">{message}</p>
      </div>
    </div>
  </div>