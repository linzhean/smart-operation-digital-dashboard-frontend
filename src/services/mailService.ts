import axios from 'axios';

const apiBaseUrl = 'https://example.com/api'; // 替換為你的 API 基礎 URL

export interface Email {
    id: string;
    subject: string;
    sender: string;
    date: string;
    content: string;
  }
  
  const fakeEmails: Email[] = [
    { id: '1', subject: 'Hello World', sender: 'John Doe', date: '2024-07-01', content: 'This is a test email.' },
    { id: '2', subject: 'Meeting Reminder', sender: 'Jane Smith', date: '2024-07-02', content: 'Don\'t forget about the meeting tomorrow.' },
    { id: '1', subject: 'Hello World', sender: 'John Doe', date: '2024-07-01', content: 'This is a test email.' },
    { id: '1', subject: 'Hello World', sender: 'John Doe', date: '2024-07-01', content: 'This is a test email.' },
    { id: '1', subject: 'Hello World', sender: 'John Doe', date: '2024-07-01', content: 'This is a test email.' },
    { id: '1', subject: 'Hello World', sender: 'John Doe', date: '2024-07-01', content: 'This is a test email.' },
  ];
  
  let emailIdCounter = fakeEmails.length;
  
  export const getEmails = async (): Promise<Email[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(fakeEmails), 500));
  };
  
  export const getEmailDetails = async (id: string): Promise<Email> => {
    const email = fakeEmails.find(e => e.id === id);
    return new Promise((resolve, reject) => setTimeout(() => {
      email ? resolve(email) : reject(new Error('Email not found'));
    }, 500));
  };
  
  export const createEmail = async (email: Email): Promise<void> => {
    emailIdCounter++;
    fakeEmails.push({ ...email, id: emailIdCounter.toString() });
    return new Promise((resolve) => setTimeout(resolve, 500));
  };
  
  export const updateEmail = async (id: string, email: Partial<Email>): Promise<void> => {
    const index = fakeEmails.findIndex(e => e.id === id);
    if (index !== -1) {
      fakeEmails[index] = { ...fakeEmails[index], ...email };
    }
    return new Promise((resolve) => setTimeout(resolve, 500));
  };
  
  export const deleteEmail = async (id: string): Promise<void> => {
    const index = fakeEmails.findIndex(e => e.id === id);
    if (index !== -1) {
      fakeEmails.splice(index, 1);
    }
    return new Promise((resolve) => setTimeout(resolve, 500));
  };
  
  export const sendEmail = async (email: Email): Promise<void> => {
    console.log('Sending email:', email);
    return new Promise((resolve) => setTimeout(resolve, 500));
  };
  