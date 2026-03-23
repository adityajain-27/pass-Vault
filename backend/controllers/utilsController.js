import { checkStrength } from '../utils/passwordStrength.js';
import { checkBreach } from '../utils/breachCheck.js';


export const strengthCheck = (req, res) => {
    const { password } = req.body;
    if (!password) {
        return res.status(400).json({
            message: "Password is required"
        });
    }
    const result = checkStrength(password);
    res.status(200).json(result);
};

export const breachCheck = async (req, res) => {
    const { password } = req.body;
    if (!password) {
        return res.status(400).json({
            message: "Password query parameter is required"
        })
    }

    const result = await checkBreach(password);
    res.status(200).json(result);

}