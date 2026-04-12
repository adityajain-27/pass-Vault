import crypto from 'crypto';
import axios from 'axios';
const hashPassword = (password) => {
    return crypto.createHash('sha1').update(password).digest('hex').toUpperCase();
};
export const checkBreach = async (password) => {
    const hash = hashPassword(password);
    const prefix = hash.slice(0, 5);
    const suffix = hash.slice(5);
    try{
        const response = await axios.get(`https://api.pwnedpasswords.com/range/${prefix}`);
        const hashes = response.data.split('\r\n');
        const match = hashes.find((line) => {
            const [hashSuffix, count] = line.split(':');
            return hashSuffix.trim().toUpperCase() === suffix;
        });
        if (match){
            const count = parseInt(match.split(':')[1], 10);
            return {breached: true, count};
        }
        return {breached: false, count: 0};
    } 
    catch (error){
        console.log("Breach check API error:", error.message);
        return {breached: false, count: 0, error: "Network error"};
    }
};
