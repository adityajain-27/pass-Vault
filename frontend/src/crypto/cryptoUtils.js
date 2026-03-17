import CryptoJS from "crypto-js"

export const deriveMasterKey = (masterPassword) =>{
    return CryptoJS.SHA256(masterPassword).toString();
}; //takes user password and then will convert it into hash

export const hashForServer = (masterPassword) => {
    return CryptoJS.SHA256(
        masterPassword + "passvault-server-salt"
    ).toString();
}; //adds extra string then hashes to not get intercepted by backend

export const encryptData = (plaintext, masterKey) => {
  return CryptoJS.AES.encrypt(
    JSON.stringify(plaintext),
    masterKey
  ).toString();
};
//encrypting the data (Object → JSON string → AES encrypt → ciphertext)

export const decryptData = (ciphertext , masterKey) => {
    try {
        const bytes = CryptoJS.AES.decrypt(ciphertext, masterKey);

    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    if (!decrypted) return null;
    
    return JSON.parse(decrypted);
    } catch (err) {
        return null;
    }
}; //decrypting the password (Encrypted → decrypt → string → object)