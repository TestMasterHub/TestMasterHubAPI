// app.js
import React, { useState } from "react";
import TMH from "./TMH"; // Assuming TMH is your object file
window.TMH = TMH;
function App() {
  const [userScript, setUserScript] = useState("");

  const handleSubmit = () => {
    try {
      eval(userScript);
    } catch (error) {
      console.error("Error executing script:", error);
      alert("Error executing script: " + error.message);
    }
  };

  return (
    <div>
      <textarea
        value={userScript}
        onChange={(e) => setUserScript(e.target.value)}
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default App;
