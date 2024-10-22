// src/lib/pocketbase.js
import PocketBase from 'pocketbase';
import { writable } from 'svelte/store';

export const pb = new PocketBase('https://api.laege.chat/');

export const currentUser = writable(pb.authStore.record);

// Subscribe to authStore changes
pb.authStore.onChange((auth) => {
    currentUser.set(auth);
});

// Auth helper functions
export const authHelpers = {
    async signInWithMitId() {
        const authData = await pb.collection('users').authWithOAuth2({ provider: 'oidc' });
        return authData;
    },

    async logout() {
        pb.authStore.clear();
    },

    isAuthenticated() {
        return pb.authStore.isValid;
    }
};

// Chat related functions
export const chatHelpers = {
    async getChatSessions() {
        try {
            const userId = pb.authStore.record.id;
            return await pb.collection('chat_sessions').getList(1, 50, {
                filter: `user.id = "${userId}"`,
                sort: '-created',
                expand: 'user'
            });
        } catch (error) {
            console.error('Error fetching chat sessions:', error);
            return { items: [] };
        }
    },

    async createChatSession(title) {
        try {
            const data = {
                title,
                user: pb.authStore.record.id,
            };
            return await pb.collection('chat_sessions').create(data);
        } catch (error) {
            console.error('Error creating chat session:', error);
            throw error;
        }
    },

    async getChatMessages(sessionId) {
        try {
            return await pb.collection('chat_message').getList(1, 100, {
                filter: `chat_session = "${sessionId}"`,
                sort: 'created',
            });
        } catch (error) {
            console.error('Error fetching chat messages:', error);
            return { items: [] };
        }
    },

    async sendMessage(sessionId, content, isUser = true) {
        try {
            const data = {
                chat_session: sessionId,
                text : content,
                user: isUser,
            };
            return await pb.collection('chat_message').create(data);
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    },

    subscribeToMessages(sessionId, callback) {
        return pb.collection('chat_message').subscribe('*', ({ action, record }) => {
            if (record.chat_session === sessionId) {
                callback(action, record);
            }
        });
    },

    async subscribeToChatSessions(callback) {
        return pb.collection('chat_sessions').subscribe('*', ({ action, record }) => {
            callback(action, record);
        });
    }
};

// User profile helpers
export const userHelpers = {
    async updateProfile(data) {
        try {
            const userId = pb.authStore.record.id;
            return await pb.collection('users').update(userId, data);
        } catch (error) {
            console.error('Error updating profile:', error);
            throw error;
        }
    },

    async getProfile() {
        try {
            const userId = pb.authStore.record.id;
            return await pb.collection('users').getOne(userId);
        } catch (error) {
            console.error('Error fetching profile:', error);
            throw error;
        }
    }
};