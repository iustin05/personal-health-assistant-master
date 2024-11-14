export class PocketBaseChatService {
    constructor(pb) {
      this.pb = pb;
    }
  
    async sendMessage(chatId, message, isUser) {
      if (!chatId) {
        return this.pb.send('/api/medicalquestion', {
          method: 'POST',
          body: JSON.stringify({ messages: [{ text: message, user: isUser }] })
        });
      }
      return this.pb.collection('chat_messages').create({
        chat_session: chatId,
        text: message,
        user: isUser
      });
    }
  
    async getChatMessages(chatId) {
      return this.pb.collection('chat_messages').getList(1, 50, {
        filter: `chat_session = "${chatId}"`,
        sort: 'created'
      });
    }
  
    async getChatSessions() {
      return this.pb.collection('chat_sessions').getList(1, 50, {
        sort: '-created'
      });
    }
  
    async createChatSession(title) {
      return this.pb.collection('chat_sessions').create({
        title,
        user: this.pb.authStore.record.id
      });
    }

    async deleteChatSession(chatId) {
      console.log('Deleting chat:', chatId);
      return this.pb.collection('chat_sessions').delete(chatId);
    }
  
    subscribeToMessages(chatId, callback) {
      console.log('Subscribing to chat:', chatId);
      return this.pb.collection('chat_messages').subscribe('*', callback);
    }
  
    subscribeToChatSessions(callback) {
      console.log('Subscribing to chat sessions');
      return this.pb.collection('chat_sessions').subscribe('*', callback);
    }
  
    unsubscribe() {
      this.pb.collection('chat_messages').unsubscribe();
      this.pb.collection('chat_sessions').unsubscribe();
    }
  }