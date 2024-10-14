import React, { useState, useRef, useEffect } from 'react';
import styles from './SmartDialogue.module.css';
import send from '../../assets/icon/send.png';
import clear from '../../assets/icon/clear.png';
import ChartService from '../../services/ChartService';
import ReactMarkdown from 'react-markdown';

interface SmartDialogueProps {
  aiSuggestion: string;
  chartId: number;
  isLoading: boolean;
}

const SmartDialogue: React.FC<SmartDialogueProps> = ({ aiSuggestion, chartId, isLoading }) => {
  const [messages, setMessages] = useState<{ id: number; role: 'user' | 'ai'; content: string }[]>([]);
  const [input, setInput] = useState('');
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [nextId, setNextId] = useState(0);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      const { scrollHeight, clientHeight } = messagesContainerRef.current;
      messagesContainerRef.current.scrollTo({
        top: scrollHeight - clientHeight,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    console.log('Received chartId in SmartDialogue:', chartId);
  }, [chartId]);  

  useEffect(() => {
    console.log('Messages updated:', messages);
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  useEffect(() => {
    if (aiSuggestion) {
      setMessages((prev) => [...prev, { id: nextId, role: 'ai', content: aiSuggestion }]);
      setNextId(nextId + 1);
    }
  }, [aiSuggestion]);

  useEffect(() => {
    if (isLoading) {
      setMessages((prev) => [...prev, { id: nextId, role: 'ai', content: 'AI 建議正在生成中' }]);
      setNextId(nextId + 1);
    }
  }, [isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      const userMessage = input;
      const userMessageId = nextId;
      setMessages((prev) => [
        ...prev,
        { id: userMessageId, role: 'user', content: userMessage },
        { id: nextId + 1, role: 'ai', content: '加載中' }
      ]);
      setInput('');
      setNextId(nextId + 2);

      try {

        const lastMessageId = userMessageId;

        const response = await ChartService.sendMessage({
          chartId: chartId,
          content: userMessage,
          messageId: lastMessageId,
        });


        const newChat = response.data.data.newChat;
        setMessages((prev) => [
          ...prev.slice(0, -1),
          { id: nextId, role: 'ai', content: newChat }
        ]);
      } catch (error) {
        console.error('Failed to send message:', error);
        setMessages((prev) => [
          ...prev.slice(0, -1),
          { id: nextId, role: 'ai', content: 'Error occurred. Please try again.' }
        ]);
      }
    }
  };

  const handleDeleteAIAnalysis = async () => {
    if (window.confirm('您確定要刪除 AI 分析紀錄嗎？')) {
      try {
        const response = await ChartService.deleteAIAnalysis(chartId);
        setMessages([]);
        console.log('AI analysis deleted:', response);
      } catch (error) {
        console.error('Failed to delete AI analysis:', error);
      }
    }
  };

  return (
    <div className={styles.smartDialogueContainer}>
      <div className={styles.SmartDialogueTitle}>
        <div className={styles.title}>智慧分析對話框</div>
        <button className={styles.clearButton} onClick={handleDeleteAIAnalysis}>
          <img src={clear} alt="清空" />
        </button>
      </div>

      <div className={styles.messagesContainer} ref={messagesContainerRef}>
        <div className={styles.messages}>
          {messages.map((msg, index) => (
            <div key={index} className={`${styles.message} ${styles[msg.role]}`}>
              <div className={styles.messageContent}>
                {msg.role === 'ai' ? (
                  <ReactMarkdown>{typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content)}</ReactMarkdown>
                ) : (
                  msg.content
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.inputForm}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="請輸入您的問題"
          className={styles.input}
        />
        <button type="submit" className={styles.button}>
          <img src={send} alt="傳送" className={styles.sendIcon} />
        </button>
      </form>
    </div>
  );
};

export default SmartDialogue;
