import mongoose from "mongoose";

const vaultEntrySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    label: {
        type: String,
        required: true,
        trim: true,
        maxLength: 100
    },
    encryptedData: {
        type: String,
        required: true, //string shud be encrtptd by frontnd
        //only store never log
    },
    category: {
        type: String,
        default: 'General',
        trim: true
    },
    isFavorite: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export default mongoose.model('VaultEntry', vaultEntrySchema);