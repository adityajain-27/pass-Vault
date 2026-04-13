import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getEntries, deleteEntry, createEntry, updateEntry } from '../api/vault.api';
import { decryptData } from '../crypto/cryptoUtils';

const useVault = () => {
    const { masterKey } = useContext(AuthContext);
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch all entries from backend and decrypt them locally
    const fetchAndDecrypt = async () => {
        if (!masterKey) return;
        try {
            setLoading(true);
            const encryptedEntries = await getEntries();
            const decrypted = encryptedEntries.map(entry => {
                const data = decryptData(entry.encryptedData, masterKey);
                return { ...entry, decryptedData: data };
            }).filter(entry => entry.decryptedData !== null);
            setEntries(decrypted);
        } catch (err) {
            console.error('Failed fetching entries', err);
        } finally {
            setLoading(false);
        }
    };

    // Auto-fetch when masterKey becomes available
    useEffect(() => {
        if (masterKey) fetchAndDecrypt();
    }, [masterKey]);

    // Delete an entry and refresh the list
    const removeEntry = async (id) => {
        await deleteEntry(id);
        await fetchAndDecrypt();
    };

    // Return everything a page might need
    return {
        entries,
        loading,
        removeEntry,
        refresh: fetchAndDecrypt,
    };
};

export default useVault;
