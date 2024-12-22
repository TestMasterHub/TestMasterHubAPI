import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import APIserver from "../APIFunction/APIServer";
import styles from "../Styles/PageStyles/BuildPage.module.css";
import MainLayout from "../Layouts/MainLayout";
import { resolveAllEnvironmentVariables } from "../Utlis/EnvironmentVariableResolver";
import JsonFileImporter from "../Utlis/JsonFileImporter";

const BuildPage = () => {
  const [collections, setCollections] = useState({});
  const [environments, setEnvironments] = useState({});
  const [selectedCollections, setSelectedCollections] = useState([]);
  const [selectedEnvironment, setSelectedEnvironment] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [builds, setBuilds] = useState([]);
  const [buildData, setBuildData] = useState(null); // For logging purposes
  const runLogsRef = useRef([]); // Ref to track logs

  // Load collections, environments, and builds
  useEffect(() => {
    const savedCollections = JSON.parse(
      localStorage.getItem("collections") || "{}"
    );
    const savedEnvironments = JSON.parse(
      localStorage.getItem("environments") || "{}"
    );
    const savedBuilds = JSON.parse(localStorage.getItem("builds") || "[]");
    setCollections(savedCollections);
    setEnvironments(savedEnvironments);
    setBuilds(savedBuilds);
  }, []);

  // Save builds to local storage
  const saveBuild = (
    buildNumber,
    logs,
    collectionName,
    totalRequests,
    requests,
    collectionTime
  ) => {
    const newBuild = {
      buildNumber,
      collectionName,
      totalRequests,
      requests,
      collectionTime,
      logs,
      timestamp: new Date().toISOString(),
    };

    const updatedBuilds = [...builds, newBuild];
    setBuilds(updatedBuilds);
    localStorage.setItem("builds", JSON.stringify(updatedBuilds));

    // Save to localStorage for reports
    const savedBuilds = JSON.parse(
      localStorage.getItem("buildReports") || "[]"
    );
    savedBuilds.push(newBuild); // Save the complete build data here
    localStorage.setItem("buildReports", JSON.stringify(savedBuilds));
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

  // Copy logs to clipboard
  const copyLogsToClipboard = () => {
    const logsText = runLogsRef.current.join("\n");
    navigator.clipboard.writeText(logsText).then(() => {
      alert("Logs copied to clipboard!");
    });
  };

  // Run selected collections
  const runSelectedCollections = async () => {
    if (selectedCollections.length === 0 || !selectedEnvironment) {
      alert("Please select collections and an environment");
      return;
    }

    setIsRunning(true);
    runLogsRef.current = []; // Clear logs immediately

    const buildNumber = builds.length + 1;

    try {
      // Iterate over selected collections
      for (const collectionId of selectedCollections) {
        const collection = collections[collectionId]; // Get the current collection

        if (!collection) {
          runLogsRef.current.push(
            `Error: Collection ${collectionId} not found`
          );
          continue;
        }

        const collectionStartTime = performance.now();
        runLogsRef.current.push(`Starting collection: ${collection.info.name}`);

        const requests = [];
        let totalRequests = 0;
        let collectionTime = 0;

        // Iterate over each request in the collection
        for (const requestItem of collection.item || []) {
          const requestStartTime = performance.now();
          runLogsRef.current.push(`Running request: ${requestItem.name}`);

          try {
            const requestData = {
              url: requestItem.request.url.raw,
              method: requestItem.request.method.toLowerCase(),
              headers: requestItem.request.header || [],
              body: requestItem.request.body || {},
              query: requestItem.request.url.query || [],
              pathParams: requestItem.request.url.variable || [],
              auth: requestItem.request.auth || {},
              preRequestScript:
                requestItem.event
                  ?.find((e) => e.listen === "prerequest")
                  ?.script.exec.join("\n") || "",
              testScript:
                requestItem.event
                  ?.find((e) => e.listen === "test")
                  ?.script.exec.join("\n") || "",
            };

            const resolvedData = resolveAllEnvironmentVariables(
              {
                url: requestData.url,
                requestType: requestData.method,
                headers: requestData.headers,
                requestBody: requestData.body.raw,
                queryParams: requestData.query,
                pathParams: requestData.pathParams,
                authToken: requestData.auth.bearer?.[0]?.value || "",
                basicAuth: requestData.auth.basic || {},
                preRequestScript: requestData.preRequestScript,
                testScript: requestData.testScript,
              },
              selectedEnvironment ? [environments[selectedEnvironment]] : []
            );

            let finalUrl = resolvedData.url.split("?")[0];

            const pathParams = Array.isArray(resolvedData.pathParams)
              ? resolvedData.pathParams
              : [];
            pathParams.forEach((param) => {
              if (param.key && param.value) {
                finalUrl = finalUrl.replace(`:${param.key}`, param.value);
              }
            });

            const queryParams = Array.isArray(resolvedData.queryParams)
              ? resolvedData.queryParams
              : [];
            const queryString = queryParams
              .filter((param) => param.key && param.value)
              .map(
                (param) =>
                  `${encodeURIComponent(param.key)}=${encodeURIComponent(
                    param.value
                  )}`
              )
              .join("&");

            finalUrl = queryString ? `${finalUrl}?${queryString}` : finalUrl;

            const finalRequestData = {
              method: resolvedData.requestType,
              url: finalUrl,
              headers: {
                ...resolvedData.headers,
                Authorization: resolvedData.authToken
                  ? `Bearer ${resolvedData.authToken}`
                  : "",
              },
              data:
                typeof resolvedData.requestBody === "string"
                  ? JSON.parse(resolvedData.requestBody || "{}")
                  : resolvedData.requestBody || {},
            };

            const result = await APIserver({
              requestData: finalRequestData,
              authToken: resolvedData.authToken,
              requestType: resolvedData.requestType,
              basicAuth: resolvedData.basicAuth,
              preRequestScript: resolvedData.preRequestScript,
              testScript: resolvedData.testScript,
            });

            const requestEndTime = performance.now();
            const requestDuration = requestEndTime - requestStartTime;

            runLogsRef.current.push(
              `✓ Completed ${requestItem.name} in ${
                requestDuration < 1000
                  ? `${Math.round(requestDuration)} ms`
                  : `${(requestDuration / 1000).toFixed(2)} seconds`
              }`,
              `Status: ${result.status}`,
              `Response: ${JSON.stringify(result.apiResponse).substring(
                0,
                100
              )}...`
            );

            // Track the request data
            requests.push({
              name: requestItem.name,
              url: finalUrl,
              response: result.apiResponse,
              runTime: requestDuration,
            });
            totalRequests++;
          } catch (error) {
            runLogsRef.current.push(
              `❌ Error in request ${requestItem.name}: ${error.message}`
            );
          }
        }

        const collectionEndTime = performance.now();
        const collectionDuration = collectionEndTime - collectionStartTime;
        runLogsRef.current.push(
          `Completed collection: ${collection.info.name} in ${
            collectionDuration < 1000
              ? `${Math.round(collectionDuration)} ms`
              : `${(collectionDuration / 1000).toFixed(2)} seconds`
          }\n`
        );

        collectionTime = collectionDuration;

        // Save build with the collected data
        saveBuild(
          buildNumber,
          runLogsRef.current,
          collection.info.name,
          totalRequests,
          requests,
          collectionTime
        );
      }
    } catch (error) {
      runLogsRef.current.push(`❌ Error: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <MainLayout handleFileUpload={JsonFileImporter}>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Build Configuration</h2>
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

            <button
              onClick={runSelectedCollections}
              disabled={isRunning || selectedCollections.length === 0}
              className={styles.runButton}
            >
              {isRunning ? "Running..." : "Run Collections"}
            </button>

            <button onClick={copyLogsToClipboard} className={styles.copyButton}>
              Copy Logs
            </button>

            <div className={styles.runLogs}>
              <h3 className={styles.sectionTitle}>Run Logs</h3>
              {runLogsRef.current.map((log, index) => (
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

export default BuildPage;
