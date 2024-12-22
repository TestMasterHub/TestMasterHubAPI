import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import styles from "../../Styles/NavFooterStyles/Aside.module.css";
import {
  HandleCollectionStorage,
  HandleEnvironmentStorage,
} from "../../Utlis/HandleCookieStorage";
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
import EnvironmentsList from "../EnvironmentComp/EnvironmentsList";
import BuildList from "../BuildComp/BuildList";

export default function AsideBar({
  onSubMenuToggle,
  handleFileUpload,
  collections,
  Environments,
}) {
  window.TMHls = TMHls;

  const [activeMenu, setActiveMenu] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const navigate = useNavigate();

  // console.log("collection recieved at aside: ", collections[0].info);
  const handleMenuClick = (menu) => {
    const newActiveMenu = activeMenu === menu ? null : menu;
    setActiveMenu(newActiveMenu);
    if (onSubMenuToggle) {
      onSubMenuToggle(newActiveMenu !== null);
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

  const createNewEnvironment = () => {
    const newCollectionName = prompt("Enter Environment Name:");
    if (newCollectionName) {
      const newCollection = {
        id: uuidv4(),
        name: newCollectionName,
        values: [
          {
            key: "",
            value: "",
            type: "default",
            enabled: true,
          },
        ],
        _TestmasterHub_variable_scope: "environment",
        _TestmasterHub_exported_at: Date.now(),
        _TestmasterHub_exported_using: "TestmasterHub/11.22.0",
      };
      // Get existing collections
      HandleEnvironmentStorage(newCollection);

      // setCollection(newCollection);
      navigate(`/environments/${newCollectionName}`, {
        state: { collection: newCollection },
      });
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
      case "Environments":
        return (
          <div className={styles.SubMenuWrapper}>
            <p className={styles.SubmenuItem} onClick={createNewEnvironment}>
              <FaPlus className={styles.SubmenuIcon} /> Create Environment
            </p>
            <div className={styles.SubMenuCollections}>
              <h4>Existing Environments:</h4>
              <EnvironmentsList Environments={Environments} />
            </div>
          </div>
        );
      case "Build":
        return (
          <div className={styles.SubMenuWrapper}>
            <Link
              className={styles.NewBuildLink}
              to="/builds/build-configuration"
            >
              <FaWrench className={styles.SubmenuIcon} /> Build Configuration
            </Link>
            <div className={styles.SubMenuCollections}>
              <h4>Builds: </h4>
              <BuildList />
            </div>
          </div>
        );
      case "Monitors":
        return (
          <div className={styles.SubMenuWrapper}>
            <Link
              className={styles.NewBuildLink}
              to="/builds/build-configuration"
            >
              <FaWrench className={styles.SubmenuIcon} /> Settings
            </Link>
            <div className={styles.SubMenuCollections}>
              <h4>Builds: </h4>
              <BuildList />
            </div>
          </div>
        );
      // Additional cases for other menus can be added here
      default:
        return null;
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
          <Link className={styles.LinkWrapper} to={"/reports"}>
            <FaChartBar className={styles.AsideMenuIcon} />
            Reports
          </Link>
        </div>
        <div className={styles.AsideLinkWrapper}>
          <Link className={styles.LinkWrapper} to={"/monitors"}>
            <FaTasks className={styles.AsideMenuIcon} />
            Monitors
          </Link>
        </div>
        <div className={styles.AsideLinkWrapper}>
          <Link className={styles.LinkWrapper} to={"/settings"}>
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
