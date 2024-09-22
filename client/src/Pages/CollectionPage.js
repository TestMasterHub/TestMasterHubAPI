import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import MainLayout from "../Layouts/MainLayout";
import styles from "../Styles/PageStyles/CollectionsPage.module.css";
import AuthComp from "../Components/RequestBody/AuthComp";
import RequestBodyComp from "../Components/RequestBody/RequestBodyComp";
import APIServer from "../APIFunction/APIServer";
import ParamsComp from "../Components/RequestBody/ParamsComp";
import HeaderComp from "../Components/RequestBody/HeaderComp";
import ScriptsComp from "../Components/RequestBody/ScriptsComp";
import { generateCollectionJson } from "../Utlis/generateCollectionJson";
import TMH from "../Utlis/TMH";
import { MdOutlineAdd } from "react-icons/md";
window.TMH = TMH;

export default function CollectionPage() {
  const [activeTab, setActiveTab] = useState("Params");
  const [tabs, setTabs] = useState([
    { id: Date.now(), name: `Request 1`, data: { requestType: "get" } },
  ]);
  const [activeTabId, setActiveTabId] = useState(tabs[0].id);
  const [pathParams, setPathParams] = useState([
    { key: "", value: "", description: "" },
  ]);
  const [queryParams, setQueryParams] = useState([
    { key: "", value: "", description: "" },
  ]);
  const [url, setUrl] = useState("");
  const [displayUrl, setDisplayUrl] = useState("");
  const [statusCode, setStatusCode] = useState("");

  const handleTabClicks = (tab) => {
    setActiveTab(tab);
  };

  const handleTabClick = (tabId) => {
    setActiveTabId(tabId);
  };

  const handleAddNewTab = () => {
    const newTabIndex = tabs.length + 1;
    const newTab = {
      id: Date.now(),
      name: `Request ${newTabIndex}`,
      data: { authType: "Bearer", requestType: "get" },
    };
    setTabs([...tabs, newTab]);
    setActiveTabId(newTab.id);
  };
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
    return activeTab ? activeTab.data : {}; // Return empty object if activeTab is undefined
  };

  const updateTabData = (field, value) => {
    setTabs((prevTabs) => {
      const updatedTabs = [...prevTabs];
      const activeTabIndex = updatedTabs.findIndex(
        (tab) => tab.id === activeTabId
      );
      updatedTabs[activeTabIndex].data[field] = value;
      return updatedTabs;
    });
  };

  const handleSavebtn = () => {
    const updatedTabs = tabs.map((tab, index) => {
      const activeTabData = getActiveTabData(tab.id);

      // Ensure default tab name is assigned if none is provided
      return {
        ...tab,
        name: tab.name || `Request ${index + 1}`, // Default tab name if none provided

        // Generate collection data for each tab
        data: generateCollectionJson({
          requestType: activeTabData.requestType,
          url: activeTabData.url,
          pathParams: activeTabData.pathParams,
          queryParams: activeTabData.queryParams,
          headers: activeTabData.headers,
          requestBody: activeTabData.requestBody,
          authToken: activeTabData.authToken,
          basicAuth: activeTabData.basicAuth,
          preRequestScript: activeTabData.preRequestScript,
          testScript: activeTabData.testScript,
        }),
      };
    });

    // Convert the updated tabs data to JSON format
    const collectionJson = JSON.stringify(updatedTabs, null, 2);

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

        // Validate if the imported JSON is an array of requests
        if (Array.isArray(importedData) && importedData.length > 0) {
          populateFields(importedData);
        } else {
          alert("Invalid JSON structure. Expected an array of requests.");
        }
      } catch (error) {
        alert("Invalid JSON file");
      }
    };

    reader.readAsText(file);
  };

  const populateFields = (importedData) => {
    if (!importedData || importedData.length === 0) {
      alert("No valid requests found in imported data.");
      return;
    }

    const firstRequest = importedData[0];
    if (!firstRequest || !firstRequest.data) {
      alert("Invalid request format in imported data.");
      return;
    }
    updateTabData("url", firstRequest.data.url || "");
    updateTabData("requestType", firstRequest.data.method || "get");
    updateTabData("headers", firstRequest.data.headers || {});
    updateTabData("requestBody", firstRequest.data.requestBody || "");
    updateTabData("authToken", firstRequest.data.auth?.token || "");
    updateTabData("authType", firstRequest.data.auth?.type || "Bearer");
    updateTabData(
      "basicAuth",
      firstRequest.data.auth?.basicAuth || { username: "", password: "" }
    );
    updateTabData("preRequestScript", firstRequest.data.preRequestScript || "");
    updateTabData("testScript", firstRequest.data.testScript || "");
    updateTabData("pathParams", firstRequest.data.pathParams || []);
    updateTabData("queryParams", firstRequest.data.queryParams || []);
    updateTabData("displayUrl", firstRequest.data.url || "");

    // Save the imported data to localStorage so it persists after refresh
    localStorage.setItem("importedData", JSON.stringify(firstRequest));
  };

  useEffect(() => {
    const savedData = localStorage.getItem("importedData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      if (parsedData && parsedData.data) {
        populateFields([parsedData]); // Wrap in an array if you're expecting it to be an array
      }
    }
  }, []);

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
      return updatedPathParams;
    });

    if (url && !displayUrl) {
      setDisplayUrl(url);
    }
  }, [url, displayUrl]);

  const handleParamsChange = (updatedPathParams, updatedQueryParams) => {
    setPathParams(updatedPathParams);
    setQueryParams(updatedQueryParams);
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
        data: activeTabData.requestBody
          ? JSON.parse(activeTabData.requestBody)
          : {},
      };

      const { apiResponse, status } = await APIServer({
        requestData,
        authToken: activeTabData.authToken,
        requestType: activeTabData.authType,
        basicAuth: activeTabData.basicAuth,
        preRequestScript: activeTabData.preRequestScript,
        testScript: activeTabData.testScript,
      });
      updateTabData("apiResponse", apiResponse);
      setStatusCode(status);
      logRequest(
        activeTabData.requestType,
        activeTabData.url,
        requestData,
        apiResponse,
        status
      );
    } catch (error) {
      console.error("Error sending API request:", error);
      alert("Failed to send API request.");
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
    const status = statusCode;
    const statusStr = status ? status.toString() : "";

    if (statusStr.startsWith("2")) {
      return styles.successStatus;
    } else {
      return styles.errorStatus;
    }
  };
  const renderJson = (jsonData) => {
    return Object.entries(jsonData).map(([key, value], index) => (
      <div key={index}>
        <span className={styles.key}>"{key}"</span>:
        <span className={styles.value}>
          {typeof value === "object"
            ? JSON.stringify(value, null, 2)
            : `"${value}"`}
        </span>
      </div>
    ));
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
                  value={getActiveTabData().url || ""} // Ensure it's always a string
                  onChange={(e) => {
                    setUrl(e.target.value);
                    setDisplayUrl(e.target.value);
                    updateTabData("url", e.target.value);
                    if (e.target.value) updateTabData("urlError", false);
                  }}
                  required
                />
              </div>
              <div className={styles.CSavebtn}>
                <button className={styles.CSaveField} onClick={handleSavebtn}>
                  Save
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
                {statusCode && (
                  <p
                    className={`${
                      styles.CResponseStatusField
                    } ${getStatusClassName()}`}
                  >
                    {statusCode ? `${statusCode}` : "N/A"}
                  </p>
                )}
              </div>
              {getActiveTabData().isLoading ? (
                <div className={styles.LoadingField}>Loading...</div>
              ) : (
                <div className={styles.CResponseMainBodyWrapper}>
                  <div className={styles.CResponseMainBodyField}>
                    {getActiveTabData().apiResponse
                      ? renderJson(getActiveTabData().apiResponse)
                      : ""}
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
