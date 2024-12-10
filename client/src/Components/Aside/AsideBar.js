import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../Styles/NavFooterStyles/Aside.module.css";
import HandleCollectionStorage from "../../Utlis/HandleCollectionStorage";
import { generateCollectionJson } from "../../Utlis/generateCollectionJson";
import {
  FaFolderOpen,
  FaPlus,
  FaCogs,
  FaChartBar,
  FaTasks,
  FaWrench,
} from "react-icons/fa";
import { CiImport } from "react-icons/ci";
import TMHls from "../../Utlis/TMH";
import CollectionList from "../CollectionComp/CollectionList";

export default function AsideBar({
  onSubMenuToggle,
  handleFileUpload,
  collections, // Use collections from props
  onRequestClick,
  handleAddCollection,
}) {
  window.TMHls = TMHls;

  const [activeMenu, setActiveMenu] = useState(null);
  // const [collection, setCollection] = useState(null);

  const navigate = useNavigate();

  // console.log("collection recieved at aside: ", collections[0].info);
  const handleMenuClick = (menu) => {
    const newActiveMenu = activeMenu === menu ? null : menu;
    setActiveMenu(newActiveMenu);
    if (onSubMenuToggle) {
      onSubMenuToggle(newActiveMenu !== null);
    }
  };

  const getSubmenuOptions = (menu) => {
    switch (menu) {
      case "Collection":
        return (
          <div className={styles.SubMenuWrapper}>
            <p className={styles.SubmenuItem} onClick={createNewCollection}>
              <FaPlus className={styles.SubmenuIcon} /> Create Collection
            </p>
            <div className={styles.SubMenuCollections}>
              <h4>Existing Collections:</h4>
              <CollectionList collections={collections} />
            </div>
          </div>
        );
      // Additional cases for other menus can be added here
      default:
        return null;
    }
  };
  const createNewCollection = () => {
    const newCollectionName = prompt("Enter Collection Name:");
    if (newCollectionName) {
      const newCollection = generateCollectionJson(newCollectionName);
      // Get existing collections
      HandleCollectionStorage(newCollection);

      // setCollection(newCollection);
      navigate(`/collections/${newCollectionName}`, {
        state: { collection: newCollection },
      });
    }
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
        <div className={styles.AsideLinkWrapper}>
          <Link
            className={styles.LinkWrapper}
            onClick={() => handleMenuClick("Collection")}
          >
            <FaFolderOpen className={styles.AsideMenuIcon} />
            Collection
          </Link>
        </div>
        <div className={styles.AsideLinkWrapper}>
          <Link
            className={styles.LinkWrapper}
            onClick={() => handleMenuClick("Environments")}
          >
            <FaCogs className={styles.AsideMenuIcon} />
            Environments
          </Link>
        </div>
        <div className={styles.AsideLinkWrapper}>
          <Link
            className={styles.LinkWrapper}
            onClick={() => handleMenuClick("Build")}
          >
            <FaPlus className={styles.AsideMenuIcon} />
            Build
          </Link>
        </div>
        <div className={styles.AsideLinkWrapper}>
          <Link
            className={styles.LinkWrapper}
            onClick={() => handleMenuClick("Reports")}
          >
            <FaChartBar className={styles.AsideMenuIcon} />
            Reports
          </Link>
        </div>
        <div className={styles.AsideLinkWrapper}>
          <Link
            className={styles.LinkWrapper}
            onClick={() => handleMenuClick("Monitors")}
          >
            <FaTasks className={styles.AsideMenuIcon} />
            Monitors
          </Link>
        </div>
        <div className={styles.AsideLinkWrapper}>
          <Link
            className={styles.LinkWrapper}
            onClick={() => handleMenuClick("Settings")}
          >
            <FaWrench className={styles.AsideMenuIcon} />
            Settings
          </Link>
        </div>
      </div>

      {activeMenu && (
        <div className={`${styles.AsideSubOption} ${styles.open}`}>
          {getSubmenuOptions(activeMenu)}
        </div>
      )}
    </div>
  );
}
