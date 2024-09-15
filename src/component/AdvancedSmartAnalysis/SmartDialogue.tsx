import React, { useState, useRef, useEffect } from 'react';
import styles from './SmartDialogue.module.css';
import send from '../../assets/icon/send.png'
import clear from '../../assets/icon/clear.png'


const SmartDialogue: React.FC = () => {
  // 分成 user 跟 ai 套用不同的樣式
  // 後面是樣式 .user 跟 .ai
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([]);
  const [input, setInput] = useState('');
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    // 傳送訊息後跳到底部的動作
    if (messagesContainerRef.current) {
      const { scrollHeight, clientHeight } = messagesContainerRef.current;
      messagesContainerRef.current.scrollTo({
        top: scrollHeight - clientHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);


  // 表單提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {

      setMessages(prev => [...prev, { role: 'user', content: input }, { role: 'ai', content: `LOADING` }]);
      setInput('');

      setTimeout(() => {
        setMessages(prev => [
          ...prev.slice(0, -1),
          { role: 'ai', content: `假回覆"${input}"` }
        ]);
      }, 1000);
    }
  };

  return (
    <div className={styles.smartDialogueContainer}>


      <div className={styles.SmartDialogueTitle}>
        <div className={styles.title}>智慧分析對話框</div>
        <button className={styles.clearButton}
          onClick={() => window.alert('確定要清除對話紀錄嗎？')}
        >
          <img src={clear} alt="清空" />
        </button>
      </div>


      <div className={styles.messagesContainer} ref={messagesContainerRef}>
        <div className={styles.messages}>
          {messages.map((msg, index) => (

            <div key={index} className={`${styles.message} ${styles[msg.role]}`}>
              {/* ${styles[msg.role]}
              如果 msg.role 是 'user' > styles.user
              如果 msg.role 是 'ai' > styles.ai 
              一定要在 .messages 裡面 然後 .message 跟 msg.role 要同時存在 */}
              <div className={styles.messageContent}>{msg.content}</div>
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
    </div >
  );
};

export default SmartDialogue;