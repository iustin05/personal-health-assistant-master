<script>
    // Chat states
    export let isChatOpen = false;
    export let selectedChatId = null;
    export let isMobileMenuOpen = false;
  
    export let chats = Array(20).fill(null).map((_, i) => ({
      id: i,
      name: `Chat ${i + 1}`,
      lastMessage: `Last message from chat ${i + 1}`,
      timestamp: new Date().toLocaleTimeString()
    }));
  
    export let messages = Array(30).fill(null).map((_, i) => ({
      id: i,
      text: `This is message ${i + 1} with some longer content to demonstrate scrolling behavior...`,
      sender: i % 2 === 0 ? 'user' : 'other',
      timestamp: new Date().toLocaleTimeString()
    }));
  
    function selectChat(chatId) {
      if (selectedChatId === chatId) {
        isChatOpen = false;
        selectedChatId = null;
      } else {
        selectedChatId = chatId;
        isChatOpen = true;
      }
      isMobileMenuOpen = false;
    }
  
    function goBackToList() {
      isChatOpen = false;
      selectedChatId = null;
    }
  
    function closeChat() {
      isChatOpen = false;
      selectedChatId = null;
    }
  
    $: selectedChat = chats.find(chat => chat.id === selectedChatId);
  </script>
  
  <div class="flex-1 flex overflow-hidden">
    <!-- Left sidebar with chat list -->
    <div class="w-full md:w-1/4 bg-base-200 border-r border-base-300 ease-in transition-all duration-300 
                {isMobileMenuOpen ? 'opacity-0 hidden' : 'opacity-100'} 
                {isChatOpen ? 'hidden md:block' : 'block'}">
      <div class="h-full flex flex-col">
        <!-- Header -->
        <div class="p-4 border-b border-base-300">
          <h2 class="text-xl font-bold">Chats</h2>
        </div>
        
        <!-- Scrollable chat list -->
        <div class="flex-1 overflow-y-auto">
          {#each chats as chat (chat.id)}
            <div 
              class="p-4 hover:bg-base-300 cursor-pointer border-b border-base-300 {selectedChatId === chat.id ? 'bg-base-300' : ''}"
              on:click={() => selectChat(chat.id)}
            >
              <div class="font-semibold">{chat.name}</div>
              <div class="text-sm text-base-content/70">{chat.lastMessage}</div>
              <div class="text-xs text-base-content/50">{chat.timestamp}</div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  
    <!-- Right side chat content -->
    {#if isChatOpen}
      <div class="w-full md:w-3/4 flex flex-col h-full bg-base-100">
        <!-- Chat header -->
        <div class="p-4 border-b border-base-300 flex justify-between items-center">
          <button class="btn btn-ghost btn-sm md:hidden mr-2" on:click={goBackToList}>
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
  
          <h3 class="text-lg font-bold">
            {selectedChat ? selectedChat.name : 'Current Chat'}
          </h3>
          
          <button class="btn btn-ghost btn-sm hidden md:block" on:click={closeChat}>×</button>
        </div>
  
        <!-- Scrollable messages area -->
        <div class="flex-1 overflow-y-auto p-4">
          {#each messages as message (message.id)}
            <div class="chat {message.sender === 'user' ? 'chat-end' : 'chat-start'} mb-4">
              <div class="chat-bubble {message.sender === 'user' ? 'chat-bubble-primary' : 'chat-bubble'}">
                {message.text}
              </div>
              <div class="chat-footer opacity-50 text-xs">{message.timestamp}</div>
            </div>
          {/each}
        </div>
  
        <!-- Message input area -->
        <div class="p-4 border-t border-base-300">
          <div class="input-group flex flex-row">
            <input 
              type="text" 
              placeholder="Type a message..." 
              class="input input-bordered flex-1 mr-2"
            >
            <button class="btn btn-primary">Send</button>
          </div>
        </div>
      </div>
    {/if}
  </div>