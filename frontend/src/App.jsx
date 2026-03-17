import { useEffect } from "react";
import {
  deriveMasterKey,
  encryptData,
  decryptData,
} from "./crypto/cryptoUtils";

function App() {
  useEffect(() => {
    const key = deriveMasterKey("test123");
    
    const encrypted = encryptData(
      { site: "google", password: "123" },
      key
    );

    console.log("Encrypted:", encrypted);

    const decrypted = decryptData(encrypted, key);

    console.log("Decrypted:", decrypted);
  }, []);

  return <h1>Testing Crypto</h1>;
}

export default App;