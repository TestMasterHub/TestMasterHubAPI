import React, { useState } from "react";
import { Link } from "react-router-dom";
import APIserver from "../APIFunction/APIServer";
import styles from "../Styles/PageStyles/MonitorsPage.module.css";
import MainLayout from "../Layouts/MainLayout";
import JsonFileImporter from "../Utlis/JsonFileImporter";

const MonitorsPage = () => {
  const [collections, setCollections] = useState({});
  const [environments, setEnvironments] = useState({});
  const [selectedCollections, setSelectedCollections] = useState([]);
  const [selectedEnvironment, setSelectedEnvironment] = useState(null);
  const [scheduledMonitors, setScheduledMonitors] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState([]);
  const [status, setStatus] = useState("yet to start"); // Status: "yet to start", "running", "complete"
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");

  // Save scheduled monitors to local storage
  const saveScheduledMonitor = (monitorData) => {
    const updatedMonitors = [...scheduledMonitors, monitorData];
    setScheduledMonitors(updatedMonitors);
    localStorage.setItem("scheduledMonitors", JSON.stringify(updatedMonitors));
  };

  // Handle collection selection
  const handleCollectionSelect = (collectionId) => {
    setSelectedCollections((prev) =>
      prev.includes(collectionId)
        ? prev.filter((id) => id !== collectionId)
        : [...prev, collectionId]
    );
  };

  // Handle environment selection
  const handleEnvironmentSelect = (event) => {
    setSelectedEnvironment(event.target.value);
  };

  // Handle adding scheduled time
  const handleAddSchedule = () => {
    if (
      selectedCollections.length === 0 ||
      !selectedEnvironment ||
      !scheduledDate ||
      !scheduledTime
    ) {
      alert("Please select collections, an environment, and set the time");
      return;
    }

    const scheduleDateTime = `${scheduledDate}T${scheduledTime}:00`;

    const newMonitor = {
      collections: selectedCollections,
      environment: selectedEnvironment,
      scheduledTime: scheduleDateTime,
      status: "yet to start", // Default status
      logs: [],
    };

    saveScheduledMonitor(newMonitor);
    alert("Scheduled monitor added!");
  };

  // Run the scheduled collection at the scheduled time
  const runScheduledMonitor = async (monitor) => {
    setStatus("running"); // Set status to running
    setConsoleLogs([]); // Reset console logs for this run

    try {
      for (const collectionId of monitor.collections) {
        const collection = collections[collectionId];

        if (!collection) {
          setConsoleLogs((prev) => [
            ...prev,
            `Error: Collection ${collectionId} not found`,
          ]);
          continue;
        }

        setConsoleLogs((prev) => [
          ...prev,
          `Starting collection: ${collection.info.name}`,
        ]);

        // Simulate running collection logic here
        for (const requestItem of collection.item || []) {
          setConsoleLogs((prev) => [
            ...prev,
            `Running request: ${requestItem.name}`,
          ]);

          try {
            // Simulate API call and result logging here
            const result = await APIserver({
              requestData: {}, // Simulate request data here
            });

            setConsoleLogs((prev) => [
              ...prev,
              `✓ Completed ${requestItem.name} - Status: ${result.status}`,
            ]);
          } catch (error) {
            setConsoleLogs((prev) => [
              ...prev,
              `❌ Error in request ${requestItem.name}: ${error.message}`,
            ]);
          }
        }

        setConsoleLogs((prev) => [
          ...prev,
          `Completed collection: ${collection.info.name}`,
        ]);
      }

      // Mark as complete
      setStatus("complete");
      alert("Monitor run completed!");
    } catch (error) {
      setConsoleLogs((prev) => [...prev, `❌ Error: ${error.message}`]);
      setStatus("complete");
    }
  };

  return (
    <MainLayout handleFileUpload={JsonFileImporter}>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Scheduled Monitors</h2>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Select Collections</h3>
              <div className={styles.grid}>
                {Object.entries(collections).map(([key, collection]) => (
                  <div key={key} className={styles.checkboxWrapper}>
                    <input
                      type="checkbox"
                      id={key}
                      checked={selectedCollections.includes(key)}
                      onChange={() => handleCollectionSelect(key)}
                    />
                    <label htmlFor={key} className={styles.checkboxLabel}>
                      {collection.info.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Select Environment</h3>
              <select
                value={selectedEnvironment || ""}
                onChange={handleEnvironmentSelect}
                className={styles.select}
              >
                <option value="" disabled>
                  Select Environment
                </option>
                {Object.entries(environments).map(([key, env]) => (
                  <option key={key} value={key}>
                    {env.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Schedule Date</h3>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className={styles.select}
              />
            </div>

            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Schedule Time</h3>
              <input
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className={styles.select}
              />
            </div>

            <button
              onClick={handleAddSchedule}
              disabled={isRunning || scheduledMonitors.length === 0}
              className={styles.runButton}
            >
              {status === "running"
                ? "Running..."
                : status === "complete"
                ? "Completed"
                : "Run Monitor"}
            </button>

            <div className={styles.console}>
              <h3 className={styles.sectionTitle}>Console</h3>
              {consoleLogs.map((log, index) => (
                <div
                  key={index}
                  className={`${styles.log} ${
                    log.includes("❌")
                      ? styles.error
                      : log.includes("✓")
                      ? styles.success
                      : ""
                  }`}
                >
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default MonitorsPage;
