<script>
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    import { createChatStores } from '../stores/chatStore';
    import { ChatLogic } from '../utils/chatLogic';
    import { PocketBaseChatService } from '../services/chatService';
    import { pb } from '$lib/pocketbase';
    import Warning from './Warning.svelte';
    import EmergencyAlert from './EmergencyAlert.svelte';
    import ChatHeader from './ChatHeader.svelte';
    import MessagesList from './MessagesList.svelte';
    import ChatInput from './ChatInput.svelte';
    import { t } from '$lib/translations/translations';
    const stores = createChatStores();
    const chatService = new PocketBaseChatService(pb);
    const chatLogic = new ChatLogic(chatService, stores);
  
    const { messages, newMessage, emergencyMessage } = stores;
  </script>
  
  <div class="flex-1 flex flex-col overflow-hidden">
    <div class="w-full flex flex-col h-full bg-base-100">
      <Warning />
      
      {#if $emergencyMessage}
        <EmergencyAlert message={$emergencyMessage} />
      {/if}
  
      <ChatHeader 
        title="Chat"
        showBackButton={false}
        messageCount={$messages.length}
        onBack={() => chatLogic.createNewChat()} 
        onReset={() => chatLogic.resetChat()} 
        showSettings={false}
      />
  
      <MessagesList messages={$messages} />
  
      <ChatInput
        value={$newMessage}
        onInput={(e) => newMessage.set(e.target.value)}
        onSend={() => chatLogic.handleGuestMessage($newMessage)}
      />
    </div>
  </div>