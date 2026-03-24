import VaultEntry from "../models/VaultEntry.js";


export const getEntries = async (req, res) => {
    try {
        

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const createEntry = async (req, res) => {
    try {
        const { label, encryptedData } = req.body;
        const userId = req.user.userId; 

        

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateEntry = async (req, res) => {
};

export const deleteEntry = async (req, res) => {
};
