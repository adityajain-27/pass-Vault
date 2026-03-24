import mongoose from "mongoose";

const vaultEntrySchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required :true,
        index:true},
        label:{
            type : String,
            required :true,
            trim:true,
            maxLength: 100},
            encryptedData:{
                type:String,
                required:true, //string shud be encrtptd by frontnd 

                //only store never log

            }
    },
    { timestamps: true }
);

export default mongoose.model('VaultEntry', vaultEntrySchema);