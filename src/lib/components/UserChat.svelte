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
      if (!newMessage.trim() || !selectedChatId) return;
  
      try {
        await chatHelpers.sendMessage(selectedChatId, newMessage, true);
        newMessage = '';
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
        <!-- Chat header -->
        <div class="p-4 border-b border-base-300 flex justify-between items-center">
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
        <div class="flex-1 overflow-y-auto p-4">
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
        <div class="p-4 border-t border-base-300">
          <div class="input-group flex flex-row">
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
    {/if}
  </div>