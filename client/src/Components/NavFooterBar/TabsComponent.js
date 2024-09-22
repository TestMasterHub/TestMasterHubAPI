import React, { useState } from "react";
import styles from '../../Styles/NavFooterStyles/TabsComponent.module.css';
import CollectionPage from "../../Pages/CollectionPage";

// Tab Button Component
const Tab = ({ label, isActive, onClick }) => (
  <button
    className={`tab-button ${isActive ? "active" : ""}`}
    onClick={onClick}
    style={{ padding: "10px", margin: "5px", cursor: "pointer" }}
  >
    {label}
  </button>
);

// Main Tabs Component
const TabsComponent = () => {
  // State to manage tabs and their data separately
  const [tabs, setTabs] = useState([{ id: 1, label: "Tab 1", data: {} }]);
  const [activeTab, setActiveTab] = useState(1);

  // Handle adding a new tab
  const handleAddNewTab = () => {
    const newTabId = tabs.length + 1;
    setTabs([...tabs, { id: newTabId, label: `Tab ${newTabId}`, data: {} }]);
    setActiveTab(newTabId); // Make the new tab active
  };

  // Handle changing the active tab
  const handleTabClick = (id) => {
    setActiveTab(id);
  };

  // Handle updating tab data when user interacts with the CollectionPage
  const handleUpdateTabData = (tabId, updatedData) => {
    setTabs((prevTabs) =>
      prevTabs.map((tab) =>
        tab.id === tabId ? { ...tab, data: updatedData } : tab
      )
    );
  };

  // Get the data for the currently active tab
  const activeTabData = tabs.find((tab) => tab.id === activeTab)?.data;

  return (
    <div>
      <div className={styles.tabs_container} style={{ display: "flex" }}>
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            label={tab.label}
            isActive={tab.id === activeTab}
            onClick={() => handleTabClick(tab.id)}
          />
        ))}
        <button
          onClick={handleAddNewTab}
          style={{ padding: "10px", margin: "5px" }}
        >
          + Add New Tab
        </button>
      </div>

      {/* Content for the active tab */}
      <div className={styles.tab_content} style={{ marginTop: "20px" }}>
        <CollectionPage
          key={activeTab} // Ensure a new instance is created per tab
          tabData={activeTabData} // Pass tab-specific data as props
          updateTabData={(updatedData) => handleUpdateTabData(activeTab, updatedData)} // Function to update tab-specific data
        />
      </div>
    </div>
  );
};

export default TabsComponent;
