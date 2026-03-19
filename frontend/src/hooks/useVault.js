import { useState } from "react";

export default function useVault() {
  const [vault, setVault] = useState([
    {
      site: "example.com",
      username: "user123",
    },
  ]);

  const addEntry = (entry) => {
    setVault([...vault, entry]);
  };

  return { vault, addEntry };
}
