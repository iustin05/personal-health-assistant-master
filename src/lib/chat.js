export async function handleSendGuestMessage() {
    if (messages[messages.length - 1]?.user) return;
    if (!newMessage.trim()) return;
    try {
      // Add user message to the chat
      const userMessage = {
        id: Date.now(),
        text: newMessage,
        user: true,
        created: new Date().toISOString()
      };
      messages = [...messages, userMessage];
      
      newMessage = ''; // Clear input immediately for better UX
      
      // Send to PocketBase custom route
      const response = await pb.send('/api/medicalquestion', {
        method: 'POST',
        body: JSON.stringify({
          messages
        })
      });
      
      // Add response to chat
      if (response?.response) {
          let response_message = response.response;
          const emergencyMatch = response_message.match(/{EMERGENCY:\s*([^}]+)}/);
          if (emergencyMatch) {
              // Extract emergency message
              emergency_message = emergencyMatch[1];
              // Remove the emergency tag from the message
              response_message = response_message.replace(/{EMERGENCY:\s*[^}]+}/, '').trim();
          }
          const botMessage = {
              id: Date.now() + 1,
              text: response_message,
              user: false,
              created: new Date().toISOString()
          };
        
          messages = [...messages, botMessage];
      }
    } catch (error) {
      console.error('Error sending message:', error);
      messages = [...messages, {
        id: Date.now() + 1,
        text: "Sorry, there was an error sending your message. Please try again.",
        user: false,
        created: new Date().toISOString()
      }];
    }
  }