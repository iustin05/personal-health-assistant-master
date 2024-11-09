<script>
  import { t } from '$lib/translations/translations';
  
  export let value = '';
  export let onInput = () => {};
  export let onSend = () => {};
  
  const handleKeydown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };
</script>

<div class="p-4 border-t border-base-300 flex-none">
  <div class="input-group flex flex-col gap-2">
    <div class="text-xs text-base-content/70">
      {$t('chat.aiDisclaimer')}
    </div>
    <div class="flex flex-row">
      <input
        type="text"
        placeholder={$t('chat.inputPlaceholder')}
        class="input input-bordered flex-1 mr-2"
        {value}
        on:input={onInput}
        on:keydown={handleKeydown}
      />
      <button
        class="btn btn-primary"
        on:click={onSend}
      >
        {$t('chat.sendButton')}
      </button>
    </div>
  </div>
</div>