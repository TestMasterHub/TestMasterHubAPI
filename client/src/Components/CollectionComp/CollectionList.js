import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../Styles/CollectioListStyles/collectionList.css";

const CollectionList = ({ collections }) => {
  const [currentCollections, setCurrentCollections] = useState(collections);
  const [openCollections, setOpenCollections] = useState({}); // Track open state per collection
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
    const requestId = request.id;

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

  // If there are no collections, show a message
  if (!collections) {
    return <div className="p-4 text-gray-500">No collections available</div>;
  }

  return (
    <div className="CollectionList">
      {Object.entries(collections).map(([index, collection]) => (
        <div
          key={collection.info._testmasterhub_id}
          className="collection-container"
        >
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
                handleNameClick(index);
              }}
            >
              {collection.info.name}
            </span>
          </div>

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
