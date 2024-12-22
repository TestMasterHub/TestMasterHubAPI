import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useCallback, useRef } from "react";
import React from "react";
import MainLayout from "../Layouts/MainLayout";
import styles from "../Styles/PageStyles/RequestEditorpage.module.css";
import AuthComp from "../Components/RequestBody/AuthComp";
import RequestBodyComp from "../Components/RequestBody/RequestBodyComp";
import APIServer from "../APIFunction/APIServer";
import ParamsComp from "../Components/RequestBody/ParamsComp";
import HeaderComp from "../Components/RequestBody/HeaderComp";
import ScriptsComp from "../Components/RequestBody/ScriptsComp";
import TMH from "../Utlis/TMH";
import { MdOutlineAdd } from "react-icons/md";
import { v4 as uuidv4 } from "uuid";
import { resolveAllEnvironmentVariables } from "../Utlis/EnvironmentVariableResolver";
import JsonFileImporter from "../Utlis/JsonFileImporter";
window.TMH = TMH;

const useLocalStorage = (key, initialValue) => {
  // Get initial value from localStorage or use provided initialValue
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return initialValue;
    }
  });

  // Update localStorage whenever the value changes
  const setValue = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  };

  return [storedValue, setValue];
};
export default function RequestEditorpage() {
  const location = useLocation();
  const initialTab = {
    id: Date.now(),
    name: `Request 1`,
    collectionName: `Untitled collection`,
    activeEnvironment: "no_environment", // Add this line
    data: {
      requestType: "get",
      url: "",
      headers: {},
      requestBody: "",
      pathParams: [{ key: "", value: "", description: "" }],
      queryParams: [{ key: "", value: "", description: "" }],
      authToken: "",
      authType: "Bearer",
      basicAuth: { username: "", password: "" },
      preRequestScript: "",
      testScript: "",
      isLoading: false,
      urlError: false,
      apiResponse: null, // Ensure this is explicitly set to null
      statusCode: null, // Add a status code field to track per-tab response status
    },
  };

  // Use localStorage for tabs and activeTabId
  const [tabs, setTabs] = useLocalStorage("savedTabs", [initialTab]);
  const [activeTabId, setActiveTabId] = useLocalStorage(
    "activeTabId",
    initialTab.id
  );
  const [activeTab, setActiveTab] = useState("Params");

  // URL state management
  const [url, setUrl] = useState(() => {
    const activeTabData = tabs.find((tab) => tab.id === activeTabId)?.data;
    return activeTabData?.url || "";
  });

  const [displayUrl, setDisplayUrl] = useState(() => {
    const activeTabData = tabs.find((tab) => tab.id === activeTabId)?.data;
    return activeTabData?.url || "";
  });

  // Initialize params from localStorage
  const [pathParams, setPathParams] = useState(() => {
    const activeTabData = tabs.find((tab) => tab.id === activeTabId)?.data;
    return (
      activeTabData?.pathParams || [{ key: "", value: "", description: "" }]
    );
  });

  const [queryParams, setQueryParams] = useState(() => {
    const activeTabData = tabs.find((tab) => tab.id === activeTabId)?.data;
    return (
      activeTabData?.queryParams || [{ key: "", value: "", description: "" }]
    );
  });

  const extractCollectionName = (importedData) => {
    return importedData.info?.name || "Unnamed Collection";
  };

  useEffect(() => {
    localStorage.setItem("savedTabs", JSON.stringify(tabs));
    localStorage.setItem("activeTabId", activeTabId.toString());
  }, [tabs, activeTabId]);

  useEffect(() => {
    const savedTabs = localStorage.getItem("savedTabs");
    const savedActiveTabId = localStorage.getItem("activeTabId");

    if (savedTabs && savedActiveTabId) {
      try {
        const parsedTabs = JSON.parse(savedTabs);
        const activeTabId = parseInt(savedActiveTabId, 10);

        if (Array.isArray(parsedTabs) && parsedTabs.length > 0) {
          // Use functional updates to prevent unnecessary re-renders
          setTabs((prevTabs) => {
            // Only update if the new tabs are different
            return JSON.stringify(prevTabs) !== JSON.stringify(parsedTabs)
              ? parsedTabs
              : prevTabs;
          });

          // Only update activeTabId if it's different
          setActiveTabId((prevActiveTabId) =>
            prevActiveTabId !== activeTabId ? activeTabId : prevActiveTabId
          );

          const activeTab = parsedTabs.find((tab) => tab.id === activeTabId);
          if (activeTab) {
            // Use functional updates and add checks to prevent unnecessary updates
            setUrl((prevUrl) =>
              prevUrl !== (activeTab.data.url || "")
                ? activeTab.data.url || ""
                : prevUrl
            );

            setDisplayUrl((prevDisplayUrl) =>
              prevDisplayUrl !== (activeTab.data.url || "")
                ? activeTab.data.url || ""
                : prevDisplayUrl
            );

            setPathParams((prevPathParams) => {
              const newPathParams = activeTab.data.pathParams || [
                { key: "", value: "", description: "" },
              ];
              return JSON.stringify(prevPathParams) !==
                JSON.stringify(newPathParams)
                ? newPathParams
                : prevPathParams;
            });

            setQueryParams((prevQueryParams) => {
              const newQueryParams = activeTab.data.queryParams || [
                { key: "", value: "", description: "" },
              ];
              return JSON.stringify(prevQueryParams) !==
                JSON.stringify(newQueryParams)
                ? newQueryParams
                : prevQueryParams;
            });

            updateTabData("authType", activeTab.data.authType || "Bearer");
            updateTabData("authToken", activeTab.data.authToken || "");
            updateTabData(
              "basicAuth",
              activeTab.data.basicAuth || { username: "", password: "" }
            );
          }
        } else {
          throw new Error("Invalid saved data structure");
        }
      } catch (error) {
        console.error("Failed to restore state from localStorage:", error);
        setTabs([initialTab]);
        setActiveTabId(initialTab.id);
      }
    } else {
      setTabs([initialTab]);
      setActiveTabId(initialTab.id);
    }
  }, []); // Empty dependency array to run only once on mount

  const updateTabData = (field, value) => {
    setTabs((prevTabs) => {
      const updatedTabs = [...prevTabs];
      const activeTabIndex = updatedTabs.findIndex(
        (tab) => tab.id === activeTabId
      );
      if (activeTabIndex !== -1) {
        const existingValue = updatedTabs[activeTabIndex].data[field];
        if (existingValue !== value) {
          updatedTabs[activeTabIndex].data[field] = value;
        }
      }
      return updatedTabs;
    });
  };

  const handleUrlChange = useCallback(
    (newUrl) => {
      // console.log("handleUrlChange called:", newUrl);

      // Ensure the URL is always updated in all relevant states
      setUrl(newUrl);
      setDisplayUrl(newUrl);
      updateTabData("url", newUrl);

      // Reset URL error state
      updateTabData("urlError", false);
    },
    [updateTabData]
  );

  useEffect(() => {
    const requestData = location.state?.request;
    console.log("location data: ", requestData);

    if (requestData) {
      // Parse request body if it exists
      let parsedBody = "";
      if (requestData.request?.body?.raw) {
        parsedBody = requestData.request.body.raw;
      }

      // Parse headers into the correct format
      const headersObject = {};
      if (requestData.request?.header) {
        requestData.request.header.forEach((header) => {
          headersObject[header.key] = header.value;
        });
      }

      // Extract auth details
      const authDetails = {
        authToken: "",
        authType: "bearer",
        basicAuth: { username: "", password: "" },
      };

      if (requestData.request?.auth) {
        authDetails.authType = requestData.request.auth.type;
        if (
          authDetails.authType === "bearer" &&
          requestData.request.auth.bearer
        ) {
          authDetails.authToken =
            requestData.request.auth.bearer[0]?.value || "";
        } else if (
          authDetails.authType === "basic" &&
          requestData.request.auth.basic
        ) {
          authDetails.basicAuth = {
            username: requestData.request.auth.basic[0]?.value || "",
            password: requestData.request.auth.basic[1]?.value || "",
          };
        }
      }

      // Extract scripts
      const scripts = {
        preRequestScript: "",
        testScript: "",
      };

      requestData.event?.forEach((event) => {
        if (event.listen === "prerequest") {
          scripts.preRequestScript = event.script.exec.join("\n");
        } else if (event.listen === "test") {
          scripts.testScript = event.script.exec.join("\n");
        }
      });

      // Create the new tab
      const newTab = {
        id: Date.now(),
        name: requestData.name || "Request 1",
        data: {
          ...initialTab.data,
          url: requestData.request?.url?.raw || "",
          requestType: requestData.request?.method?.toLowerCase() || "get",
          headers: headersObject,
          authToken: authDetails.authToken,
          authType: authDetails.authType,
          basicAuth: authDetails.basicAuth,
          preRequestScript: scripts.preRequestScript,
          testScript: scripts.testScript,
          requestBody: parsedBody,
          pathParams: requestData.request?.url?.variable?.map((param) => ({
            key: param.key || "",
            value: param.value || "",
            description: param.description || "",
          })) || [{ key: "", value: "", description: "" }],
          queryParams: requestData.request?.url?.query?.map((param) => ({
            key: param.key || "",
            value: param.value || "",
            description: param.description || "",
          })) || [{ key: "", value: "", description: "" }],
        },
      };

      // Update state
      setTabs([newTab]);
      setActiveTabId(newTab.id);

      // Set URL states
      setUrl(requestData.request?.url?.raw || "");
      setDisplayUrl(requestData.request?.url?.raw || "");

      // Set params
      setPathParams(
        requestData.request?.url?.variable?.map((param) => ({
          key: param.key || "",
          value: param.value || "",
          description: param.description || "",
        })) || [{ key: "", value: "", description: "" }]
      );

      setQueryParams(
        requestData.request?.url?.query?.map((param) => ({
          key: param.key || "",
          value: param.value || "",
          description: param.description || "",
        })) || [{ key: "", value: "", description: "" }]
      );
    }
  }, [location.state]);

  const handleAddNewTab = async (defaultData) => {
    // var defaultData = localStorage.get("savedTabs");
    const newTabIndex = tabs.length + 1;
    const newTab = {
      id: defaultData?.id || uuidv4(), // Unique ID for the new tab
      name: defaultData?.name || `Request ${newTabIndex}`,
      collectionName: defaultData?.collectionName || "Untitled Collection",
      data: {
        ...initialTab.data, // Use the initial tab data template
        url: defaultData?.url || "",
        // Reset other fields to initial state
        requestType: defaultData?.requestType || "get",
        headers: defaultData?.headers || {},
        requestBody: defaultData?.requestBody || "",
        pathParams: [{ key: "", value: "", description: "" }],
        queryParams: [{ key: "", value: "", description: "" }],
        authToken: "",
        authType: "Bearer",
        basicAuth: { username: "", password: "" },
        preRequestScript: "",
        testScript: "",
        isLoading: false,
        urlError: false,
        apiResponse: null,
      },
    };

    // Add the new tab to the existing tabs
    setTabs([...tabs, newTab]);

    // Set the active tab to the newly created tab
    setActiveTabId(newTab.id);

    // Reset URL-related states
    setUrl("");
    setDisplayUrl("");
  };

  const handleTabClicks = (tab) => {
    setActiveTab(tab);
  };

  const handleTabClick = useCallback(
    (tabId) => {
      setActiveTabId(tabId);
      const selectedTab = tabs.find((tab) => tab.id === tabId);
      if (selectedTab) {
        setUrl(selectedTab.data.url || "");
        setDisplayUrl(selectedTab.data.url || "");
        setPathParams(
          selectedTab.data.pathParams || [
            { key: "", value: "", description: "" },
          ]
        );
        setQueryParams(
          selectedTab.data.queryParams || [
            { key: "", value: "", description: "" },
          ]
        );
      }
    },
    [tabs]
  );

  const updateTabName = (id, name, collectionName) => {
    setTabs((prevTabs) =>
      prevTabs.map((tab) =>
        tab.id === id
          ? {
              ...tab,
              name: name || "",
              collectionName:
                collectionName || tab.collectionName || "Unnamed Collection",
            }
          : tab
      )
    );
  };

  const getActiveTabData = () => {
    const activeTab = tabs.find((tab) => tab.id === activeTabId);
    return activeTab?.data || initialTab.data;
  };

  const handleFileUpload = async (e) => {
    try {
      const importedData = await JsonFileImporter(e); // Wait for JsonFileImporter to finish

      if (importedData) {
        console.log("Imported collection data:", importedData);
        const collectionName = extractCollectionName(importedData);
        // Populate fields if it's a collection
        if (importedData.item && Array.isArray(importedData.item)) {
          populateFields(importedData.item, collectionName);
        }
      }
    } catch (error) {
      console.error("Error during file upload handling:", error);
      alert("An error occurred while importing the file.");
    }
  };

  const populateFields = (importedItems, collectionName) => {
    if (!importedItems || importedItems.length === 0) {
      alert("No valid requests found in imported data.");
      return;
    }

    const newTabs = importedItems
      .map((item, index) => {
        if (!item || !item.request) {
          console.error(
            `Invalid request format in imported data at index ${index}.`
          );
          return null;
        }

        // Determine authentication type and details
        const authType = item.request.auth?.type.toLowerCase() || "bearer";
        let authToken = "";
        let basicAuth = { username: "", password: "" };

        if (authType === "bearer") {
          authToken =
            item.request.auth?.bearer?.find((auth) => auth.key === "token")
              ?.value || "";
        } else if (authType === "basic") {
          basicAuth = {
            username:
              item.request.auth?.basic?.find((auth) => auth.key === "username")
                ?.value || "",
            password:
              item.request.auth?.basic?.find((auth) => auth.key === "password")
                ?.value || "",
          };
        }

        return {
          id: Date.now() + index, // Ensure unique IDs
          name: item.name || `Request ${index + 1}`,
          collectionName: collectionName,
          data: {
            ...initialTab.data,
            requestType: item.request.method.toLowerCase(),
            url: item.request.url.raw || "",
            headers: item.request.header.reduce((acc, header) => {
              if (header.key && header.value) {
                acc[header.key] = header.value;
              }
              return acc;
            }, {}),
            requestBody: item.request.body?.raw || "",
            authType, // Set the authentication type
            authToken, // Set Bearer token
            basicAuth, // Set Basic auth details
            pathParams: (item.request.url.variable || []).map((param) => ({
              key: param.key,
              value: param.value,
              description: param.description || "",
            })),
            queryParams: (item.request.url.query || []).map((param) => ({
              key: param.key,
              value: param.value,
              description: param.description || "",
            })),
            preRequestScript:
              item.event?.find((e) => e.listen === "prerequest")?.script
                ?.exec?.[0] || "",
            testScript:
              item.event?.find((e) => e.listen === "test")?.script?.exec?.[0] ||
              "",
          },
        };
      })
      .filter(Boolean); // Remove invalid entries

    setTabs((prevTabs) => [...prevTabs, ...newTabs]); // Append new tabs

    // Set the active tab to the first new request
    if (newTabs.length > 0) {
      setActiveTabId(newTabs[0].id);
      setUrl(newTabs[0].data.url);
      setDisplayUrl(newTabs[0].data.url);
    }
  };

  const handleclearBtn = () => {
    localStorage.clear();
    window.location.reload();
  };

  // Modify useEffect for URL synchronization
  useEffect(() => {
    // Ensure url and displayUrl are synchronized with the active tab's data
    const activeTabData = tabs.find((tab) => tab.id === activeTabId);
    // console.log("Active tab data:", activeTabData);
    if (activeTabData) {
      // Check if the tab's URL is empty or different from current URL
      if (activeTabData.data?.url !== url) {
        updateTabData("url", url);
      }

      // Ensure displayUrl matches the current URL
      if (activeTabData.data?.url && displayUrl !== url) {
        setDisplayUrl(url);
      }
    }
  }, [tabs, activeTabId, url, displayUrl, updateTabData]);

  const extractPathParams = (url) => {
    const regex = /:(\w+)/g;
    const matches = [];
    let match;
    while ((match = regex.exec(url)) !== null) {
      matches.push(match[1]);
    }
    return matches;
  };

  useEffect(() => {
    const pathParamsKeys = extractPathParams(url);

    setPathParams((prevPathParams) => {
      const updatedPathParams = pathParamsKeys.map((key) => {
        const existingParam = prevPathParams.find((param) => param.key === key);
        return {
          key,
          value: existingParam ? existingParam.value : "",
          description: existingParam ? existingParam.description : "",
          isPath: true,
        };
      });

      // Only update tab data if pathParams actually change
      if (
        JSON.stringify(updatedPathParams) !== JSON.stringify(prevPathParams)
      ) {
        updateTabData("pathParams", updatedPathParams);
      }

      return updatedPathParams;
    });

    // Prevent unnecessary updates to displayUrl
    if (url && displayUrl !== url) {
      setDisplayUrl(url);
    }
  }, [url]); // Remove displayUrl from the dependency array

  const handleParamsChange = (updatedPathParams, updatedQueryParams) => {
    setPathParams(updatedPathParams);
    setQueryParams(updatedQueryParams);
    // Update the active tab's data with the new params
    updateTabData("pathParams", updatedPathParams);
    updateTabData("queryParams", updatedQueryParams);
  };

  const handleSendbtn = async () => {
    // Retrieve environment data from localStorage
    const storedEnvironments = localStorage.getItem("environments");
    const environments = storedEnvironments
      ? Object.values(JSON.parse(storedEnvironments))
      : [];

    const activeTabData = getActiveTabData();

    // Find the selected environment
    const selectedEnvironment =
      activeTabData.activeEnvironment !== "no_environment"
        ? environments.find(
            (env) => env.name === activeTabData.activeEnvironment
          )
        : null;

    if (!activeTabData.url) {
      updateTabData("urlError", true);
      return;
    }
    updateTabData("apiResponse", null);
    updateTabData("urlError", false);
    updateTabData("isLoading", true);

    // Resolve environment variables before processing
    const resolvedTabData = resolveAllEnvironmentVariables(
      {
        url: activeTabData.url,
        requestType: activeTabData.requestType,
        headers: activeTabData.headers,
        requestBody: activeTabData.requestBody,
        pathParams: activeTabData.pathParams,
        queryParams: activeTabData.queryParams,
        authToken: activeTabData.authToken,
        basicAuth: activeTabData.basicAuth,
      },
      selectedEnvironment ? [selectedEnvironment] : []
    );

    let updatedUrl = resolvedTabData.url.split("?")[0];

    // Ensure pathParams is defined and is an array
    const pathParams = Array.isArray(resolvedTabData.pathParams)
      ? resolvedTabData.pathParams
      : [];

    pathParams.forEach((param) => {
      if (param.key && param.value) {
        const regex = new RegExp(`:${param.key}`, "g");
        updatedUrl = updatedUrl.replace(regex, param.value);
      }
    });

    // Ensure queryParams is defined and is an array
    const queryParams = Array.isArray(resolvedTabData.queryParams)
      ? resolvedTabData.queryParams
      : [];

    const queryString = queryParams
      .filter((param) => param.key && param.value)
      .map(
        (param) =>
          `${encodeURIComponent(param.key)}=${encodeURIComponent(param.value)}`
      )
      .join("&");
    console.log("resolvedTabData.requestBody: ", resolvedTabData.requestBody);
    const finalUrl = queryString ? `${updatedUrl}?${queryString}` : updatedUrl;
    try {
      const requestData = {
        method: resolvedTabData.requestType,
        url: finalUrl,
        headers: {
          // If requestBody is already a string, parse it

          ...resolvedTabData.headers,
          Authorization: resolvedTabData.authToken
            ? `Bearer ${resolvedTabData.authToken}`
            : "",
        },
        data: (() => {
          try {
            if (typeof resolvedTabData.requestBody === "string") {
              return resolvedTabData.requestBody
                ? JSON.parse(resolvedTabData.requestBody)
                : {};
            }

            // If requestBody is an object, return it directly
            if (typeof resolvedTabData.requestBody === "object") {
              return resolvedTabData.requestBody || {};
            }

            // If requestBody is undefined or null, return an empty object
            return {};
          } catch (error) {
            console.error("Error parsing request body:", error);
            return {};
          }
        })(),
      };

      const { apiResponse, status } = await APIServer({
        requestData,
        authToken: resolvedTabData.authToken,
        requestType: resolvedTabData.authType,
        basicAuth: resolvedTabData.basicAuth,
        preRequestScript: activeTabData.preRequestScript,
        testScript: activeTabData.testScript,
      });

      updateTabData("apiResponse", apiResponse);
      updateTabData("statusCode", status);

      logRequest(
        resolvedTabData.requestType,
        resolvedTabData.url,
        requestData,
        apiResponse,
        status
      );
    } catch (error) {
      console.error("Error sending API request:", error);
      updateTabData("apiResponse", { error: "Failed to send API request" });
      updateTabData("statusCode", "Error");
    } finally {
      updateTabData("isLoading", false);
    }
  };

  const logRequest = (method, url, requestData, responseData, status) => {
    const logs = JSON.parse(localStorage.getItem("requestLogs")) || [];
    const newLog = {
      method,
      url,
      requestData,
      responseData,
      status,
      open: false,
    };
    logs.push(newLog);
    localStorage.setItem("requestLogs", JSON.stringify(logs));
  };

  const getStatusClassName = () => {
    const status = getActiveTabData().statusCode;
    const statusStr = status ? status.toString() : "";

    if (statusStr.startsWith("2")) {
      return styles.successStatus;
    } else {
      return styles.errorStatus;
    }
  };
  const renderJson = (jsonData, indentLevel = 0, space = 4) => {
    if (!jsonData) return null;

    const indent = " ".repeat(indentLevel * space); // Fixed spaces for alignment
    const nextIndent = " ".repeat((indentLevel + 1) * space); // Increase indentation for nested elements

    // Helper function to escape \n
    const escapeNewlines = (value) =>
      typeof value === "string" ? value.replace(/\n/g, "\\n") : value;

    // Render arrays
    if (Array.isArray(jsonData)) {
      return (
        <span>
          [<br />
          {jsonData.map((item, index) => (
            <span key={index}>
              {nextIndent}
              {renderJson(item, indentLevel + 1, space)}
              {index < jsonData.length - 1 && ","}
              <br />
            </span>
          ))}
          {indent}]
        </span>
      );
    }

    // Render objects
    if (typeof jsonData === "object") {
      return (
        <span>
          {"{"}
          <br />
          {Object.entries(jsonData).map(([key, value], index, array) => (
            <span key={key}>
              {nextIndent}
              <span className={styles.key}>"{key}"</span>:{" "}
              {renderJson(value, indentLevel + 1, space)}
              {index < array.length - 1 && ","}
              <br />
            </span>
          ))}
          {indent}
          {"}"}
        </span>
      );
    }

    // Render primitive values (including strings)
    if (typeof jsonData === "string") {
      return <span className={styles.value}>"{escapeNewlines(jsonData)}"</span>;
    }
    return <span className={styles.value}>{String(jsonData)}</span>;
  };

  return (
    <div>
      <MainLayout handleFileUpload={handleFileUpload}>
        <div className={styles.CollectionPagemainWrapper}>
          <div className={styles.CHeadingWrapper}>
            <div className={styles.CHeadingInnerWrap}>
              <div className={styles.TabHeaderWrap}>
                {tabs.map((tab) => (
                  <div
                    key={tab.id}
                    className={`${styles.Tab} ${
                      tab.id === activeTabId ? styles.activeTab : ""
                    }`}
                    onClick={() => handleTabClick(tab.id)}
                  >
                    <input
                      type="text"
                      value={`${tab.name || "Unnamed Request"}`} // Ensure it's always a string
                      onChange={(e) => updateTabName(tab.id, e.target.value)}
                      className={styles.TabNameInput}
                    />
                  </div>
                ))}
                <div className={styles.CAddTabButtonWrap}>
                  <MdOutlineAdd
                    onClick={handleAddNewTab}
                    className={styles.CAddBtnIcon}
                  />
                </div>
              </div>
              <div className={styles.CEnvironmentDropdown}>
                <select
                  className={styles.ESelectList}
                  value={
                    getActiveTabData().activeEnvironment || "no_environment"
                  }
                  onChange={(e) =>
                    updateTabData("activeEnvironment", e.target.value)
                  }
                >
                  <option value="no_environment">No Environment</option>
                  {(() => {
                    const storedEnvironments =
                      localStorage.getItem("environments");
                    const environments = storedEnvironments
                      ? Object.values(JSON.parse(storedEnvironments))
                      : [];

                    return environments.map((env) => (
                      <option key={env.name} value={env.name}>
                        {env.name}
                      </option>
                    ));
                  })()}
                </select>
              </div>
            </div>
          </div>
          <div className={styles.CollectionInnerWrapper}>
            <div className={styles.CollectionRequestDisplay}>
              {(() => {
                const activeTab = tabs.find((tab) => tab.id === activeTabId);
                return activeTab
                  ? `${activeTab.collectionName || "Untitled Collection"}/${
                      activeTab.name || "Unnamed Request"
                    }`
                  : "No Active Tab";
              })()}
            </div>
            <div className={styles.CSearchMainWrapper}>
              <div className={styles.CDropDownWrapper}>
                <select
                  className={styles.CSelectList}
                  value={getActiveTabData().requestType}
                  onChange={(e) => updateTabData("requestType", e.target.value)}
                >
                  <option value="get">GET</option>
                  <option value="post">POST</option>
                  <option value="put">PUT</option>
                  <option value="delete">DELETE</option>
                </select>
              </div>
              <div className={styles.HrLine}></div>
              <div className={styles.CSearchWrapper}>
                <input
                  type="text"
                  className={`${styles.CSearchfield} ${
                    getActiveTabData().urlError ? styles.errorBorder : ""
                  }`}
                  value={displayUrl}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  required
                />
              </div>
              <div className={styles.CSavebtn}>
                <button className={styles.CSaveField} onClick={handleclearBtn}>
                  ClearAll
                </button>
              </div>
              <div className={styles.CSendBtn}>
                <button className={styles.CSendField} onClick={handleSendbtn}>
                  Send
                </button>
              </div>
            </div>
          </div>
          <div className={styles.CBodyWrapper}>
            <div className={styles.CRequestBodyWrapper}>
              <div className={styles.CRequestOptionWrapper}>
                <span
                  className={`${styles.CLinkOuterWrapper} ${
                    activeTab === "Params" ? styles.activeTab : ""
                  }`}
                  onClick={() => handleTabClicks("Params")}
                >
                  <Link className={styles.CLinkField}>Params</Link>
                </span>
                <span
                  className={`${styles.CLinkOuterWrapper} ${
                    activeTab === "Auth" ? styles.activeTab : ""
                  }`}
                  onClick={() => handleTabClicks("Auth")}
                >
                  <Link className={styles.CLinkField}>Auth</Link>
                </span>
                <span
                  className={`${styles.CLinkOuterWrapper} ${
                    activeTab === "Header" ? styles.activeTab : ""
                  }`}
                  onClick={() => handleTabClicks("Header")}
                >
                  <Link className={styles.CLinkField}>Header</Link>
                </span>
                <span
                  className={`${styles.CLinkOuterWrapper} ${
                    activeTab === "RequestBody" ? styles.activeTab : ""
                  }`}
                  onClick={() => handleTabClicks("RequestBody")}
                >
                  <Link className={styles.CLinkField}>RequestBody</Link>
                </span>
                <span
                  className={`${styles.CLinkOuterWrapper} ${
                    activeTab === "Scripts" ? styles.activeTab : ""
                  }`}
                  onClick={() => handleTabClicks("Scripts")}
                >
                  <Link className={styles.CLinkField}>Scripts</Link>
                </span>
              </div>
              <div className={styles.CRequestOptionInputWrapper}>
                {activeTab === "Params" && (
                  <ParamsComp
                    onParamsChange={handleParamsChange}
                    pathParams={getActiveTabData().pathParams || pathParams}
                    setPathParams={(params) =>
                      updateTabData("pathParams", params)
                    }
                    queryParams={getActiveTabData().queryParams || queryParams}
                    setQueryParams={(params) =>
                      updateTabData("queryParams", params)
                    }
                    setUrl={(url) => updateTabData("url", url)}
                  />
                )}
                {activeTab === "Auth" && (
                  <AuthComp
                    authToken={getActiveTabData().authToken || ""}
                    setAuthToken={(token) => updateTabData("authToken", token)}
                    basicAuth={
                      getActiveTabData().basicAuth || {
                        username: "",
                        password: "",
                      }
                    }
                    setBasicAuth={(basicAuth) =>
                      updateTabData("basicAuth", basicAuth)
                    }
                    requestType={getActiveTabData().authType || "Bearer"}
                    setRequestType={(type) => updateTabData("authType", type)}
                  />
                )}

                {activeTab === "Header" && (
                  <HeaderComp
                    headers={getActiveTabData().headers || {}}
                    setHeaders={(headers) => updateTabData("headers", headers)}
                  />
                )}
                {activeTab === "RequestBody" && (
                  <RequestBodyComp
                    requestBody={getActiveTabData().requestBody || ""}
                    setRequestBody={(body) =>
                      updateTabData("requestBody", body)
                    }
                  />
                )}
                {activeTab === "Scripts" && (
                  <ScriptsComp
                    preRequestScript={getActiveTabData().preRequestScript || ""}
                    setPreRequestScript={(script) =>
                      updateTabData("preRequestScript", script)
                    }
                    testScript={getActiveTabData().testScript || ""}
                    setTestScript={(script) =>
                      updateTabData("testScript", script)
                    }
                  />
                )}
              </div>
            </div>
            <div className={styles.CResponseBodyWrapper}>
              <div className={styles.CResponseStatusWrapper}>
                <h3 className={styles.CResponseStatusHeading}>Response</h3>
                {getActiveTabData().statusCode && (
                  <p
                    className={`${
                      styles.CResponseStatusField
                    } ${getStatusClassName()}`}
                  >
                    {getActiveTabData().statusCode
                      ? `${getActiveTabData().statusCode}`
                      : "N/A"}
                  </p>
                )}
              </div>
              {getActiveTabData().isLoading ? (
                <div className={styles.LoadingField}>Loading...</div>
              ) : (
                <div className={styles.CResponseMainBodyWrapper}>
                  <div className={styles.CResponseMainBodyField}>
                    <pre className={styles.json}>
                      {" "}
                      {getActiveTabData().apiResponse
                        ? renderJson(getActiveTabData().apiResponse) // Fallback to tab data
                        : ""}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </MainLayout>
    </div>
  );
}
