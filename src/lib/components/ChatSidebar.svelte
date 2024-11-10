<script>
    import { fade } from 'svelte/transition';
    import { sineIn } from 'svelte/easing';
    import { Plus } from 'lucide-svelte';
    import { t } from '$lib/translations/translations';
    export let chatLogic;
    export let chats = [];
    export let selectedChatId = null;
    export let isChatOpen = false;
    export let isMobileMenuOpen = false;
  </script>
  
  <div
    transition:fade={{duration: 100, easing: sineIn}}
    class="w-full md:w-1/4 bg-base-200 border-r border-base-300 ease-in transition-all duration-300 
    {isMobileMenuOpen ? 'opacity-0 hidden' : 'opacity-100'} 
    {isChatOpen ? 'hidden md:block' : 'block'}"
  >
    <div class="h-full flex flex-col">
      <div class="p-4 border-b border-base-300 flex justify-between items-center">
        <h2 class="text-xl font-bold">Chats</h2>
        <button 
          class="btn btn-ghost btn-circle"
          on:click={() => chatLogic.createNewChat()}
        >
          <Plus class="w-6 h-6" />
        </button>
      </div>
      
      <div class="flex-1 overflow-y-auto">
        {#each chats as chat (chat.id)}
          <div 
            class="p-4 hover:bg-base-300 cursor-pointer border-b border-base-300 {selectedChatId === chat.id ? 'bg-base-300' : ''}"
            on:click={() => chatLogic.selectChat(chat.id)}
          >
            <div class="font-semibold">{chat.title}</div>
            <div class="text-xs text-base-content/50">
              {new Date(chat.created).toLocaleString()}
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>