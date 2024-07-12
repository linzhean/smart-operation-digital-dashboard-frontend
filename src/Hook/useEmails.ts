import { useState, useEffect } from 'react';
import { getEmails, getEmailDetails, createEmail, updateEmail, deleteEmail, sendEmail } from '../services/mailService';
import { Email } from '../services/mailService';

export const useEmails = () => {
    const [emails, setEmails] = useState<Email[]>([]);
    const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadEmails('ASSIGN'); // Pass a default status here
    }, []);

    const loadEmails = async (status: string) => {
        setLoading(true);
        setError(null);
        try {
            const fetchedEmails = await getEmails(status);
            setEmails(fetchedEmails);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const selectEmail = async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            const emailDetails = await getEmailDetails(id);
            setSelectedEmail(emailDetails);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const createNewEmail = async (email: Partial<Email>) => {
        setLoading(true);
        setError(null);
        try {
            const newEmail = { ...email, id: 0 }; // Assuming id should be 0 for new email
            await createEmail(newEmail as Email);
            await loadEmails('ASSIGN'); // Pass a status if needed
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const updateExistingEmail = async (id: number, email: Partial<Email>) => {
        setLoading(true);
        setError(null);
        try {
            const updatedEmail = { ...email, id }; // Ensure id is included
            await updateEmail(id, updatedEmail as Email);
            await loadEmails('ASSIGN'); // Pass a status if needed
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const deleteExistingEmail = async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            await deleteEmail(id);
            await loadEmails('ASSIGN'); // Pass a status if needed
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const sendSelectedEmail = async () => {
        if (selectedEmail) {
            setLoading(true);
            setError(null);
            try {
                await sendEmail(selectedEmail);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }
    };

    return {
        emails,
        selectedEmail,
        loading,
        error,
        selectEmail,
        createNewEmail,
        updateExistingEmail,
        deleteExistingEmail,
        sendSelectedEmail,
    };
};
