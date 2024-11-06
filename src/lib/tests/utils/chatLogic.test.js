import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ChatLogic } from '../../utils/chatLogic';
import { createChatStores } from '../../stores/chatStore';
import { get } from 'svelte/store';

describe('ChatLogic', () => {
  let chatLogic;
  let mockChatService;
  let stores;

  beforeEach(() => {
    mockChatService = {
      sendMessage: vi.fn(),
      getChatMessages: vi.fn(),
      getChatSessions: vi.fn(),
      createChatSession: vi.fn(),
      subscribeToMessages: vi.fn(),
      subscribeToChatSessions: vi.fn(),
      unsubscribe: vi.fn(),
    };

    stores = createChatStores();
    chatLogic = new ChatLogic(mockChatService, stores);
  });

  describe('resetChat', () => {
    it('should reset all chat-related stores', () => {
      stores.messages.set([{ id: 1, text: 'test' }]);
      stores.newMessage.set('test');
      stores.emergencyMessage.set('emergency');

      chatLogic.resetChat();

      expect(get(stores.messages)).toEqual([]);
      expect(get(stores.newMessage)).toBe('');
      expect(get(stores.emergencyMessage)).toBe('');
    });
  });

  describe('handleGuestMessage', () => {
    it('should handle empty messages', async () => {
      await chatLogic.handleGuestMessage('   ');
      expect(mockChatService.sendMessage).not.toHaveBeenCalled();
    });

    it('should handle successful message', async () => {
      mockChatService.sendMessage.mockResolvedValue({
        response: 'AI response'
      });

      await chatLogic.handleGuestMessage('Hello');

      expect(get(stores.messages)).toHaveLength(2);
      expect(get(stores.messages)[0].text).toBe('Hello');
      expect(get(stores.messages)[1].text).toBe('AI response');
    });

    it('should handle emergency messages', async () => {
      mockChatService.sendMessage.mockResolvedValue({
        response: '{EMERGENCY: Test emergency}Normal response'
      });

      await chatLogic.handleGuestMessage('Help');

      expect(get(stores.emergencyMessage)).toBe('Test emergency');
      expect(get(stores.messages)[1].text).toBe('Normal response');
    });
  });

  describe('createNewChat', () => {
    it('should create and select new chat', async () => {
      const newChat = { id: '123', title: 'Chat 1' };
      mockChatService.createChatSession.mockResolvedValue(newChat);
      mockChatService.getChatMessages.mockResolvedValue({ items: [] });

      await chatLogic.createNewChat();

      expect(mockChatService.createChatSession).toHaveBeenCalledWith('Chat 1');
      expect(get(stores.selectedChatId)).toBe('123');
      expect(get(stores.isChatOpen)).toBe(true);
    });
  });
});