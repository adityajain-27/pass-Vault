import VaultEntry from "../models/VaultEntry.js";

export const getEntries = async (req, res) => {
    try {
        const entries = await VaultEntry.find({ userId: req.user.userId }).select("-__v");
        res.status(200).json(entries);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const createEntry = async (req, res) => {
    try {
        const { label, encryptedData } = req.body;
        const userId = req.user.userId;

        if (!label || !encryptedData) {
            return res.status(400).json({ message: "Label and encryptedData are required" });
        }

        const entry = new VaultEntry({ userId, label, encryptedData });
        await entry.save();

        // return only metadata, never return encryptedData in response
        res.status(201).json({
            _id: entry._id,
            label: entry.label,
            userId: entry.userId,
            createdAt: entry.createdAt
        });
    } catch (error) {
        console.error("createEntry error:",error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateEntry = async (req, res) => {
    try {
        const { label, encryptedData } = req.body;

        // find by both _id and userId to prevent one user accessing another's data
        const entry = await VaultEntry.findOne({ _id: req.params.id, userId: req.user.userId });

        if (!entry) {
            return res.status(404).json({ message: "Entry not found" });
        }

        entry.label = label || entry.label;
        entry.encryptedData = encryptedData || entry.encryptedData;
        await entry.save();

        res.status(200).json({ _id: entry._id, label: entry.label, updatedAt: entry.updatedAt });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const deleteEntry = async (req, res) => {
    try {
        const entry = await VaultEntry.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });

        if (!entry) {
            return res.status(404).json({ message: "Entry not found" });
        }

        res.status(200).json({ message: "Entry deleted" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};
