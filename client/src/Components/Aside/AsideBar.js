import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../Styles/NavFooterStyles/Aside.module.css";
import {
  FaFolderOpen,
  FaPlus,
  FaCogs,
  FaChartBar,
  FaTasks,
  FaWrench,
} from "react-icons/fa";
import { CiImport } from "react-icons/ci";
import TMHls from "../../Utlis/LocalDB";

export default function AsideBar({
  onSubMenuToggle,
  handleFileUpload,
  collections,
  onRequestClick,
}) {
  window.TMHls = TMHls;
  //Feature flag to control the aside menu options
  const Aside_Feature_Flag = false;

  const [activeMenu, setActiveMenu] = useState(null);
  const navigate = useNavigate();
  // Handle menu click to show the submenu
  const handleMenuClick = (menu) => {
    const newActiveMenu = activeMenu === menu ? null : menu;
    setActiveMenu(newActiveMenu);

    // Notify the parent component about submenu state change
    if (onSubMenuToggle) {
      onSubMenuToggle(newActiveMenu !== null);
    }
  };

  // Define submenu options for each menu
  const getSubmenuOptions = (menu) => {
    switch (menu) {
      case "Collection":
        return (
          <div className={styles.SubMenuWrapper}>
            <p
              className={styles.SubmenuItem}
              onClick={() => createNewCollection()}
            >
              <FaPlus className={styles.SubmenuIcon} /> Create Collection
            </p>
            <div className={styles.SubMenuCollections}>
              <h4>Existing Collections:</h4>
              {collections && collections.length > 0 ? (
                collections.map((collection, index) => (
                  <div key={index} className={styles.CollectionItem}>
                    <p onClick={() => handleCollectionClick(collection.id)}>
                      {collection.name}
                    </p>
                    {collection.requests && collection.requests.length > 0 ? (
                      collection.requests.map((request, idx) => (
                        <div key={idx} className={styles.RequestItem}>
                          <p onClick={() => onRequestClick(request)}>
                            {request.name}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p>No requests found in this collection</p>
                    )}
                  </div>
                ))
              ) : (
                <p>No collections available</p>
              )}
            </div>
          </div>
        );
      case "Environments":
        return ["Manage Environments", "Add Environment"];
      case "Build":
        return ["Build API", "API Documentation"];
      case "Reports":
        return ["View Reports", "Generate Report"];
      case "Monitors":
        return ["Manage Monitors", "Create Monitor"];
      case "Settings":
        return ["General Settings", "Profile Settings"];
      default:
        return [];
    }
  };

  // Handle creating a new collection
  const createNewCollection = () => {
    const newCollection = prompt("Enter Collection Name:");
    if (newCollection) {
      TMHls.set("collectionname", newCollection);
      navigate(`/collections/${newCollection}`);
    }
  };

  // Handle clicking on an individual collection
  const handleCollectionClick = (collectionId) => {
    console.log("Load Collection:", collectionId);
    // Logic to load the collection based on ID
  };

  return (
    <div className={styles.AsideMainWrapper}>
      <div className={styles.OptionWrapper}>
        <div className={styles.AsideLinkWrapper}>
          <label htmlFor="fileInput" className={styles.AsideFileLabel}>
            <CiImport className={styles.AsideMenuIcon} />
            Import
          </label>
          <input
            type="file"
            id="fileInput"
            onChange={handleFileUpload}
            className={styles.AsideFileUploadField}
            accept=".json"
          />
        </div>
        {Aside_Feature_Flag && (
          <div className={styles.AsideLinkWrapper}>
            <Link
              className={styles.LinkWrapper}
              onClick={() => handleMenuClick("Collection")}
            >
              <FaFolderOpen className={styles.AsideMenuIcon} />
              Collection
            </Link>
          </div>
        )}
        {Aside_Feature_Flag && (
          <div className={styles.AsideLinkWrapper}>
            <Link
              className={styles.LinkWrapper}
              onClick={() => handleMenuClick("Environments")}
            >
              <FaCogs className={styles.AsideMenuIcon} />
              Environments
            </Link>
          </div>
        )}
        {Aside_Feature_Flag && (
          <div className={styles.AsideLinkWrapper}>
            <Link
              className={styles.LinkWrapper}
              onClick={() => handleMenuClick("Build")}
            >
              <FaPlus className={styles.AsideMenuIcon} />
              Build
            </Link>
          </div>
        )}
        {Aside_Feature_Flag && (
          <div className={styles.AsideLinkWrapper}>
            <Link
              className={styles.LinkWrapper}
              onClick={() => handleMenuClick("Reports")}
            >
              <FaChartBar className={styles.AsideMenuIcon} />
              Reports
            </Link>
          </div>
        )}
        {Aside_Feature_Flag && (
          <div className={styles.AsideLinkWrapper}>
            <Link
              className={styles.LinkWrapper}
              onClick={() => handleMenuClick("Monitors")}
            >
              <FaTasks className={styles.AsideMenuIcon} />
              Monitors
            </Link>
          </div>
        )}
        {Aside_Feature_Flag && (
          <div className={styles.AsideLinkWrapper}>
            <Link
              className={styles.LinkWrapper}
              onClick={() => handleMenuClick("Settings")}
            >
              <FaWrench className={styles.AsideMenuIcon} />
              Settings
            </Link>
          </div>
        )}
      </div>

      {activeMenu && (
        <div
          className={`${styles.AsiseSubOption} ${
            activeMenu ? styles.open : ""
          }`}
        >
          {getSubmenuOptions(activeMenu)}
        </div>
      )}
    </div>
  );
}
