<script>
    import { onMount } from 'svelte';
    import { pb } from '$lib/pocketbase';
    import { fade } from 'svelte/transition';
    import { sineIn } from 'svelte/easing';
    
    // Chat states
    let messages = [];
    let newMessage = '';
    
    // Reset chat function
    function resetChat() {
      messages = [];
      newMessage = '';
    }
    
    async function handleSendMessage() {
      if (!newMessage.trim()) return;
    
      try {
        // Add user message to the chat
        const userMessage = {
          id: Date.now(), // Simple temporary ID
          text: newMessage,
          user: true,
          created: new Date().toISOString()
        };
        messages = [...messages, userMessage];
    
        // Store the message to send
        const messageToSend = newMessage;
        newMessage = ''; // Clear input immediately for better UX
    
        // Send to PocketBase custom route
        const response = await pb.send('/api/medicalquestion', {
          method: 'POST',
          body: {
            message: messageToSend
          }
        });
        console.log('Response:', response);
    
        // Add response to chat
        if (response?.response) {
          const botMessage = {
            id: Date.now() + 1,
            text: response.response,
            user: false,
            created: new Date().toISOString()
          };
          messages = [...messages, botMessage];
        }
      } catch (error) {
        console.error('Error sending message:', error);
        // Optionally add an error message to the chat
        messages = [...messages, {
          id: Date.now() + 1,
          text: "Sorry, there was an error sending your message. Please try again.",
          user: false,
          created: new Date().toISOString()
        }];
      }
    }
    </script>
    
    <div class="flex-1 flex overflow-hidden">
      <div class="w-full flex flex-col h-full bg-base-100">
        <!-- Chat header -->
        <div class="p-4 border-b border-base-300 flex justify-between items-center">
          <h3 class="text-lg font-bold">Chat</h3>
          <button 
            class="btn btn-ghost btn-circle"
            on:click={resetChat}
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </button>
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
    </div>