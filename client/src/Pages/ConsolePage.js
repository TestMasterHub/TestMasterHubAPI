import React, { useState, useEffect } from 'react';
import styles from '../Styles/PageStyles/ConsolePage.module.css'; // Ensure CSS is imported

const ConsoleWindow = () => {
  const [requestLogs, setRequestLogs] = useState([]);

  useEffect(() => {
    const logs = JSON.parse(localStorage.getItem('requestLogs')) || [];
    setRequestLogs(logs);

    const handleMessage = (event) => {
      if (event.data && event.data.type === 'REFRESH_CONSOLE') {
        // Refresh the logs when the message is received
        const updatedLogs = JSON.parse(localStorage.getItem('requestLogs')) || [];
        setRequestLogs(updatedLogs);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);
  const toggleAccordion = (index) => {
    const updatedLogs = requestLogs.map((log, i) =>
      i === index ? { ...log, open: !log.open } : log
    );
    setRequestLogs(updatedLogs);
  };

  const handleClearAll = () => {
    localStorage.removeItem('requestLogs');
    setRequestLogs([]); // Clear logs from state as well
  };

  const handleLoadLogs = () => {
    window.location.reload();
  };

  return (
    <div className={styles.console_container}>
      <div className={styles.console_HeadWrapper}>
        <h2>Console</h2>
        <button className={styles.console_ClearBtn} onClick={handleClearAll}>Clear</button>
        <button className={styles.console_LoadBtn} onClick={handleLoadLogs}>Load Logs</button>
      </div>
      {requestLogs.map((log, index) => (
        <div key={index} className={styles.accordion}>
          <div className={styles.accordion_header} onClick={() => toggleAccordion(index)}>
            <span>{log.method ? log.method.toUpperCase() : 'UNKNOWN METHOD'}</span>
            <span>{log.url || 'UNKNOWN URL'}</span>
            <span>{log.status || 'N/A'}</span>
            <span className={styles.toggle_arrow}>{log.open ? '▼' : '►'}</span>
          </div>
          {log.open && (
            <div className={styles.accordion_content}>
              <h4>Request Data:</h4>
              <pre>{JSON.stringify(log.requestData, null, 2)}</pre>
              <h4>Response Data:</h4>
              <pre>{JSON.stringify(log.responseData, null, 2)}</pre>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ConsoleWindow;
