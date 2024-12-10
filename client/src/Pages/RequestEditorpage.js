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
import { generateCollectionJson } from "../Utlis/generateCollectionJson";
import HandleCollectionStorage from "../Utlis/HandleCollectionStorage";
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
  const [Ispageloaded, SetIspageloaded] = useState(false);

  window.onload = () => {
    updateTabData();
    SetIspageloaded(true);
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
    // const requestData = localStorage.getItem("newRequest");
    if (requestData) {
      const newTab = {
        id: Date.now(),
        name: requestData.name || "Request 1",
        data: {
          ...initialTab.data,
          url: requestData.data?.url || "",
          requestType: requestData.data?.requestType.toLowerCase() || "get",
          headers: requestData.data?.headers || {},
          authToken: requestData.data?.authToken || "", // Safely access authToken
          authType: requestData.data?.authType?.toLowerCase() || "bearer", // Safely access authType
          basicAuth: requestData.data?.basicAuth || {
            username: "",
            password: "",
          },
          preRequestScript: requestData.data?.preRequestScript || "",
          testScript: requestData.data?.testScript || "",
          requestBody: requestData.data?.requestBody || "",
          pathParams: requestData.data?.pathParams || [
            { key: "", value: "", description: "" },
          ],
          queryParams: requestData.data?.queryParams || [
            { key: "", value: "", description: "" },
          ],
        },
      };
      setTabs([newTab]);
      setActiveTabId(newTab.id);
      setUrl(requestData.data?.url.raw || "");
      setDisplayUrl(requestData.data?.url.raw || "");
      setPathParams(
        requestData.data?.url.variable || [
          { key: "", value: "", description: "" },
        ]
      );
      setQueryParams(
        requestData.data?.url.query || [{ key: "", value: "", description: "" }]
      );
    }
  }, [location.state]);

  const handleAddNewTab = async (defaultData) => {
    // var defaultData = localStorage.get("savedTabs");
    const newTabIndex = tabs.length + 1;
    const newTab = {
      id: defaultData?.id || uuidv4(), // Unique ID for the new tab
      name: defaultData?.name || `Request ${newTabIndex}`,
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

  const updateTabName = (id, name) => {
    setTabs((prevTabs) =>
      prevTabs.map((tab) =>
        tab.id === id
          ? { ...tab, name: name || "" } // Set to empty string if name is cleared
          : tab
      )
    );
  };

  const getActiveTabData = () => {
    const activeTab = tabs.find((tab) => tab.id === activeTabId);
    return activeTab?.data || initialTab.data;
  };

  const handleExportBtn = () => {
    const collectionName = prompt("Verify Collection Name:");

    // Create the collection info object

    // Map over tabs to create the item array with unique request IDs
    const collectionItems = tabs.map((tab, index) => {
      const activeTabData = getActiveTabData(tab.id);
      if (!activeTabData) {
        return null; // Skip this tab if the data is not available
      }

      return {
        id: uuidv4(), // Unique ID for each request
        name: tab.name || `Request ${index + 1}`,
        request: {
          auth: {
            type: activeTabData.authType,
            ...(activeTabData.authType === "Bearer"
              ? {
                  bearer: [
                    {
                      key: "token",
                      value: activeTabData.authToken || "",
                      type: "string",
                    },
                  ],
                }
              : {
                  basic: [
                    {
                      key: "password",
                      value: activeTabData.basicAuth.password || "",
                      type: "string",
                    },
                    {
                      key: "username",
                      value: activeTabData.basicAuth.username || "",
                      type: "string",
                    },
                  ],
                }),
          },
          method: activeTabData.requestType.toUpperCase() || "GET",
          header: Object.entries(activeTabData.headers || {}).map(
            ([key, value]) => ({
              key,
              value,
            })
          ),
          body: {
            mode: "raw",
            raw: activeTabData.requestBody || "",
            options: {
              raw: {
                language: "json",
              },
            },
          },
          url: {
            raw: activeTabData.url || "",
            protocol: (activeTabData.url || "").split("://")[0],
            host: (activeTabData.url || "")
              .split("://")[1]
              ?.split("/")[0]
              .split("."),
            path: (activeTabData.url || "")
              .split("://")[1]
              ?.split("/")
              .slice(1),
            query: (activeTabData.queryParams || []).map((param) => ({
              key: param.key,
              value: param.value,
            })),
            variable: (activeTabData.pathParams || []).map((param) => ({
              key: param.key,
              value: param.value,
              description: param.description || "",
            })),
          },
        },
        event: [
          {
            listen: "prerequest",
            script: {
              type: "text/javascript",
              exec: [activeTabData.preRequestScript || ""],
            },
          },
          {
            listen: "test",
            script: {
              type: "text/javascript",
              exec: [activeTabData.testScript || ""],
            },
          },
        ],
      };
    });

    // Filter out any null values from the collectionItems array
    const validCollectionItems = generateCollectionJson(
      collectionName,
      collectionItems.filter(Boolean)
    );

    // Construct the final collection JSON structure
    const collectionDetails = validCollectionItems;

    // Convert the collection data to JSON format
    const collectionJson = JSON.stringify(collectionDetails, null, 2);

    // Create a Blob object for the JSON data
    const blob = new Blob([collectionJson], { type: "application/json" });

    // Create a temporary link element for downloading the file
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);

    // Use a timestamp to generate a unique filename for the download
    link.download = `API_Collection_${Date.now()}.json`;

    // Programmatically trigger the download
    link.click();

    // Clean up the object URL to prevent memory leaks
    URL.revokeObjectURL(link.href);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target.result);
        console.log("importedData: " + importedData.item);
        // Validate the imported JSON structure
        if (
          importedData.info &&
          importedData.item &&
          Array.isArray(importedData.item)
        ) {
          // Save the imported data if needed
          HandleCollectionStorage(importedData);

          // Process the items array directly
          populateFields(importedData.item);
          window.location.reload();
        } else {
          alert(
            "Invalid JSON structure. Expected a collection with info and items."
          );
        }
      } catch (error) {
        console.error("Error processing file:", error);
        alert("Invalid JSON file");
      }
    };

    reader.readAsText(file);
  };

  const populateFields = (importedItems) => {
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
        const authType = item.request.auth?.type || "Bearer";
        let authToken = "";
        let basicAuth = { username: "", password: "" };

        if (authType === "Bearer") {
          authToken =
            item.request.auth?.bearer?.find((auth) => auth.key === "token")
              ?.value || "";
        } else if (authType === "Basic") {
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
    const activeTabData = getActiveTabData();
    if (!activeTabData.url) {
      updateTabData("urlError", true);
      return;
    }
    updateTabData("apiResponse", null);
    updateTabData("urlError", false);
    updateTabData("isLoading", true);

    let updatedUrl = activeTabData.url.split("?")[0];
    console.log("requestData: " + updatedUrl + activeTabData.headers);
    // Ensure pathParams is defined and is an array
    const pathParams = Array.isArray(activeTabData.pathParams)
      ? activeTabData.pathParams
      : [];

    pathParams.forEach((param) => {
      if (param.key && param.value) {
        const regex = new RegExp(`:${param.key}`, "g");
        updatedUrl = updatedUrl.replace(regex, param.value);
      }
    });

    // Ensure queryParams is defined and is an array
    const queryParams = Array.isArray(activeTabData.queryParams)
      ? activeTabData.queryParams
      : [];

    const queryString = queryParams
      .filter((param) => param.key && param.value)
      .map(
        (param) =>
          `${encodeURIComponent(param.key)}=${encodeURIComponent(param.value)}`
      )
      .join("&");

    const finalUrl = queryString ? `${updatedUrl}?${queryString}` : updatedUrl;
    try {
      const requestData = {
        method: activeTabData.requestType,
        url: finalUrl,
        headers: {
          ...activeTabData.headers,
          Authorization: activeTabData.authToken
            ? `Bearer ${activeTabData.authToken}`
            : "",
        },
        data: (() => {
          try {
            // If requestBody is already a string, parse it
            if (typeof activeTabData.requestBody === "string") {
              return activeTabData.requestBody
                ? JSON.parse(activeTabData.requestBody)
                : {};
            }

            // If requestBody is an object, return it directly
            if (typeof activeTabData.requestBody === "object") {
              return activeTabData.requestBody || {};
            }

            // If requestBody is undefined or null, return an empty object
            return {};
          } catch (error) {
            console.error("Error parsing request body:", error);
            return {};
          }
        })(),
      };
      // handleUrlChange(finalUrl);
      const { apiResponse, status } = await APIServer({
        requestData,
        authToken: activeTabData.authToken,
        requestType: activeTabData.authType,
        basicAuth: activeTabData.basicAuth,
        preRequestScript: activeTabData.preRequestScript,
        testScript: activeTabData.testScript,
      });

      if (getActiveTabData().apiResponse !== null) {
        console.log("apiResponse", getActiveTabData().apiResponse);
      }

      updateTabData("apiResponse", apiResponse);
      updateTabData("statusCode", status);

      logRequest(
        activeTabData.requestType,
        activeTabData.url,
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
                      value={tab.name || ""} // Ensure it's always a string
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
            </div>
          </div>
          <div className={styles.CollectionInnerWrapper}>
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
                <button className={styles.CSaveField} onClick={handleExportBtn}>
                  Export
                </button>
              </div>
              {/* <div className={styles.CSavebtn}>
                <button className={styles.CSaveField} onClick={handleclearBtn}>
                  ClearAll
                </button>
              </div> */}
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
