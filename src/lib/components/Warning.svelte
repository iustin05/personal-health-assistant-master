<script>
    import { ArrowBigDownDashIcon } from 'lucide-svelte';
    import { t } from '$lib/translations/translations';
  </script>
  
  <div class="bg-warning/20 p-3 text-sm">
    <div class="container mx-auto flex items-center gap-2">
      <ArrowBigDownDashIcon class="h-5 w-5 text-warning" />
      <p>{$t('chat.aiHeaderDisclaimer')}</p>
    </div>
  </div>