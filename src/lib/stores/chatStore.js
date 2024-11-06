import { writable } from 'svelte/store';

export const createChatStores = () => ({
  messages: writable([]),
  newMessage: writable(''),
  emergencyMessage: writable(''),
  selectedChatId: writable(null),
  chats: writable([]),
  isChatOpen: writable(false),
  isMobileMenuOpen: writable(false),
});
