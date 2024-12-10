import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MainLayout from "../Layouts/MainLayout";
import styles from "../Styles/PageStyles/CollectionPage.module.css";
import LocalDB from "../Utlis/LocalDB";
import { v4 as uuidv4 } from "uuid";
import HandleCollectionStorage from "../Utlis/HandleCollectionStorage";
import { generateCollectionJson } from "../Utlis/generateCollectionJson";
function CollectionPage({ handleFileUpload }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [collection, setCollection] = useState(null);
  const [activeTab, setActiveTab] = useState("Overview");

  useEffect(() => {
    const currentCollection = location.state?.collection;
    if (currentCollection) {
      setCollection(currentCollection);
    } else {
      const collectionName = location.pathname.split("/").pop();
      const collections = LocalDB.get("collections") || [];
      const foundCollection = collections.find(
        (c) => c.info && c.info.name === collectionName
      );
      setCollection(foundCollection || null);
    }
  }, [location]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleRequestClick = (request) => {
    if (collection && collection.info && collection.info.name) {
      navigate(`/collections/${collection.info.name}/request/${request.id}`, {
        state: { request, collectionId: collection.id },
      });
    } else {
      console.error("Collection or collection info is undefined");
    }
  };

  const createNewCollection = () => {
    const newCollectionName = prompt("Enter Collection Name:");
    if (newCollectionName) {
      const newCollection = generateCollectionJson(newCollectionName);
      // Get existing collections
      HandleCollectionStorage(newCollection);

      setCollection(newCollection);
      navigate(`/collections/${newCollectionName}`, {
        state: { collection: newCollection },
      });
    }
  };

  const handleAddRequest = () => {
    if (!collection?.info?.name) {
      alert("Please create or select a valid collection first.");
      return;
    }

    const newRequestName = prompt("Enter Request Name:");
    if (!newRequestName) return;

    const newRequest = {
      id: uuidv4(),
      name: newRequestName,
      data: {
        apiResponse: null,
        authToken: "",
        authType: "Bearer",
        basicAuth: { username: "", password: "" },
        headers: {
          "Accept-Encoding": "gzip, deflate, br",
          "User-Agent": "TestMasterHub/1.0 (Windows NT 10.0; Win64; x64)",
          Accept: "application/json",
          Connection: "keep-alive",
        },
        isLoading: false,
        pathParams: [{ description: "", key: "", value: "" }],
        preRequestScript: "",
        queryParams: [{ description: "", key: "", value: "" }],
        requestBody: "",
        requestType: "get",
        statusCode: null,
        testScript: "",
        url: "",
        urlError: false,
      },
    };

    console.log("Adding new request:", newRequest);

    const collections = JSON.parse(localStorage.getItem("collections")) || {};
    const collectionKey = Object.keys(collections).find(
      (key) => collections[key].info?.name === collection.info.name
    );

    if (collectionKey) {
      const updatedCollection = {
        ...collections[collectionKey],
        item: [...(collections[collectionKey].item || []), newRequest],
      };

      collections[collectionKey] = updatedCollection;
      console.log("Updated collection inside handleaddrequest:", collection);
      localStorage.setItem("collections", JSON.stringify(collections));

      // Save new request to localStorage for tabs
      const savedTabs = JSON.parse(localStorage.getItem("savedTabs")) || [];
      const updatedTabs = [...savedTabs, { id: newRequest.id, ...newRequest }];
      localStorage.setItem("savedTabs", JSON.stringify(updatedTabs));
      localStorage.setItem("activeTabId", newRequest.id);
      localStorage.setItem("newRequest", newRequest);
      // Navigate to RequestEditorPage
      navigate(
        `/collections/${collection.info.name}/request/${newRequest.id}`,
        {
          state: { request: newRequest },
        }
      );
    } else {
      alert("Failed to find the collection. Please try again.");
    }
  };

  return (
    <MainLayout handleFileUpload={handleFileUpload}>
      <div className={styles.collectionPage}>
        <div className={styles.mainContent}>
          <header className={styles.header}>
            <h1>
              {collection && collection.info
                ? collection.info.name
                : "No Collection Selected"}
            </h1>
            <div className={styles.tabs}>
              {[
                "Overview",
                "Authorization",
                "Scripts",
                "Variables",
                "Runs",
              ].map((tab) => (
                <button
                  key={tab}
                  className={activeTab === tab ? styles.activeTab : ""}
                  onClick={() => handleTabClick(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </header>
          {!collection ? (
            <div className={styles.noCollection}>
              <p>No collection found. Please create a new collection.</p>
              <button
                onClick={createNewCollection}
                className={styles.createButton}
              >
                Create Collection
              </button>
            </div>
          ) : (
            <div className={styles.collectionContent}>
              <button
                onClick={handleAddRequest}
                className={styles.addRequestButton}
              >
                Add a request
              </button>
              {activeTab === "Overview" && (
                <div className={styles.overviewContent}>
                  <p>{collection.description}</p>
                  <div className={styles.templates}>
                    <h3>Top templates for you</h3>
                    <div className={styles.templateCards}>
                      <div className={styles.templateCard}>REST API basics</div>
                      <div className={styles.templateCard}>
                        End-to-end testing
                      </div>
                      <div className={styles.templateCard}>
                        Functional testing
                      </div>
                      <div className={styles.templateCard}>
                        Integration testing
                      </div>
                    </div>
                  </div>
                  <div className={styles.requestsList}>
                    <h3>Requests in this collection:</h3>
                    {collection.item && collection.item.length > 0 ? (
                      collection.item.map((request, index) => (
                        <div key={index} className={styles.requestItem}>
                          <p onClick={() => handleRequestClick(request)}>
                            {request.name}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p>No requests in this collection</p>
                    )}
                  </div>
                </div>
              )}
              {activeTab !== "Overview" && (
                <p>{activeTab} content is under construction...</p>
              )}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default CollectionPage;
