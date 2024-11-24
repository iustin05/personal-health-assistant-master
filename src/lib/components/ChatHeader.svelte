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
    Download,
    FileDown,
    Files,
    FilesIcon
  } from 'lucide-svelte';
  import { t } from '$lib/translations/translations';
  
  export let title = '';
  export let messageCount = 0;
  export let created = new Date();
  export let showBackButton = true;
  export let onBack = () => {};
  export let onReset = () => {};
  export let onDelete = () => {};
  export let onExportCurrentCSV = () => {};
  export let onExportCurrentPDF = () => {};
  export let onExportAllCSV = () => {};
  export let onExportAllPDF = () => {};
  
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
            class="absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-base-200 ring-1 ring-base-300"
            transition:slide={{ duration: 200 }}
            on:mouseleave={hideMenu}
          >
            <div class="py-1">
              <div class="px-3 py-2 text-sm font-medium text-base-content/70">Current Chat</div>
              <button
                class="flex items-center gap-2 px-4 py-2 text-sm w-full hover:bg-base-300"
                on:click={() => {
                  onExportCurrentCSV();
                  hideMenu();
                }}
              >
                <Download class="w-4 h-4" />
                Export as CSV
              </button>
              
              <button
                class="flex items-center gap-2 px-4 py-2 text-sm w-full hover:bg-base-300"
                on:click={() => {
                  onExportCurrentPDF();
                  hideMenu();
                }}
              >
                <FileDown class="w-4 h-4" />
                Export as PDF (BETA)
              </button>

              <div class="divider my-1"></div>
              
              <div class="px-3 py-2 text-sm font-medium text-base-content/70">All Chats</div>
              <button
                class="flex items-center gap-2 px-4 py-2 text-sm w-full hover:bg-base-300"
                on:click={() => {
                  onExportAllCSV();
                  hideMenu();
                }}
              >
                <Files class="w-4 h-4" />
                Export All as CSV
              </button>
              
              <button
                class="flex items-center gap-2 px-4 py-2 text-sm w-full hover:bg-base-300"
                on:click={() => {
                  onExportAllPDF();
                  hideMenu();
                }}
              >
                <FilesIcon class="w-4 h-4" />
                Export All as PDF (BETA)
              </button>

              <div class="divider my-1"></div>
              
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