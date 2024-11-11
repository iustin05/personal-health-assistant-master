<script>
  import { fade, slide } from 'svelte/transition';
  import { 
    ArrowLeft, 
    Plus, 
    Calendar,
    MessageSquare,
    MoreVertical,
    Trash2,
    Share2,
    Archive
  } from 'lucide-svelte';
  import { t } from '$lib/translations/translations';
  
  export let title = '';
  export let messageCount = 0;
  export let created = new Date();
  export let showBackButton = true;
  export let onBack = () => {};
  export let onReset = () => {};
  export let onDelete = () => {};
  export let onShare = () => {};
  export let onArchive = () => {};
  
  let showMenu = false;
  
  const toggleMenu = () => showMenu = !showMenu;
  const hideMenu = () => showMenu = false;
  
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString([], {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
</script>

<div class="border-b border-base-300 bg-base-100 sticky top-0 z-10">
  <div class="p-4 flex justify-between items-center">
    <div class="flex items-center gap-3">
      {#if showBackButton}
        <button 
          class="btn btn-ghost btn-circle md:hidden"
          on:click={onBack}
        >
          <ArrowLeft class="w-6 h-6" />
        </button>
      {/if}
      
      <div class="flex flex-col">
        <h3 class="text-lg font-bold line-clamp-1">{title}</h3>
        <div class="flex items-center gap-2 text-xs text-base-content/70">
          <div class="flex items-center gap-1">
            <Calendar class="w-3 h-3" />
            {formatDate(created)}
          </div>
          <div class="flex items-center gap-1">
            <MessageSquare class="w-3 h-3" />
            {messageCount} messages
          </div>
        </div>
      </div>
    </div>
    
    <div class="flex items-center gap-2">
      <button 
        class="btn btn-ghost btn-circle"
        on:click={onReset}
      >
        <Plus class="w-6 h-6" />
      </button>
      
      <div class="relative">
        <button 
          class="btn btn-ghost btn-circle"
          on:click={toggleMenu}
        >
          <MoreVertical class="w-6 h-6" />
        </button>
        
        {#if showMenu}
          <div 
            class="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-base-200 ring-1 ring-base-300"
            transition:slide={{ duration: 200 }}
            on:mouseleave={hideMenu}
          >
            <div class="py-1">
              <button
                class="flex items-center gap-2 px-4 py-2 text-sm w-full hover:bg-base-300"
                on:click={() => {
                  onShare();
                  hideMenu();
                }}
              >
                <Share2 class="w-4 h-4" />
                Share Chat
              </button>
              
              <button
                class="flex items-center gap-2 px-4 py-2 text-sm w-full hover:bg-base-300"
                on:click={() => {
                  onArchive();
                  hideMenu();
                }}
              >
                <Archive class="w-4 h-4" />
                Archive Chat
              </button>
              
              <button
                class="flex items-center gap-2 px-4 py-2 text-sm w-full text-error hover:bg-base-300"
                on:click={() => {
                  onDelete();
                  hideMenu();
                }}
              >
                <Trash2 class="w-4 h-4" />
                Delete Chat
              </button>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>