export class ExportService {
    constructor(chatService) {
      this.chatService = chatService;
    }
  
    async exportSingleChatToCSV(chatId, chatTitle) {
        try {
          const messages = await this.chatService.getChatMessages(chatId);
          
          let csvContent = 'Date,Time,Sender,Message\n';
          
          // Add each message to CSV
          messages.items.forEach(msg => {
            const date = new Date(msg.created);
            const row = [
              date.toLocaleDateString(),
              date.toLocaleTimeString(),
              msg.user ? 'User' : 'AI',
              msg.text.replace(/,/g, ';').replace(/\n/g, ' ')
            ];
            csvContent += row.join(',') + '\n';
          });
          
          // Create and download the file
          const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = `chat_${chatTitle.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
          link.click();
          URL.revokeObjectURL(link.href);
        } catch (error) {
          console.error('Error exporting chat:', error);
          throw error;
        }
      }
    
      async exportAllChatsToCSV() {
        try {
          const sessions = await this.chatService.getChatSessions();
          
          let csvContent = 'Chat Title,Date,Time,Sender,Message\n';
          
          for (const session of sessions.items) {
            const messages = await this.chatService.getChatMessages(session.id);
            
            messages.items.forEach(msg => {
              const date = new Date(msg.created);
              const row = [
                session.title.replace(/,/g, ';'),
                date.toLocaleDateString(),
                date.toLocaleTimeString(),
                msg.user ? 'User' : 'AI',
                msg.text.replace(/,/g, ';').replace(/\n/g, ' ')
              ];
              csvContent += row.join(',') + '\n';
            });
          }
          
          const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = `all_chats_${new Date().toISOString().split('T')[0]}.csv`;
          link.click();
          URL.revokeObjectURL(link.href);
        } catch (error) {
          console.error('Error exporting chats:', error);
          throw error;
        }
      }
    
      async exportSingleChatToPDF(chatId, chatTitle) {
        try {
          const messages = await this.chatService.getChatMessages(chatId);
          
          let pdfContent = `# ${chatTitle}\n`;
          pdfContent += `Date: ${new Date().toLocaleDateString()}\n\n`;
          
          messages.items.forEach(msg => {
            const date = new Date(msg.created);
            pdfContent += `[${date.toLocaleTimeString()}] ${msg.user ? 'User' : 'AI'}: ${msg.text}\n`;
          });
          
          this.generatePDF(pdfContent, `Chat Export - ${chatTitle}`);
        } catch (error) {
          console.error('Error exporting chat:', error);
          throw error;
        }
      }
    
      async exportAllChatsToPDF() {
        try {
          const sessions = await this.chatService.getChatSessions();
          
          let pdfContent = '# All Chat Conversations\n\n';
          
          for (const session of sessions.items) {
            pdfContent += `## ${session.title}\n`;
            pdfContent += `Date: ${new Date(session.created).toLocaleDateString()}\n\n`;
            
            const messages = await this.chatService.getChatMessages(session.id);
            
            messages.items.forEach(msg => {
              const date = new Date(msg.created);
              pdfContent += `[${date.toLocaleTimeString()}] ${msg.user ? 'User' : 'AI'}: ${msg.text}\n`;
            });
            
            pdfContent += '\n---\n\n';
          }
          
          this.generatePDF(pdfContent, 'All Chats Export');
        } catch (error) {
          console.error('Error exporting chats:', error);
          throw error;
        }
      }
    
      generatePDF(content, title) {
        const printWindow = window.open('', '', 'width=800,height=600');
        printWindow.document.write(`
          <html>
            <head>
              <title>${title}</title>
              <style>
                body { 
                  font-family: Arial, sans-serif; 
                  line-height: 1.6; 
                  padding: 20px;
                  max-width: 800px;
                  margin: 0 auto;
                }
                h1 { 
                  border-bottom: 1px solid #ccc; 
                  padding-bottom: 10px;
                  color: #2563eb;
                }
                h2 {
                  color: #4b5563;
                  margin-top: 30px;
                }
                .message { margin: 10px 0; }
                .timestamp { color: #666; }
                hr { 
                  margin: 30px 0;
                  border: none;
                  border-top: 1px solid #e5e7eb;
                }
                pre {
                  white-space: pre-wrap;
                  font-family: Arial, sans-serif;
                }
              </style>
            </head>
            <body>
              <pre>${content}</pre>
            </body>
          </html>
        `);
        
        printWindow.document.close();
        printWindow.print();
        printWindow.close();
      }
  }