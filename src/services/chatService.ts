interface ChatMessage {
    id: string;
    emailId: string;
    sender: string;
    content: string;
    timestamp: string;
  }
  
  let fakeMessages: ChatMessage[] = [];
  
  export const getChatMessages = async (emailId: string): Promise<ChatMessage[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(fakeMessages.filter(msg => msg.emailId === emailId));
      }, 500);
    });
  };
  
  export const sendChatMessage = async (emailId: string, sender: string, content: string): Promise<ChatMessage> => {
    const newMessage: ChatMessage = {
      id: (fakeMessages.length + 1).toString(),
      emailId,
      sender,
      content,
      timestamp: new Date().toISOString(),
    };
    fakeMessages.push(newMessage);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(newMessage);
      }, 500);
    });
  };
  