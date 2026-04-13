import zxcvbn from 'zxcvbn';
import { decryptData } from './cryptoUtils';

export const runSecurityAudit = (entries, masterKey) => {
    const results = {
        score: 100,
        weak: [],
        reused: [],
        old: [],
        total: entries.length,
        breakdown: {
            secure: 0,
            weakCount: 0,
            reusedCount: 0,
            oldCount: 0
        }
    };

    if (!entries.length) return results;

    const passwordMap = new Map(); // hash -> [labels]
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    entries.forEach(entry => {
        const decrypted = decryptData(entry.encryptedData, masterKey);
        if (!decrypted || decrypted.type !== 'password') return;

        const { password } = decrypted;
        
        // 1. Weak check
        const strength = zxcvbn(password);
        if (strength.score < 3) {
            results.weak.push({ id: entry._id, label: entry.label, score: strength.score });
            results.breakdown.weakCount++;
        }

        // 2. Reuse check
        if (passwordMap.has(password)) {
            passwordMap.get(password).push(entry.label);
            results.reused.push({ id: entry._id, label: entry.label });
            results.breakdown.reusedCount++;
        } else {
            passwordMap.set(password, [entry.label]);
        }

        // 3. Old check
        const updatedDate = new Date(entry.updatedAt);
        if (updatedDate < sixMonthsAgo) {
            results.old.push({ id: entry._id, label: entry.label, date: updatedDate });
            results.breakdown.oldCount++;
        }
    });

    // Score calculation (Simplified Keeper-style)
    const penaltyPerWeak = 15;
    const penaltyPerReused = 10;
    const penaltyPerOld = 5;

    let finalScore = 100 
        - (results.breakdown.weakCount * penaltyPerWeak) 
        - (results.breakdown.reusedCount * penaltyPerReused)
        - (results.breakdown.oldCount * penaltyPerOld);
    
    results.score = Math.max(0, finalScore);
    results.breakdown.secure = entries.length - results.weak.length - results.reused.length - results.old.length;

    return results;
};
