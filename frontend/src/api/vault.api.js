export const getVaultEntries = async () => {
  return [
    {
      site: "example.com",
      username: "user123",
    },
  ];
};

export const addVaultEntry = async (entry) => {
  console.log("New Entry Added:", entry);
};