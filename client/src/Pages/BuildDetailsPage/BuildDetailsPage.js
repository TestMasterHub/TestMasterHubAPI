import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import styles from "../../Styles/PageStyles/BuildDetails.module.css";
import MainLayout from "../../Layouts/MainLayout";
import JsonFileImporter from "../../Utlis/JsonFileImporter";

const BuildDetailsPage = () => {
  const [buildData, setBuildData] = useState(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const consoleRef = useRef(null);
  const { buildNumber } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const savedBuilds = localStorage.getItem("builds");
    if (savedBuilds) {
      const allBuilds = JSON.parse(savedBuilds);
      const currentBuild = allBuilds.find(
        (build) => build.buildNumber === parseInt(buildNumber)
      );
      setBuildData(currentBuild);
    }
  }, [buildNumber]);

  useEffect(() => {
    if (autoScroll && consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [buildData?.logs, autoScroll]);

  const handleScroll = () => {
    if (consoleRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = consoleRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
      setAutoScroll(isAtBottom);
    }
  };

  const toggleAutoScroll = () => {
    setAutoScroll((prev) => !prev);
    if (!autoScroll && consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  };

  const scrollToBottom = () => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  };

  const copyLogsToClipboard = () => {
    if (buildData?.logs) {
      const logsText = buildData.logs.join("\n");
      navigator.clipboard
        .writeText(logsText)
        .then(() => alert("Logs copied to clipboard!"))
        .catch((err) => console.error("Failed to copy logs:", err));
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const handleBack = () => {
    navigate(-1);
  };

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
    if (!isSearchVisible) {
      setSearchTerm("");
    }
  };

  const filteredLogs =
    buildData?.logs.filter((log) =>
      log.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  if (!buildData) {
    return (
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.noLogs}>Build not found</div>
        </div>
      </div>
    );
  }

  return (
    <MainLayout handleFileUpload={JsonFileImporter}>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.header}>
            <div>
              <Link
                to={"/builds/build-configuration"}
                className={styles.backButton}
              >
                ← Back to Builds
              </Link>
              <h1 className={styles.buildTitle}>
                Build #{buildData.buildNumber}
              </h1>
              <p className={styles.timestamp}>
                Started at: {formatDate(buildData.timestamp)}
              </p>
            </div>
          </div>
          <div className={styles.summaryCard}>
            <h2 className={styles.summaryTitle}>Build Summary</h2>
            <div className={styles.summaryGrid}>
              <div className={styles.summaryItem}>
                <p className={styles.summaryLabel}>
                  <b>Total Logs: </b>
                  {buildData.logs.length}
                </p>
              </div>
              <div className={styles.summaryItem}>
                <p className={styles.summaryLabel}>
                  <b>Status: </b>
                  {buildData.logs.some((log) => log.includes("❌"))
                    ? "Fail"
                    : "Pass"}
                </p>
              </div>
            </div>
          </div>
          <div className={styles.consoleContainer}>
            <div className={styles.consoleHeader}>
              <h2 className={styles.consoleTitle}>
                Console Output
                {buildData.logs.length > 0 && (
                  <span>({buildData.logs.length} lines)</span>
                )}
              </h2>
              {isSearchVisible && (
                <div className={styles.searchBar}>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search logs..."
                    className={styles.searchInput}
                  />
                </div>
              )}
              <div className={styles.consoleDots}>
                <span className={`${styles.dot} ${styles.dotRed}`}></span>
                <span className={`${styles.dot} ${styles.dotYellow}`}></span>
                <span className={`${styles.dot} ${styles.dotGreen}`}></span>
              </div>
            </div>

            <div
              ref={consoleRef}
              className={styles.consoleContent}
              onScroll={handleScroll}
            >
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log, index) => (
                  <div key={index} className={styles.logLine}>
                    <span className={styles.lineNumber}>{index + 1}</span>
                    <div
                      className={`${styles.logEntry} ${
                        log.includes("❌")
                          ? styles.logError
                          : log.includes("✓")
                          ? styles.logSuccess
                          : ""
                      }`}
                    >
                      {log}
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.noLogs}>
                  {searchTerm
                    ? "No matching logs found"
                    : "No logs available for this build"}
                </div>
              )}
            </div>

            <div className={styles.consoleActions}>
              <button className={styles.actionButton} onClick={toggleSearch}>
                {isSearchVisible ? "Hide Search" : "Search"}
              </button>
              <button
                className={styles.actionButton}
                onClick={copyLogsToClipboard}
              >
                Copy Logs
              </button>
              <button className={styles.actionButton} onClick={scrollToBottom}>
                Scroll to Bottom
              </button>
              <button
                className={`${styles.actionButton} ${
                  autoScroll ? styles.autoScrollActive : ""
                }`}
                onClick={toggleAutoScroll}
              >
                Auto Scroll {autoScroll ? "ON" : "OFF"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default BuildDetailsPage;
