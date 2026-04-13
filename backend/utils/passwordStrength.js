import zxcvbn from "zxcvbn";

export const checkStrength = (password) => {
    const result = zxcvbn(password);
    return {
        score: result.score * 25,  //0-100
        // note - result.score is 0-4
        feedback: result.feedback.suggestions,
        crackTime: result.crack_times_display.offline_slow_hashing_1e4_per_second
    };  
};
        