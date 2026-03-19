import { useState } from "react";
import useVault from "../hooks/useVault";

function Dashboard() {
  const { vault, addEntry } = useVault();

  const [showForm, setShowForm] = useState(false);
  const [site, setSite] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleAdd = () => {
    setSite("");
    setUsername("");
    setPassword("");
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!site || !username || !password) {
      alert("Please fill all fields");
      return;
    }

    addEntry({ site, username, password });

    setSite("");
    setUsername("");
    setPassword("");
    setShowForm(false);
  };


  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied!");
    } catch (err) {
      alert("Failed to copy");
    }
  };

  return (
    <div>
      <h2>My Password Vault</h2>

      <button onClick={handleAdd}>Add Password</button>

      {showForm && (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Website"
            value={site}
            onChange={(e) => setSite(e.target.value)}
          />
          <br /><br />

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <br /><br />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br /><br />

          <button type="submit">Save</button>
        </form>
      )}

      <hr />

      {vault.length === 0 && <p>No passwords saved yet</p>}

      {vault.map((item, index) => (
        <div key={index} style={{ marginTop: "10px" }}>
          <p><b>Site:</b> {item.site}</p>
          <p><b>Username:</b> {item.username}</p>
          <p>
            <b>Password:</b> {item.password} 
            <button onClick={() => copyToClipboard(item.password)}>
              Copy
            </button>
          </p>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;
