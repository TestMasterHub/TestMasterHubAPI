import React from "react";
import styles from ".././../Styles/RequestBody/RequestBodyComp.module.css";
function RequestBodyComp({ requestBody, setRequestBody }) {
  return (
    <div className={styles.RBodyMainWrapper}>
      <label className={styles.RBodylabel}>JSON</label>
      <br></br>
      <textarea
        value={requestBody}
        onChange={(e) => setRequestBody(e.target.value)}
        className={styles.RBodyField}
      ></textarea>
    </div>
  );
}

export default RequestBodyComp;
