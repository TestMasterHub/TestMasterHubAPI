import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../Styles/CollectioListStyles/collectionList.css";
import { generateCollectionJson } from "../../Utlis/generateCollectionJson";
const CollectionList = ({ collections }) => {
  const [currentCollections, setCurrentCollections] = useState(collections);
  const [openCollections, setOpenCollections] = useState({}); // Track open state per collection
  const [activeDropdown, setActiveDropdown] = useState(null); // Track active dropdown
  const navigate = useNavigate();
  useEffect(() => {
    // Fetch updated collections from LocalDB
    const updatedCollections =
      JSON.parse(localStorage.getItem("collections")) || {};
    setCurrentCollections(updatedCollections);
  }, [collections]);

  // Toggle collection visibility
  const toggleCollection = (id) => {
    setOpenCollections((prev) => ({
      ...prev,
      [id]: !prev[id], // Toggle visibility for the specific collection
    }));
  };

  const handleNameClick = (index) => {
    const collectionKeys = Object.keys(currentCollections);
    const collectionKey = collectionKeys[index];
    const collection = currentCollections[collectionKey];

    if (collection) {
      navigate(`/collections/${collection.info.name}`, {
        state: { collection },
      });
    }
  };

  const handleRequestClick = (request, collection) => {
    if (!request || !collection) {
      console.error("Missing request or collection data");
      return;
    }

    const collectionName = collection.info?.name;
    const requestId = request.id || request.name;

    if (!collectionName || !requestId) {
      console.error("Missing required navigation data:", {
        collectionName,
        requestId,
      });
      return;
    }

    navigate(`/collections/${collectionName}/request/${requestId}`, {
      state: {
        request,
        collectionId: collection.info.id,
      },
    });
  };

  // const handleExport = (collection) => {
  //   const collectionJson = JSON.stringify(collection, null, 2);
  //   const blob = new Blob([collectionJson], { type: "application/json" });
  //   const link = document.createElement("a");
  //   link.href = URL.createObjectURL(blob);
  //   link.download = `${collection.info.name}.json`;
  //   link.click();
  //   URL.revokeObjectURL(link.href);
  // };

  const handleExportBtn = (collection) => {
    alert("export button clicked: " + collection);
    // Add null/undefined check for collection
    if (!collection || !collection.item) {
      console.error("Invalid collection or missing items");
      return;
    }

    const collectionItems = collection.item.map((item) => {
      if (!item) return null;

      // Provide default values and add more robust checks
      const authType = (item.authType || "").toLowerCase();
      const requestType = (item.requestType || "GET").toUpperCase();

      return {
        id: item.id,
        name: item.name || `Request ${collection.id}`,
        event: [
          {
            listen: "prerequest",
            script: {
              type: "text/javascript",
              exec: [item.preRequestScript || ""],
            },
          },
          {
            listen: "test",
            script: {
              type: "text/javascript",
              exec: [item.testScript || ""],
            },
          },
        ],
        request: {
          auth: {
            type: authType || "bearer",
            ...(authType === "bearer"
              ? {
                  bearer: [
                    {
                      key: "token",
                      value: item.authToken || "",
                      type: "string",
                    },
                  ],
                }
              : {
                  basic: [
                    {
                      key: "username",
                      value: item.basicAuth?.username || "",
                      type: "string",
                    },
                    {
                      key: "password",
                      value: item.basicAuth?.password || "",
                      type: "string",
                    },
                  ],
                }),
          },
          method: requestType,
          header: Object.entries(item.headers || {}).map(([key, value]) => ({
            key,
            value,
          })),
          body: {
            mode: "raw",
            raw: item.requestBody || "",
            options: {
              raw: {
                language: "json",
              },
            },
          },
          url: {
            raw: item.url || "",
            protocol: (item.url || "").split("://")[0] || "",
            host:
              (item.url || "").split("://")[1]?.split("/")[0]?.split(".") || [],
            path: (item.url || "").split("://")[1]?.split("/")?.slice(1) || [],
            query: (item.queryParams || []).map((param) => ({
              key: param.key,
              value: param.value,
            })),
            variable: (item.pathParams || []).map((param) => ({
              key: param.key,
              value: param.value,
              description: param.description || "",
            })),
          },
        },
      };
    });

    // Remove invalid entries
    const validCollectionItems = generateCollectionJson(
      collection.info?.name || "Unnamed Collection",
      collectionItems.filter(Boolean)
    );

    // Convert to JSON and trigger download
    try {
      const collectionJson = JSON.stringify(validCollectionItems, null, 2);
      const blob = new Blob([collectionJson], { type: "application/json" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${collection.info?.name || "collection"}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Error exporting collection:", error);
    }
  };

  const handleDelete = (collectionId) => {
    const storedCollections =
      JSON.parse(localStorage.getItem("collections")) || {};
    const updatedCollections = Object.fromEntries(
      Object.entries(storedCollections).filter(
        ([key, collection]) =>
          collection.info._testmasterhub_id !== collectionId
      )
    );

    // Save updated collections back to localStorage
    localStorage.setItem("collections", JSON.stringify(updatedCollections));
    window.location.reload();
  };

  const toggleDropdown = (id) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  // If there are no collections, show a message
  if (!collections) {
    return <div className="p-4 text-gray-500">No collections available</div>;
  }

  return (
    <div className="CollectionList">
      {Object.entries(currentCollections).map(([index, collection]) => (
        <div key={index} className="collection-container">
          {/* Collection Header */}
          <div
            className="collection-header"
            onClick={() => toggleCollection(collection.info._testmasterhub_id)} // Toggle individual collection
          >
            <span className="dropdown-icon">
              {openCollections[collection.info._testmasterhub_id] ? "▾" : "▸"}
            </span>
            <span
              className="collection-name"
              onClick={(e) => {
                e.stopPropagation(); // Prevent toggle on collection name click
                handleNameClick(collection.info._testmasterhub_id);
              }}
            >
              {collection.info.name}
            </span>
            <button
              className="three-dot-menu"
              onClick={(e) => {
                e.stopPropagation();
                toggleDropdown(collection.info._testmasterhub_id);
              }}
            >
              ⋮
            </button>
          </div>

          {/* Dropdown Menu */}
          {activeDropdown === collection.info._testmasterhub_id && (
            <div className="dropdown-menu">
              <button
                className="dropdown-item"
                onClick={() => handleExportBtn(collection)}
              >
                Export
              </button>
              <button
                className="dropdown-item"
                onClick={() => handleDelete(collection.info._testmasterhub_id)}
              >
                Delete
              </button>
            </div>
          )}

          {/* Requests Container */}
          {openCollections[collection.info._testmasterhub_id] && (
            <div className="requests-container">
              {collection.item && collection.item.length > 0 ? (
                collection.item.flat().map((item) => (
                  <div key={item.id} className="request-header">
                    <span className="method-label">
                      {item.request?.method || "GET"}
                    </span>
                    <span
                      className="request-name"
                      onClick={() => handleRequestClick(item, collection)}
                    >
                      {item.name}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 ml-4">
                  No requests in this collection
                </p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CollectionList;
