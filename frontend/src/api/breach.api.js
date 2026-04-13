import axios from 'axios';
import CryptoJS from 'crypto-js';

/**
 * Checks if a password has been breached using the HaveIBeenPwned Range API (k-Anonymity).
 * This is public, anonymous, and very secure.
 */
export const checkPasswordBreach = async (password) => {
    try {
        // 1. Hash the password with SHA-1
        const hash = CryptoJS.SHA1(password).toString().toUpperCase();
        
        // 2. Get the first 5 chars (prefix) and the suffix
        const prefix = hash.slice(0, 5);
        const suffix = hash.slice(5);

        // 3. Query HIBP for all hashes starting with the prefix
        const response = await axios.get(`https://api.pwnedpasswords.com/range/${prefix}`);
        const results = response.data.split('\n');

        // 4. Look for our suffix in the results
        const match = results.find(line => line.startsWith(suffix));
        
        if (match) {
            const count = parseInt(match.split(':')[1], 10);
            return { breached: true, count };
        }
        
        return { breached: false, count: 0 };
    } catch (err) {
        console.error("Breach check failed", err);
        return { error: true, message: "Could not connect to BreachWatch service." };
    }
};
