import React from "react";
import styles from "../../Styles/RequestBody/AuthComp.module.css";

const AuthComp = ({
  authToken,
  setAuthToken,
  requestType,
  setRequestType,
  basicAuth,
  setBasicAuth,
}) => {
  return (
    <div className={styles.RAuthBody}>
      <div className={styles.RAuthTypeMainWrapper}>
        <h4 className={styles.RAuthTypeTitle}>Auth Type</h4>
        <select
          name="RAuthType"
          className={styles.RAuthList}
          value={requestType}
          onChange={(e) => {
            setRequestType(e.target.value);
          }}
        >
          <option value="Bearer">Bearer Token</option>
          <option value="Basic">Basic Auth</option>
        </select>
        <p className={styles.CRAuthHint}>
          The authorization header will be automatically generated when you send
          the request.
        </p>
      </div>
      <hr></hr>
      <div className={styles.RAuthInputmainWrapper}>
        {requestType.toLowerCase() === "bearer" ? (
          <div className={styles.RAuthInputinnerWrapper}>
            <label className={styles.RAuthInputLabel}>Token</label>
            <input
              className={styles.RAuthInputField}
              value={authToken}
              onChange={(e) => setAuthToken(e.target.value)}
            />
          </div>
        ) : (
          <div className={styles.RAuthInputinnerWrapper}>
            <div className={styles.RAuthBasicUserWrap}>
              <label className={styles.RAuthBasicLabel}>Username:</label>
              <input
                type="username"
                className={styles.RAuthBasicUserField}
                value={basicAuth.username}
                onChange={(e) =>
                  setBasicAuth({ ...basicAuth, username: e.target.value })
                }
              />
            </div>
            <br></br>
            <div className={styles.RAuthBasicPassWrap}>
              <label className={styles.RAuthBasicLabel}>Password:</label>
              <input
                type="password"
                className={styles.RAuthBasicpassField}
                value={basicAuth.password}
                onChange={(e) =>
                  setBasicAuth({ ...basicAuth, password: e.target.value })
                }
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthComp;
