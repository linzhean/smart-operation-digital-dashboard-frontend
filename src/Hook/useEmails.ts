import { useState, useEffect } from 'react';
import { getEmails, getEmailDetails, createEmail, updateEmail, deleteEmail, sendEmail } from '../services/mailService';
import { Email } from '../services/mailService';

export const useEmails = () => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEmails();
  }, []);

  const loadEmails = async () => {
    setLoading(true);
    try {
      const emailData = await getEmails();
      setEmails(emailData);
    } catch (err) {
      setError('加载邮件失败');
    } finally {
      setLoading(false);
    }
  };

  const selectEmail = async (id: string) => {
    setLoading(true);
    try {
      const emailDetails = await getEmailDetails(id);
      setSelectedEmail(emailDetails);
    } catch (err) {
      setError('加载邮件详情失败');
    } finally {
      setLoading(false);
    }
  };

  const createNewEmail = async () => {
    try {
      const newEmail = { id: '', subject: '新邮件', sender: 'Alice', date: '2024-07-03', content: '这是一封新邮件。' };
      await createEmail(newEmail);
      loadEmails();
    } catch (err) {
      setError('创建邮件失败');
    }
  };

  const updateExistingEmail = async (id: string) => {
    try {
      const updatedEmail = { subject: '更新的邮件', content: '这封邮件已更新。' };
      await updateEmail(id, updatedEmail);
      loadEmails();
    } catch (err) {
      setError('更新邮件失败');
    }
  };

  const deleteExistingEmail = async (id: string) => {
    try {
      await deleteEmail(id);
      loadEmails();
    } catch (err) {
      setError('删除邮件失败');
    }
  };

  const sendSelectedEmail = async () => {
    if (selectedEmail) {
      try {
        await sendEmail(selectedEmail);
        alert('邮件发送成功！');
      } catch (err) {
        setError('发送邮件失败');
      }
    }
  };

  return {
    emails,
    selectedEmail,
    loading,
    error,
    loadEmails,
    selectEmail,
    createNewEmail,
    updateExistingEmail,
    deleteExistingEmail,
    sendSelectedEmail,
  };
};
