<script>
import { onMount } from 'svelte';
import { pb } from '$lib/pocketbase';
import { fade } from 'svelte/transition';
import { sineIn } from 'svelte/easing';

// Chat states
let messages = [];
let newMessage = '';
let emergency_message = '';

// Reset chat function
function resetChat() {
  messages = [];
  newMessage = '';
  emergency_message = '';
}

async function handleSendMessage() {
  if (messages[messages.length - 1]?.user) return;
  if (!newMessage.trim()) return;
  try {
    // Add user message to the chat
    const userMessage = {
      id: Date.now(),
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
      body: JSON.stringify({
        messages
      })
    });
    
    // Add response to chat
    if (response?.response) {
        let response_message = response.response;
        const emergencyMatch = response_message.match(/{EMERGENCY:\s*([^}]+)}/);
        if (emergencyMatch) {
            // Extract emergency message
            emergency_message = emergencyMatch[1];
            // Remove the emergency tag from the message
            response_message = response_message.replace(/{EMERGENCY:\s*[^}]+}/, '').trim();
        }
        const botMessage = {
            id: Date.now() + 1,
            text: response_message,
            user: false,
            created: new Date().toISOString()
        };
      
        messages = [...messages, botMessage];
    }
  } catch (error) {
    console.error('Error sending message:', error);
    messages = [...messages, {
      id: Date.now() + 1,
      text: "Sorry, there was an error sending your message. Please try again.",
      user: false,
      created: new Date().toISOString()
    }];
  }
}
</script>

<div class="flex-1 flex flex-col overflow-hidden">
  <!-- Disclaimer Banner -->

  <div class="w-full flex flex-col h-full bg-base-100">
    <div class="bg-warning/20 p-3 text-sm">
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
      {#if emergency_message}
          <div class="bg-error/30 p-4 flex-none" transition:fade>
            <div class="container mx-auto flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="animate-ping h-6 w-6 text-error flex-shrink-0 mt-1" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              <div class="flex flex-col gap-1">
                <h3 class="font-bold text-error">Emergency Notice</h3>
                <p class="text-error text-sm">{emergency_message}</p>
              </div>
            </div>
          </div>
        {/if}

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
</div>