<script>
    import { onMount, onDestroy } from 'svelte';
    import { pb, chatHelpers } from '$lib/pocketbase';
    import { fade } from 'svelte/transition';
    import { sineIn } from 'svelte/easing';
    
    // Chat states
    let isChatOpen = false;
    let selectedChatId = null;
    let isMobileMenuOpen = false;
    let chats = [];
    let messages = [];
    let newMessage = '';
  
    onMount(async () => {
      // Load initial chat sessions
      const response = await chatHelpers.getChatSessions();
      chats = response.items;
    });
  
    onDestroy(async () => {
        pb.collection('chat_messages').unsubscribe();
    });
  
    async function selectChat(chatId) {
      if (selectedChatId === chatId) {
        isChatOpen = false;
        selectedChatId = null;
        pb.collection('chat_messages').unsubscribe();
      } else {
        selectedChatId = chatId;
        isChatOpen = true;
        
        // Load messages for this chat
        const response = await chatHelpers.getChatMessages(chatId);
        messages = response.items;
  
        // Subscribe to new messages
        pb.collection('chat_messages').unsubscribe();
        chatHelpers.subscribeToMessages(chatId, (action, record) => {
          if (action === 'create') {
            messages = [...messages, record];
            // remove duplicate keys
            messages = messages.filter((v,i,a)=>a.findIndex(t=>(t.id === v.id))===i);
          }
        });

        chatHelpers.subscribeToChatSessions((action, record) => {
            if (action === 'update') {
                chats = chats.map(chat => {
                    if (chat.id === record.id) {
                    return record;
                    } else {
                    return chat;
                    }
                });
            }
          });
        }
      isMobileMenuOpen = false;
    }
  
    async function handleSendMessage() {
        if (messages[messages.length - 1]?.user) return;
        if (!newMessage.trim() || !selectedChatId) return;
    
        try {
            let messageToSend = newMessage;
            newMessage = '';
            await chatHelpers.sendMessage(selectedChatId, messageToSend, true);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }
  
    async function createNewChat() {
      try {
        const title = `Chat ${chats.length + 1}`;
        const newChat = await chatHelpers.createChatSession(title);
        chats = [newChat, ...chats];
        await selectChat(newChat.id);
      } catch (error) {
        console.error('Error creating chat:', error);
      }
    }
  
    async function goBackToList() {
      isChatOpen = false;
      selectedChatId = null;
      pb.collection('chat_messages').unsubscribe();
    }
  
    async function closeChat() {
      isChatOpen = false;
      selectedChatId = null;
      pb.collection('chat_messages').unsubscribe();
    }
  
    $: selectedChat = chats.find(chat => chat.id === selectedChatId);
</script>
  
<div class="flex-1 flex overflow-hidden">
    <!-- Left sidebar with chat list -->
    <div transition:fade={{duration: 100, easing: sineIn}} class="w-full md:w-1/4 bg-base-200 border-r border-base-300 ease-in transition-all duration-300 
                {isMobileMenuOpen ? 'opacity-0 hidden' : 'opacity-100'} 
                {isChatOpen ? 'hidden md:block' : 'block'}">
      <div class="h-full flex flex-col">
        <!-- Header -->
        <div class="p-4 border-b border-base-300 flex justify-between items-center">
          <h2 class="text-xl font-bold">Chats</h2>
          <button 
            class="btn btn-ghost btn-circle"
            on:click={createNewChat}
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
        
        <!-- Scrollable chat list -->
        <div class="flex-1 overflow-y-auto">
          {#each chats as chat (chat.id)}
            <div 
              class="p-4 hover:bg-base-300 cursor-pointer border-b border-base-300 {selectedChatId === chat.id ? 'bg-base-300' : ''}"
              on:click={() => selectChat(chat.id)}
            >
              <div class="font-semibold">{chat.title}</div>
              <div class="text-xs text-base-content/50">{new Date(chat.created).toLocaleString()}</div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  
    <!-- Right side chat content -->
    {#if isChatOpen}
      <div class="w-full md:w-3/4 flex flex-col h-full bg-base-100">
        <!-- Standard AI Warning -->
        <div class="bg-warning/20 p-3 text-sm flex-none">
            <div class="container mx-auto flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-warning" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              <p>
                This is an AI assistant. As much as we try to keep everything in check, responses may be inaccurate or fictional.
              </p>
            </div>
        </div>

        <!-- Emergency Message Warning (if exists) -->
        {#if selectedChat?.emergency_message}
          <div class="bg-error/30 p-4 flex-none" transition:fade>
            <div class="container mx-auto flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="animate-ping h-6 w-6 text-error flex-shrink-0 mt-1" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              <div class="flex flex-col gap-1">
                <h3 class="font-bold text-error">Emergency Notice</h3>
                <p class="text-error text-sm">{selectedChat.emergency_message}</p>
              </div>
            </div>
          </div>
        {/if}

        <!-- Chat header -->
        <div class="p-4 border-b border-base-300 flex justify-between items-center flex-none">
          <button class="btn btn-ghost btn-sm md:hidden mr-2" on:click={goBackToList}>
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
  
          <h3 class="text-lg font-bold">
            {selectedChat ? selectedChat.title : 'Current Chat'}
          </h3>
          
          <button class="btn btn-ghost btn-sm hidden md:block" on:click={closeChat}>×</button>
        </div>
  
        <!-- Scrollable messages area -->
        <div class="flex-1 overflow-y-auto p-4 min-h-0">
          {#each messages as message (message.id)}
            <div class="chat {message.user ? 'chat-end' : 'chat-start'} mb-4">
              <div class="chat-bubble {message.user ? 'chat-bubble-primary' : 'chat-bubble'}">
                {message.text}
              </div>
              <div class="chat-footer opacity-50 text-xs">{new Date(message.created).toLocaleString()}</div>
            </div>
          {/each}
        </div>
  
        <!-- Message input area -->
        <div class="p-4 border-t border-base-300 flex-none">
          <div class="input-group flex flex-col gap-2">
            <div class="text-xs text-base-content/70">
                Remember: This is an AI chat assistant. Use your judgment when considering its responses.
            </div>
            <div class="flex flex-row">
              <input 
                type="text" 
                placeholder="Type a message..." 
                class="input input-bordered flex-1 mr-2"
                bind:value={newMessage}
                on:keydown={(e) => e.key === 'Enter' && handleSendMessage()}
              >
              <button 
                class="btn btn-primary"
                on:click={handleSendMessage}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    {/if}
</div>