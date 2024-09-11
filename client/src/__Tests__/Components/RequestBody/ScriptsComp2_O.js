import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../../../Styles/RequestBody/RequestBodyComp.module.css';
import TMH from '../Utils/TMH'; // Ensure this path is correct

window.TMH = TMH;
function ScriptsComp({
  preRequestScript,
  setPreRequestScript,
  testScript,
  setTestScript,
}) {
  const [activeTab, setActiveTab] = useState('pre-request');

  const handleTabClick = (tab) => {
    setActiveTab(tab); // Set the clicked tab as active
  };

  return (
    <div className={styles.RBodyMainWrapper}>
      <span
        className={`${styles.CLinkOuterWrapper} ${
          activeTab === 'pre-request' ? styles.activeTab : ''
        }`}
        onClick={() => handleTabClick('pre-request')}
      >
        <Link className={styles.CLinkField}>Pre-req</Link>
      </span>
      <span
        className={`${styles.CLinkOuterWrapper} ${
          activeTab === 'test' ? styles.activeTab : ''
        }`}
        onClick={() => handleTabClick('test')}
      >
        <Link className={styles.CLinkField}>Post-res</Link>
      </span>
      <div>
        {activeTab === 'pre-request' && (
          <textarea
            placeholder="Enter pre-request script"
            value={preRequestScript}
            onChange={(e) => setPreRequestScript(e.target.value)}
            className={styles.RBodyField}
            rows="5"
            cols="50"
          ></textarea>
        )}
        {activeTab === 'test' && (
          <textarea
            placeholder="Enter test validation script"
            value={testScript}
            onChange={(e) => setTestScript(e.target.value)}
            className={styles.RBodyField}
            rows="5"
            cols="50"
          ></textarea>
        )}
      </div>
    </div>
  );
}

export default ScriptsComp;
