<script>
  import { onMount, onDestroy } from 'svelte';
  import { fade } from 'svelte/transition';
  import { sineIn } from 'svelte/easing';
  import { createChatStores } from '../stores/chatStore';
  import { ChatLogic } from '../utils/chatLogic';
  import { PocketBaseChatService } from '../services/chatService';
  import { pb } from '$lib/pocketbase';
  import Warning from './Warning.svelte';
  import EmergencyAlert from './EmergencyAlert.svelte';
  import ChatHeader from './ChatHeader.svelte';
  import MessagesList from './MessagesList.svelte';
  import ChatInput from './ChatInput.svelte';
  import ChatSidebar from './ChatSidebar.svelte';
  import { t } from '$lib/translations/translations';

  const stores = createChatStores();
  const chatService = new PocketBaseChatService(pb);
  const chatLogic = new ChatLogic(chatService, stores);

  const {
    messages,
    newMessage,
    selectedChatId,
    chats,
    isChatOpen,
    isMobileMenuOpen
  } = stores;

  onMount(async () => {
    const response = await chatService.getChatSessions();
    chats.set(response.items);
  });

  onDestroy(() => {
    chatService.unsubscribe();
  });

  $: selectedChat = $chats.find(chat => chat.id === $selectedChatId);
</script>

<div class="flex-1 flex overflow-hidden">
  <ChatSidebar
    {chatLogic}
    chats={$chats}
    selectedChatId={$selectedChatId}
    isChatOpen={$isChatOpen}
    isMobileMenuOpen={$isMobileMenuOpen}
  />

  {#if $isChatOpen}
    <div class="w-full md:w-3/4 flex flex-col h-full bg-base-100">
      <Warning />
      
      {#if selectedChat?.emergency_message}
        <EmergencyAlert message={selectedChat.emergency_message} />
      {/if}

      <ChatHeader 
        title={selectedChat?.title || 'Current Chat'}
        showBackButton={true}
        messageCount={$messages.length}
        onBack={() => chatLogic.closeChat()}
        onReset={() => chatLogic.closeChat()}
        onDelete={() => chatLogic.deleteChat(selectedChat.id)}
        onExportCurrentCSV={() => chatLogic.exportCurrentChatToCSV()}
        onExportCurrentPDF={() => chatLogic.exportAllChatsToPDF()}
        onExportAllCSV={() => chatLogic.exportAllChatsToCSV()}
        onExportAllPDF={() => chatLogic.exportAllChatsToPDF()}
      />

      <MessagesList messages={$messages} />

      <ChatInput
        value={$newMessage}
        onInput={(e) => newMessage.set(e.target.value)}
        onSend={() => chatLogic.handleUserMessage($newMessage)}
      />
    </div>
  {/if}
</div>