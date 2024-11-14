import { get } from 'svelte/store';
import { t } from '$lib/translations/translations';
// utils/chatLogic.js
export class ChatLogic {
  constructor(chatService, stores) {
    this.chatService = chatService;
    this.stores = stores;
  }

  resetChat() {
    this.stores.messages.set([]);
    this.stores.newMessage.set('');
    this.stores.emergencyMessage.set('');
  }

  async handleGuestMessage(messageText) {
    if (!messageText.trim()) return;
    
    try {
      const userMessage = this._createMessage(messageText, true);
      this.stores.messages.update(msgs => [...msgs, userMessage]);
      this.stores.newMessage.set('');
      
      const response = await this.chatService.sendMessage(null, messageText, true);
      
      if (response?.response) {
        const { responseMessage, emergencyMessage } = this._parseResponse(response.response);
        if (emergencyMessage) {
          this.stores.emergencyMessage.set(emergencyMessage);
        }
        
        const botMessage = this._createMessage(responseMessage, false);
        this.stores.messages.update(msgs => [...msgs, botMessage]);
      }
    } catch (error) {
      this._handleError(error);
    }
  }

  async handleUserMessage(messageText) {
    if (!this._validateUserMessage(messageText)) return;

    try {
      this.stores.newMessage.set('');
      await this.chatService.sendMessage(get(this.stores.selectedChatId), messageText, true);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

  async createNewChat() {
    try {
      const currentChats = get(this.stores.chats);
      let title = `Chat ${currentChats.length + 1}`;
      const newChat = await this.chatService.createChatSession(title);
      this.stores.chats.update(c => [newChat, ...c]);
      await this.selectChat(newChat.id);
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  }

  async deleteChat(chatId) {
    try {
      await this.chatService.deleteChatSession(chatId);
      this.stores.chats.update(c => c.filter(chat => chat.id !== chatId));
      this.closeChat();
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  }

  async selectChat(chatId) {
    const currentSelectedId = get(this.stores.selectedChatId);
    
    if (currentSelectedId === chatId) {
      this.closeChat();
    } else {
      this.stores.selectedChatId.set(chatId);
      this.stores.isChatOpen.set(true);
      this.stores.isMobileMenuOpen.set(false);
      
      try {
        const response = await this.chatService.getChatMessages(chatId);
        this.stores.messages.set(response.items);
        
        this.chatService.unsubscribe();
        this.setupSubscriptions(chatId);
      } catch (error) {
        console.error('Error loading chat messages:', error);
        this._handleError(error);
      }
    }
  }

  setupSubscriptions(chatId) {
    this.chatService.subscribeToMessages(chatId, (e) => {
      if (e.action === 'create') {
        this.stores.messages.update(msgs => {
          const newMsgs = [...msgs, e.record];
          return newMsgs;
        });
      }
    });

    this.chatService.subscribeToChatSessions((e) => {
      let record = e.record;
      if (e.action === 'update') {
        this.stores.chats.update(c => c.map(chat => 
          chat.id === record.id ? record : chat
        ));
      }
    });
  }

  closeChat() {
    this.stores.isChatOpen.set(false);
    this.stores.selectedChatId.set(null);
    this.chatService.unsubscribe();
  }

  goBackToList() {
    this.closeChat();
    this.stores.isMobileMenuOpen.set(false);
  }

  toggleMobileMenu() {
    this.stores.isMobileMenuOpen.update(v => !v);
  }

  _createMessage(text, isUser) {
    return {
      id: Date.now() + (isUser ? 0 : 1),
      text,
      user: isUser,
      created: new Date().toISOString()
    };
  }

  _parseResponse(response) {
    const emergencyMatch = response.match(/{EMERGENCY:\s*([^}]+)}/);
    const emergencyMessage = emergencyMatch ? emergencyMatch[1] : null;
    const responseMessage = emergencyMatch 
      ? response.replace(/{EMERGENCY:\s*[^}]+}/, '').trim()
      : response;
    
    return { responseMessage, emergencyMessage };
  }

  _validateUserMessage(messageText) {
    const selectedChatId = get(this.stores.selectedChatId);
    if (!messageText.trim() || !selectedChatId) return false;
    
    const messages = get(this.stores.messages);
    if (messages[messages.length - 1]?.user) return false;
    
    return true;
  }

  _handleError(error) {
    console.error('Error in chat operation:', error);
    this.stores.messages.update(msgs => [...msgs, {
      id: Date.now() + 1,
      text: "Sorry, there was an error. Please try again.",
      user: false,
      created: new Date().toISOString()
    }]);
  }
}