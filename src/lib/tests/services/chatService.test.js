import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PocketBaseChatService } from '../../services/chatService';

describe('PocketBaseChatService', () => {
  let chatService;
  let mockPb;
  let mockCollection;

  beforeEach(() => {
    mockCollection = {
      create: vi.fn(),
      getList: vi.fn(),
      subscribe: vi.fn(),
      unsubscribe: vi.fn(),
    };

    mockPb = {
      send: vi.fn(),
      collection: vi.fn(() => mockCollection),
      authStore: {
        record: { id: 'user123' }
      }
    };

    chatService = new PocketBaseChatService(mockPb);
  });

  describe('sendMessage', () => {
    it('should send guest message to medical endpoint', async () => {
      await chatService.sendMessage(null, 'test message', true);

      expect(mockPb.send).toHaveBeenCalledWith('/api/medicalquestion', {
        method: 'POST',
        body: JSON.stringify({
          messages: [{ text: 'test message', user: true }]
        })
      });
    });

    it('should send user message to chat collection', async () => {
      const chatId = 'chat123';
      await chatService.sendMessage(chatId, 'test message', true);

      expect(mockPb.collection).toHaveBeenCalledWith('chat_messages');
      expect(mockCollection.create).toHaveBeenCalledWith({
        chat_session: chatId,
        text: 'test message',
        user: true
      });
    });
  });

  describe('getChatMessages', () => {
    it('should fetch messages for a specific chat', async () => {
      const chatId = 'chat123';
      await chatService.getChatMessages(chatId);

      expect(mockPb.collection).toHaveBeenCalledWith('chat_messages');
      expect(mockCollection.getList).toHaveBeenCalledWith(1, 50, {
        filter: `chat_session = "${chatId}"`,
        sort: 'created'
      });
    });
  });

  describe('subscriptions', () => {
    it('should properly subscribe to messages', () => {
      const chatId = 'chat123';
      const callback = vi.fn();
      
      chatService.subscribeToMessages(chatId, callback);

      expect(mockPb.collection).toHaveBeenCalledWith('chat_messages');
      expect(mockCollection.subscribe).toHaveBeenCalledWith('*', callback);
    });

    it('should properly unsubscribe', () => {
      chatService.unsubscribe();

      expect(mockPb.collection).toHaveBeenCalledWith('chat_messages');
      expect(mockCollection.unsubscribe).toHaveBeenCalled();
    });
  });
});