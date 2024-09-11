import React, { useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../Layouts/MainLayout";
import styles from "../Styles/PageStyles/CollectionsPage.module.css";
import AuthComp from "../Components/RequestBody/AuthComp";
import RequestBodyComp from "../Components/RequestBody/RequestBodyComp";
import APIServer from "../APIFunction/APIServer";
import ParamsComp from "../Components/RequestBody/ParamsComp";
import HeaderComp from "../Components/RequestBody/HeaderComp";
import ScriptsComp from "../Components/RequestBody/ScriptsComp";
import TMH from './Utlis/TMH';

window.TMH = TMH;
export default function CollectionPage() {
  const [activeTab, setActiveTab] = useState("Params");
  const [requestType, setRequestType] = useState("get");
  const [url, setUrl] = useState("");
  const [headers, setHeaders] = useState({});
  const [authToken, setAuthToken] = useState("");
  const [requestBody, setRequestBody] = useState("");
  const [authType, setAuthType] = useState("Bearer");
  const [preRequestScript, setPreRequestScript] = useState("");
  const [testScript, setTestScript] = useState("const JsonData = TMH.response.json(responseData);");
  const [basicAuth, setBasicAuth] = useState({
    username: "",
    password: "",
  });
  const [apiResponse, setApiResponse] = useState(null);
  const [status, setStatus] = useState("");

  const HandleSavebtn = () => {
    alert("Demo Save Function");
  };

  const handleSendbtn = async () => {
    try {
      const requestData = {
        method: requestType,
        url: url,
        headers: {
          ...headers,
          Authorization: authToken ? `Bearer ${authToken}` : "",
        },
        data: requestBody ? JSON.parse(requestBody) : {},
      };

      const { apiResponse, status } = await APIServer({
        requestData,
        authToken,
        requestType,
        basicAuth,
        preRequestScript,
        testScript,
      });

      setApiResponse(apiResponse);
      setStatus(status);
    } catch (error) {
      console.error("Error sending API request:", error);
      alert("Failed to send API request.");
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
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
                  className={styles.CSearchfield}
                  placeholder="Enter URL"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
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
                {activeTab === "Params" && <ParamsComp />}
                {activeTab === "Auth" && (
                  <AuthComp
                    authToken={authToken}
                    setAuthToken={setAuthToken}
                    authType={authType}
                    setAuthType={setAuthType}
                    basicAuth={basicAuth}
                    setBasicAuth={setBasicAuth}
                  />
                )}
                {activeTab === "Header" && (
                  <HeaderComp
                    headers={headers}
                    setHeaders={setHeaders}
                  />
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
            <div className={styles.CresponseWrapper}>
              <div className={styles.CResponseOptionWrapper}>
                <h3 className={styles.CResponseHeading}>Response</h3>
                {status && (
                  <span className={styles.CstatusCodefield}>{status}</span>
                )}
              </div>
              <div className={styles.CResponseContent}>
                {apiResponse && (
                  <pre className={styles.response}>
                    {JSON.stringify(apiResponse, null, 2)}
                  </pre>
                )}
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    </div>
  );
}
