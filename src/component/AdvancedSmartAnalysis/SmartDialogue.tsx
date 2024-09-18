import React, { useState, useRef, useEffect } from 'react';
import styles from './SmartDialogue.module.css';
import send from '../../assets/icon/send.png';
import clear from '../../assets/icon/clear.png';
import ChartService from '../../services/ChartService';
import ReactMarkdown from 'react-markdown';

interface SmartDialogueProps {
  aiSuggestion: string;
  chartId: number; // 新增 chartId 作為 prop 傳入
}

const SmartDialogue: React.FC<SmartDialogueProps> = ({ aiSuggestion, chartId }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([]);
  const [input, setInput] = useState('');
  const messagesContainerRef = useRef<HTMLDivElement>(null);

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
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  useEffect(() => {
    if (aiSuggestion) {
      setMessages((prev) => [...prev, { role: 'ai', content: aiSuggestion }]);
    }
  }, [aiSuggestion]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      setMessages((prev) => [...prev, { role: 'user', content: input }, { role: 'ai', content: 'LOADING' }]);
      setInput('');

      setTimeout(() => {
        setMessages((prev) => [...prev.slice(0, -1), { role: 'ai', content: `假回覆"${input}"` }]);
      }, 1000);
    }
  };

  // 新增刪除 AI 分析對話的功能
  const handleDeleteAIAnalysis = async () => {
    if (window.confirm('您確定要刪除 AI 分析紀錄嗎？')) {
      try {
        const response = await ChartService.deleteAIAnalysis(chartId);
        setMessages([]); // 清空消息
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
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
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
