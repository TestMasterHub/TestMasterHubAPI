import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import APIserver from "../APIFunction/APIServer";
import styles from "../Styles/PageStyles/MonitorsPage.module.css";
import MainLayout from "../Layouts/MainLayout";
import JsonFileImporter from "../Utlis/JsonFileImporter";

const MonitorsPage = () => {
  const [collections, setCollections] = useState({});
  const [environments, setEnvironments] = useState({});
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [selectedEnvironment, setSelectedEnvironment] = useState(null);
  const [scheduledTimes, setScheduledTimes] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  const [scheduledDate, setScheduledDate] = useState(""); // Store selected date
  const [scheduledTime, setScheduledTime] = useState(""); // Store selected time in HH:mm format
  const [consoleLogs, setConsoleLogs] = useState([]); // Console logs state

  // Load collections, environments, and scheduled times from localStorage
  useEffect(() => {
    const savedCollections = JSON.parse(
      localStorage.getItem("collections") || "{}"
    );
    const savedEnvironments = JSON.parse(
      localStorage.getItem("environments") || "{}"
    );
    const savedScheduledTimes = JSON.parse(
      localStorage.getItem("scheduledTimes") || "[]"
    );

    // Ensure that scheduledDate is properly parsed as a Date object
    const updatedScheduledTimes = savedScheduledTimes.map((item) => {
      return {
        ...item,
        scheduledDate: new Date(item.scheduledDate), // Convert to Date object if it's not already
      };
    });

    setCollections(savedCollections);
    setEnvironments(savedEnvironments);
    setScheduledTimes(updatedScheduledTimes);
  }, []);

  // Save scheduled time data to localStorage
  const saveScheduledTime = (scheduledData) => {
    const updatedScheduledTimes = [...scheduledTimes, scheduledData];

    // Convert scheduledDate to string before saving
    const updatedScheduledTimesWithDateString = updatedScheduledTimes.map(
      (item) => {
        return {
          ...item,
          scheduledDate:
            item.scheduledDate instanceof Date
              ? item.scheduledDate.toISOString() // Only call toISOString if it's a Date object
              : item.scheduledDate, // Keep it as is if it's already a string
        };
      }
    );

    setScheduledTimes(updatedScheduledTimesWithDateString);
    localStorage.setItem(
      "scheduledTimes",
      JSON.stringify(updatedScheduledTimesWithDateString)
    );
  };

  // Handle collection selection
  const handleCollectionSelect = (event) => {
    setSelectedCollection(event.target.value);
  };

  // Handle environment selection
  const handleEnvironmentSelect = (event) => {
    setSelectedEnvironment(event.target.value);
  };

  // Run the scheduled collection
  const runScheduledCollection = async (scheduledTime) => {
    const { collectionId, environmentId, scheduledDate } = scheduledTime;

    if (!(scheduledDate instanceof Date)) {
      console.error("Invalid scheduledDate:", scheduledDate);
      return;
    }

    if (!collections[collectionId] || !environments[environmentId]) {
      console.error("Invalid collection or environment");
      return;
    }

    const collection = collections[collectionId];
    const environment = environments[environmentId];

    setIsRunning(true);

    try {
      const collectionStartTime = performance.now();
      console.log(`Starting collection: ${collection.info.name}`);
      setConsoleLogs((prevLogs) => [
        ...prevLogs,
        `Starting collection: ${collection.info.name}`,
      ]);

      // Update status to "Running"
      updateScheduledStatus(collectionId, environmentId, "Running");

      for (const requestItem of collection.item || []) {
        // Run each request as you did in the previous logic
        // Log each request start and completion
        setConsoleLogs((prevLogs) => [
          ...prevLogs,
          `Running request: ${requestItem.name}`,
        ]);
      }

      const collectionEndTime = performance.now();
      const collectionDuration = collectionEndTime - collectionStartTime;
      const completionMessage = `Completed collection: ${collection.info.name} in ${collectionDuration}ms`;

      console.log(completionMessage);
      setConsoleLogs((prevLogs) => [...prevLogs, completionMessage]);

      // Update status to "Completed"
      updateScheduledStatus(collectionId, environmentId, "Completed");
    } catch (error) {
      console.error("Error running collection", error);
      setConsoleLogs((prevLogs) => [...prevLogs, `Error: ${error.message}`]);

      // Update status to "Failed"
      updateScheduledStatus(collectionId, environmentId, "Failed");
    } finally {
      setIsRunning(false);
    }
  };

  // Update the status of the scheduled task
  const updateScheduledStatus = (collectionId, environmentId, status) => {
    const updatedScheduledTimes = scheduledTimes.map((item) => {
      if (
        item.collectionId === collectionId &&
        item.environmentId === environmentId
      ) {
        return { ...item, status };
      }
      return item;
    });

    setScheduledTimes(updatedScheduledTimes);
    localStorage.setItem(
      "scheduledTimes",
      JSON.stringify(updatedScheduledTimes)
    );
  };

  // Set the scheduled time for the collection
  const handleScheduleCollection = () => {
    if (
      !selectedCollection ||
      !selectedEnvironment ||
      !scheduledDate ||
      !scheduledTime
    ) {
      alert("Please select a collection, environment, date, and time");
      return;
    }

    const [hours, minutes] = scheduledTime.split(":");
    const scheduledDateTime = new Date(scheduledDate);
    scheduledDateTime.setHours(hours, minutes, 0, 0);

    if (scheduledDateTime.getTime() <= Date.now()) {
      alert("Scheduled time should be in the future.");
      return;
    }

    const scheduledData = {
      collectionId: selectedCollection,
      environmentId: selectedEnvironment,
      scheduledDate: scheduledDateTime,
      status: "Yet to start", // Initially set the status as "Yet to start"
    };

    // Save to localStorage
    saveScheduledTime(scheduledData);

    // Set a timeout to run the collection
    const delay = scheduledDateTime.getTime() - Date.now();
    setTimeout(() => runScheduledCollection(scheduledData), delay);
  };

  return (
    <MainLayout handleFileUpload={JsonFileImporter}>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Monitors</h2>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Select Collection</h3>
              <select
                value={selectedCollection || ""}
                onChange={handleCollectionSelect}
                className={styles.select}
              >
                <option value="" disabled>
                  Select Collection
                </option>
                {Object.entries(collections).map(([key, collection]) => (
                  <option key={key} value={key}>
                    {collection.info.name}
                  </option>
                ))}
              </select>
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
              <h3 className={styles.sectionTitle}>Select Date</h3>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className={styles.select}
              />
            </div>

            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Select Time</h3>
              <input
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className={styles.select}
              />
            </div>

            <button
              onClick={handleScheduleCollection}
              disabled={
                isRunning || !selectedCollection || !selectedEnvironment
              }
              className={styles.runButton}
            >
              {isRunning ? "Running..." : "Schedule Collection"}
            </button>

            <div className={styles.scheduledList}>
              <h3 className={styles.sectionTitle}>Scheduled Monitors</h3>
              {scheduledTimes.map((scheduledTime, index) => (
                <div key={index} className={styles.scheduledItem}>
                  <div>
                    <strong>Collection:</strong>{" "}
                    {collections[scheduledTime.collectionId]?.info.name}
                  </div>
                  <div>
                    <strong>Environment:</strong>{" "}
                    {environments[scheduledTime.environmentId]?.name}
                  </div>
                  <div>
                    <strong>Scheduled Time:</strong>{" "}
                    {new Date(scheduledTime.scheduledDate).toLocaleString()}
                  </div>
                  <div>
                    <strong>Status:</strong> {scheduledTime.status}
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.console}>
              <h3>Console Output</h3>
              <div className={styles.consoleLogs}>
                {consoleLogs.map((log, index) => (
                  <div key={index}>{log}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default MonitorsPage;
