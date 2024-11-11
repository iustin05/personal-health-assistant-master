<script>
  import { fade, slide } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import { 
    Plus, 
    Search, 
    MessageSquare,
    Calendar,
    Clock,
    AlertCircle
  } from 'lucide-svelte';
  import { t } from '$lib/translations/translations';
  
  export let chatLogic;
  export let chats = [];
  export let selectedChatId = null;
  export let isChatOpen = false;
  export let isMobileMenuOpen = false;
  
  let searchQuery = '';
  let isSearchFocused = false;
  
  // Filter chats based on search query
  $: filteredChats = chats.filter(chat => 
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Group chats by date
  $: groupedChats = filteredChats.reduce((groups, chat) => {
    const date = new Date(chat.created).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(chat);
    return groups;
  }, {});
  
  const formatRelativeTime = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return new Date(date).toLocaleDateString();
  };
</script>

<div
  class="w-full md:w-1/4 bg-base-200 border-r border-base-300 flex flex-col h-full
         {isMobileMenuOpen ? 'hidden' : ''} 
         {isChatOpen ? 'hidden md:flex' : 'flex'}"
  in:slide={{duration: 300, easing: quintOut}}
>
  <div class="p-4 border-b border-base-300">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold">{$t('chat.sidebar.title')}</h2>
      <button 
        class="btn btn-primary btn-circle"
        on:click={() => chatLogic.createNewChat()}
      >
        <Plus class="w-6 h-6" />
      </button>
    </div>
    
    <div class="relative">
      <input
        type="text"
        class="input input-bordered w-full pl-10 {isSearchFocused ? 'input-primary' : ''}"
        placeholder={$t('chat.sidebar.searchPlaceholder')}
        bind:value={searchQuery}
        on:focus={() => isSearchFocused = true}
        on:blur={() => isSearchFocused = false}
      />
      <Search class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50" />
    </div>
  </div>
  
  <div class="flex-1 overflow-y-auto">
    {#if filteredChats.length === 0}
      <div 
        class="p-8 text-center text-base-content/70"
        transition:fade
      >
        <Search class="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p class="text-sm">
          {searchQuery ? 'No chats found' : 'No chats yet'}
        </p>
      </div>
    {:else}
      {#each Object.entries(groupedChats) as [date, dateChats]}
        <div class="px-4 py-2 text-xs text-base-content/50 bg-base-300/50">
          {formatRelativeTime(date)}
        </div>
        
        {#each dateChats as chat (chat.id)}
          <div 
            class="p-3 hover:bg-base-300 cursor-pointer border-b border-base-300 
                   transition-colors duration-200
                   {selectedChatId === chat.id ? 'bg-base-300' : ''}"
            on:click={() => chatLogic.selectChat(chat.id)}
            transition:slide={{duration: 200}}
          >
            <div class="flex items-start gap-3">
              <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <MessageSquare class="w-5 h-5 text-primary" />
              </div>
              
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-2">
                  <h3 class="font-medium truncate">{chat.title}</h3>
                  <time class="text-xs text-base-content/50 whitespace-nowrap">
                    {new Date(chat.created).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </time>
                </div>
                
                <div class="flex items-center gap-2 mt-1 text-xs text-base-content/70">
                  <!-- <div class="flex items-center gap-1">
                    <Clock class="w-3 h-3" />
                    <span>{chat.duration || '0m'}</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <MessageSquare class="w-3 h-3" />
                    <span>{chat.messageCount || 0}</span>
                  </div> -->
                  {#if chat.emergency_message}
                    <div 
                      class="flex items-center gap-1 text-error"
                      transition:fade
                    >
                      <AlertCircle class="w-3 h-3" />
                      <span>{$t('chat.sidebar.emergency')}</span>
                    </div>
                  {/if}
                </div>
              </div>
            </div>
          </div>
        {/each}
      {/each}
    {/if}
  </div>
</div>