<script>
  import { onMount, tick } from 'svelte';
  import { fade, slide } from 'svelte/transition';
  import { backOut } from 'svelte/easing';
  import { ArrowDown } from 'lucide-svelte';
  import Message from './Message.svelte';
  import { t } from '$lib/translations/translations';
  
  export let messages = [];
  
  let scrollContainer;
  let showScrollButton = false;
  let isAutoScrolling = true;
  
  // Auto-scroll logic
  const scrollToBottom = async (behavior = 'smooth') => {
    await tick();
    if (scrollContainer) {
      scrollContainer.scrollTo({
        top: scrollContainer.scrollHeight,
        behavior
      });
    }
  };
  
  // Watch for new messages
  $: if (messages.length) {
    if (isAutoScrolling) {
      scrollToBottom();
    }
  }
  
  // Handle scroll events
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);
    
    showScrollButton = distanceFromBottom > 100;
    isAutoScrolling = distanceFromBottom < 100;
  };
  
  // Group messages by date
  $: groupedMessages = messages.reduce((groups, message) => {
    const date = new Date(message.created).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});
  
  onMount(() => {
    scrollToBottom('auto');
  });
</script>

<div 
  class="relative flex-1 overflow-y-auto min-h-0"
  bind:this={scrollContainer}
  on:scroll={handleScroll}
>
  <div class="flex flex-col gap-2 p-4">
    {#each Object.entries(groupedMessages) as [date, dateMessages]}
      <div class="relative my-4">
        <div 
          class="absolute inset-0 flex items-center"
          aria-hidden="true"
        >
          <div class="w-full border-t border-base-300"></div>
        </div>
        <div class="relative flex justify-center">
          <div 
            class="px-3 py-1 text-xs rounded-full bg-base-200 text-base-content/70"
            in:fade
          >
            {new Date(date).toLocaleDateString([], {
              weekday: 'long',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>
      </div>
      
      {#each dateMessages as message, index}
        <Message {message} {index} />
      {/each}
    {/each}
    
    {#if messages.length === 0}
      <div 
        class="flex flex-col items-center justify-center h-full gap-4 text-base-content/50"
        in:fade
      >
        <div class="w-16 h-16 rounded-full bg-base-200 flex items-center justify-center">
          <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>
        <p class="text-sm font-medium">{$t('chat.emptyState')}</p>
      </div>
    {/if}
  </div>
  
  {#if showScrollButton}
    <button
      class="absolute bottom-4 right-4 btn btn-circle btn-primary shadow-lg"
      on:click={() => {
        isAutoScrolling = true;
        scrollToBottom();
      }}
      transition:slide
    >
      <ArrowDown class="w-6 h-6" />
    </button>
  {/if}
</div>