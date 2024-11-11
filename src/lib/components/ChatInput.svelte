<script>
  import { fade, fly } from 'svelte/transition';
  import { Send, Loader2, Sparkles } from 'lucide-svelte';
  import { t } from '$lib/translations/translations';
  
  export let value = '';
  export let onInput = () => {};
  export let onSend = () => {};
  export let isLoading = false;
  
  let inputElement;
  let height = 0;
  
  $: isTyping = value.length > 0;
  
  const handleKeydown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && value.trim()) onSend();
    }
  };
  
  const adjustHeight = () => {
    inputElement.style.height = 'auto';
    inputElement.style.height = `${Math.min(inputElement.scrollHeight, 200)}px`;
  };
</script>

<div 
  class="p-4 border-t border-base-300 flex-none bg-base-100"
  in:fly={{ y: 20, duration: 400 }}
>
  <div class="max-w-4xl mx-auto">
    <div class="flex flex-col gap-2">
      <div class="text-xs text-base-content/70 flex items-center gap-2">
        <Sparkles class="w-4 h-4" />
        {$t('chat.aiDisclaimer')}
      </div>
      
      <div class="flex items-end gap-2">
        <div class="relative flex-1">
          <textarea
            bind:this={inputElement}
            class="textarea textarea-bordered w-full pr-12 min-h-[3rem] max-h-[200px] resize-none"
            placeholder={$t('chat.inputPlaceholder')}
            rows="1"
            bind:value
            on:input={(e) => {
              adjustHeight();
              onInput(e);
            }}
            on:keydown={handleKeydown}
          />
          
          {#if isTyping}
            <div 
              class="absolute right-3 bottom-3 text-xs opacity-50"
              transition:fade
            >
              {value.length} / 2000
            </div>
          {/if}
        </div>
        
        <button
          class="btn btn-primary btn-circle"
          disabled={isLoading || !value.trim()}
          on:click={() => value.trim() && onSend()}
        >
          {#if isLoading}
            <Loader2 class="w-6 h-6 animate-spin" />
          {:else}
            <Send class="w-6 h-6" />
          {/if}
        </button>
      </div>
    </div>
  </div>
</div>