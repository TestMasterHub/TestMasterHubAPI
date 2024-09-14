import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../Layouts/MainLayout";
import styles from "../Styles/PageStyles/CollectionsPage.module.css";
import AuthComp from "../Components/RequestBody/AuthComp";
import RequestBodyComp from "../Components/RequestBody/RequestBodyComp";
import APIServer from "../APIFunction/APIServer";
import ParamsComp from "../Components/RequestBody/ParamsComp";
import HeaderComp from "../Components/RequestBody/HeaderComp";
import ScriptsComp from "../Components/RequestBody/ScriptsComp";
import TMH from "../Utlis/TMH";

window.TMH = TMH;

export default function CollectionPage() {
  const [activeTab, setActiveTab] = useState("Params");
  const [requestType, setRequestType] = useState("get");
  const [url, setUrl] = useState(""); // User-entered URL
  const [headers, setHeaders] = useState({});
  const [authToken, setAuthToken] = useState("");
  const [requestBody, setRequestBody] = useState("");
  const [authType, setAuthType] = useState("Bearer");
  const [preRequestScript, setPreRequestScript] = useState("");
  const [testScript, setTestScript] = useState(
    "const JsonData = TMH.response.json(responseData);"
  );
  const [displayUrl, setDisplayUrl] = useState(""); // URL to display
  const [basicAuth, setBasicAuth] = useState({
    username: "",
    password: "",
  });

  const [apiResponse, setApiResponse] = useState(null);
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [urlError, setUrlError] = useState(false);

  // Separate state variables for path and query params
  const [pathParams, setPathParams] = useState([
    { key: "", value: "", description: "" },
  ]);
  const [queryParams, setQueryParams] = useState([
    { key: "", value: "", description: "" },
  ]);

  const extractPathParams = (url) => {
    const regex = /:(\w+)/g;
    const matches = [];
    let match;
    while ((match = regex.exec(url)) !== null) {
      matches.push(match[1]);
    }
    return matches;
  };
  const logRequest = (method, url, requestData, responseData) => {
    const logs = JSON.parse(localStorage.getItem('requestLogs')) || [];
    const newLog = { method, url, requestData, responseData, open: false }; // "open" state for dropdown
    logs.push(newLog);
    localStorage.setItem('requestLogs', JSON.stringify(logs));
  };
  useEffect(() => {
    const pathParamsKeys = extractPathParams(url);

    // Update the pathParams with the latest keys
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

    // Set the URL to display if it is not already set
    if (url && !displayUrl) {
      setDisplayUrl(url);
    }
  }, [url, displayUrl]);

  const handleParamsChange = (updatedPathParams, updatedQueryParams) => {
    setPathParams(updatedPathParams);
    setQueryParams(updatedQueryParams);
  };

  const HandleSavebtn = () => {
    alert("Demo Save Function");
  };

  const handleSendbtn = async () => {
    if (!url) {
      setUrlError(true);
      return;
    }
    setApiResponse(null);
    setUrlError(false);
    setIsLoading(true);
  
    // Construct the final URL by replacing path and query parameters
    let updatedUrl = url.split("?")[0];
  
    // Replace path parameters in the URL
    pathParams.forEach((param) => {
      if (param.key && param.value) {
        const regex = new RegExp(`:${param.key}`, "g");
        updatedUrl = updatedUrl.replace(regex, param.value);
      }
    });
  
    // Handle query parameters
    const queryString = queryParams
      .filter((param) => param.key && param.value)
      .map(
        (param) =>
          `${encodeURIComponent(param.key)}=${encodeURIComponent(param.value)}`
      )
      .join("&");
  
    const finalUrl = queryString ? `${updatedUrl}?${queryString}` : updatedUrl;
  
    console.log("Updated URL after processing:", finalUrl);
  
    try {
      // Send the API request using the constructed URL
      const requestData = {
        method: requestType,
        url: finalUrl, // Use the updated URL for API request
        headers: {
          ...headers,
          Authorization: authToken ? `Bearer ${authToken}` : "",
        },
        data: requestBody ? JSON.parse(requestBody) : {},
      };
  
      const { apiResponse, status } = await APIServer({
        requestData,
        authToken,
        requestType: authType,
        basicAuth,
        preRequestScript,
        testScript,
      });
  
      setApiResponse(apiResponse);
      setStatus(status);
  
      // Log request and response data
      logRequest(requestType, url, requestData, apiResponse);
    } catch (error) {
      console.error("Error sending API request:", error);
      alert("Failed to send API request.");
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  const openConsole = () => {
    // Open the console in a new window
    window.consoleWindow = window.open('/console', '_blank', 'width=800,height=600');
  };

  // Determine if status code is 2xx (success) or other (error)
  const getStatusClassName = () => {
    const statusStr = status.toString(); // Convert status to string if not already
    if (statusStr.startsWith("2")) {
      return styles.successStatus;
    } else {
      return styles.errorStatus;
    }
  };

  return (
    <div>
      <MainLayout>
        <div className={styles.CollectionPagemainWrapper}>
          <div className={styles.CHeadingWrapper}>
            <h3 className={styles.CHeadingField}>Collections</h3>
          </div>
          <div className={styles.CollectionInnerWrapper}>
            <div className={styles.CSearchMainWrapper}>
              <div className={styles.CDropDownWrapper}>
                <select
                  name="RequestType"
                  className={styles.CSelectList}
                  value={requestType}
                  onChange={(e) => setRequestType(e.target.value)}
                >
                  <option value="get">Get</option>
                  <option value="post">Post</option>
                  <option value="put">Put</option>
                  <option value="patch">Patch</option>
                  <option value="delete">Delete</option>
                </select>
              </div>
              <div className={styles.HrLine}></div>
              <div className={styles.CSearchWrapper}>
                <input
                  type="text"
                  className={`${styles.CSearchfield} ${
                    urlError ? styles.errorBorder : ""
                  }`}
                  placeholder="Enter URL"
                  value={displayUrl} // Display user-entered URL
                  onChange={(e) => {
                    setUrl(e.target.value);
                    setDisplayUrl(e.target.value); // Also update display URL
                    if (e.target.value) setUrlError(false);
                  }}
                  required={true}
                />
              </div>
              <div className={styles.CSavebtn}>
                <button className={styles.CSaveField} onClick={HandleSavebtn}>
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
          {isLoading && <p className={styles.LoadingField}>Please Wait....</p>}
          <div className={styles.CBodyWrapper}>
            <div className={styles.CRequestBodyWrapper}>
              <div className={styles.CRequestOptionWrapper}>
                <span
                  className={`${styles.CLinkOuterWrapper} ${
                    activeTab === "Params" ? styles.activeTab : ""
                  }`}
                  onClick={() => handleTabClick("Params")}
                >
                  <Link className={styles.CLinkField}>Params</Link>
                </span>
                <span
                  className={`${styles.CLinkOuterWrapper} ${
                    activeTab === "Auth" ? styles.activeTab : ""
                  }`}
                  onClick={() => handleTabClick("Auth")}
                >
                  <Link className={styles.CLinkField}>Auth</Link>
                </span>
                <span
                  className={`${styles.CLinkOuterWrapper} ${
                    activeTab === "Header" ? styles.activeTab : ""
                  }`}
                  onClick={() => handleTabClick("Header")}
                >
                  <Link className={styles.CLinkField}>Header</Link>
                </span>
                <span
                  className={`${styles.CLinkOuterWrapper} ${
                    activeTab === "RequestBody" ? styles.activeTab : ""
                  }`}
                  onClick={() => handleTabClick("RequestBody")}
                >
                  <Link className={styles.CLinkField}>RequestBody</Link>
                </span>
                <span
                  className={`${styles.CLinkOuterWrapper} ${
                    activeTab === "Scripts" ? styles.activeTab : ""
                  }`}
                  onClick={() => handleTabClick("Scripts")}
                >
                  <Link className={styles.CLinkField}>Scripts</Link>
                </span>
              </div>
              <div className={styles.CRequestOptionInputWrapper}>
                {activeTab === "Params" && (
                  <ParamsComp
                    onParamsChange={handleParamsChange}
                    pathParams={pathParams}
                    setPathParams={setPathParams}
                    queryParams={queryParams}
                    setQueryParams={setQueryParams}
                    setUrl={setUrl}
                  />
                )}
                {activeTab === "Auth" && (
                  <AuthComp
                    authToken={authToken}
                    setAuthToken={setAuthToken}
                    requestType={authType}
                    setRequestType={setAuthType}
                    basicAuth={basicAuth}
                    setBasicAuth={setBasicAuth}
                  />
                )}
                {activeTab === "Header" && (
                  <HeaderComp headers={headers} setHeaders={setHeaders} />
                )}
                {activeTab === "RequestBody" && (
                  <RequestBodyComp
                    requestBody={requestBody}
                    setRequestBody={setRequestBody}
                  />
                )}
                {activeTab === "Scripts" && (
                  <ScriptsComp
                    preRequestScript={preRequestScript}
                    setPreRequestScript={setPreRequestScript}
                    testScript={testScript}
                    setTestScript={setTestScript}
                  />
                )}
              </div>
            </div>
            <div className={styles.CResponseBodyWrapper}>
              <div className={styles.CResponseStatusWrapper}>
                <h3 className={styles.CResponseStatusHeading}>Response</h3>
                {status && (
                  <p
                    className={`${
                      styles.CResponseStatusField
                    } ${getStatusClassName()}`}
                  >
                    {status ? `${status}` : "N/A"}
                  </p>
                )}
              </div>
              <div className={styles.CResponseMainBodyWrapper}>
                <pre className={styles.CResponseMainBodyField}>
                  {apiResponse ? JSON.stringify(apiResponse, null, 2) : ""}
                </pre>
              </div>
            </div>
          </div>
          <div>
            <button className={styles.PConsolePage} onClick={openConsole}>Open Console</button>
          </div>
        </div>
      </MainLayout>
    </div>
  );
}
