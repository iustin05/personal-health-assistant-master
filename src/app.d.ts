// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
export interface ChatMessage {
	id: number;
	text: string;
	user: boolean;
	created: string;
}

export interface ChatSession {
	id: string;
	title: string;
	created: string;
	emergency_message?: string;
}

export interface ChatService {
	sendMessage(chatId: string | null, message: string, isUser: boolean): Promise<void>;
	getChatMessages(chatId: string): Promise<{ items: ChatMessage[] }>;
	getChatSessions(): Promise<{ items: ChatSession[] }>;
	createChatSession(title: string): Promise<ChatSession>;
	subscribeToMessages(chatId: string, callback: (action: string, record: ChatMessage) => void): void;
	subscribeToChatSessions(callback: (action: string, record: ChatSession) => void): void;
	unsubscribe(): void;
}

declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
