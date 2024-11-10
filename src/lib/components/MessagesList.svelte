<script>
    import { t } from '$lib/translations/translations';
    export let messages = [];
  </script>
  
  <div class="flex-1 overflow-y-auto p-4 min-h-0">
    {#each messages as message (message.id)}
      <div class="chat {message.user ? 'chat-end' : 'chat-start'} mb-4">
        <div class="chat-bubble {message.user ? 'chat-bubble-primary' : 'chat-bubble'}">
          {message.text}
        </div>
        <div class="chat-footer opacity-50 text-xs">
          {new Date(message.created).toLocaleString()}
        </div>
      </div>
    {/each}
  </div>