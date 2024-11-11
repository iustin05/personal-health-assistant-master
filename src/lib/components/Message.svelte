<script>
    import { fly, fade } from 'svelte/transition';
    import { backOut } from 'svelte/easing';
    import { User, Bot } from 'lucide-svelte';
    
    export let message;
    export let index;
    
    // Calculate animation delay based on message index
    $: delay = Math.min(index * 150, 800);
    
    // Format timestamp nicely
    $: formattedTime = new Date(message.created).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  </script>
  
  <div
    class="chat {message.user ? 'chat-end' : 'chat-start'} mb-6"
    in:fly={{ y: 20, delay, duration: 400, easing: backOut }}
    out:fade={{ duration: 200 }}
  >
    <div class="chat-image avatar">
      <div class="w-10 rounded-full bg-base-300 p-2">
        {#if message.user}
          <User class="w-full h-full text-primary" />
        {:else}
          <Bot class="w-full h-full text-secondary" />
        {/if}
      </div>
    </div>
    
    <div 
      class="chat-bubble {message.user ? 'chat-bubble-primary shadow-lg' : 'shadow-md'} 
             min-h-12 flex items-center"
    >
      <span class="whitespace-pre-wrap">{message.text}</span>
    </div>
    
    <div class="chat-footer opacity-50 text-xs mt-1">
      {formattedTime}
    </div>
  </div>