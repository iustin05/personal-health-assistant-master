import { describe, it, expect } from 'vitest';
import { get } from 'svelte/store';
import { createChatStores } from '../../stores/chatStore';

describe('chatStore', () => {
  it('should create stores with initial values', () => {
    const stores = createChatStores();
    
    expect(get(stores.messages)).toEqual([]);
    expect(get(stores.newMessage)).toBe('');
    expect(get(stores.emergencyMessage)).toBe('');
    expect(get(stores.selectedChatId)).toBe(null);
    expect(get(stores.chats)).toEqual([]);
    expect(get(stores.isChatOpen)).toBe(false);
    expect(get(stores.isMobileMenuOpen)).toBe(false);
  });

  it('should update store values', () => {
    const stores = createChatStores();
    
    stores.messages.set([{ id: 1, text: 'test' }]);
    stores.isChatOpen.set(true);
    
    expect(get(stores.messages)).toEqual([{ id: 1, text: 'test' }]);
    expect(get(stores.isChatOpen)).toBe(true);
  });
});
