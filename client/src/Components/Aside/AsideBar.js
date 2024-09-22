import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "../../Styles/NavFooterStyles/Aside.module.css";
import { FaFolderOpen, FaPlus, FaCogs, FaChartBar, FaTasks, FaWrench } from "react-icons/fa";
import { CiImport } from "react-icons/ci";
export default function AsideBar({ onSubMenuToggle, handleFileUpload }) {
  const [activeMenu, setActiveMenu] = useState(null);

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
        return ["Create Collection", "Manage Collections"];
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
          />
        </div>
        <div className={styles.AsideLinkWrapper}>
          <Link className={styles.LinkWrapper} onClick={() => handleMenuClick("Collection")}>
          <FaFolderOpen className={styles.AsideMenuIcon} />
            Collection
          </Link>
        </div>
        <div className={styles.AsideLinkWrapper}>
          <Link className={styles.LinkWrapper} onClick={() => handleMenuClick("Environments")}>
          <FaCogs className={styles.AsideMenuIcon} />
            Environments
          </Link>
        </div>
        <div className={styles.AsideLinkWrapper}>
          <Link className={styles.LinkWrapper} onClick={() => handleMenuClick("Build")}>
          <FaPlus className={styles.AsideMenuIcon} />
            Build
          </Link>
        </div>
        <div className={styles.AsideLinkWrapper}>
          <Link className={styles.LinkWrapper} onClick={() => handleMenuClick("Reports")}>
          <FaChartBar className={styles.AsideMenuIcon} />
            Reports
          </Link>
        </div>
        <div className={styles.AsideLinkWrapper}>
          <Link className={styles.LinkWrapper} onClick={() => handleMenuClick("Monitors")}>
          <FaTasks className={styles.AsideMenuIcon} />
            Monitors
          </Link>
        </div>
        <div className={styles.AsideLinkWrapper}>
          <Link className={styles.LinkWrapper} onClick={() => handleMenuClick("Settings")}>
          <FaWrench className={styles.AsideMenuIcon} />
            Settings
          </Link>
        </div>
      </div>
      {activeMenu && (
        <div className={`${styles.AsiseSubOption} ${activeMenu ? styles.open : ""}`}>
          {getSubmenuOptions(activeMenu).map((submenu, index) => (
            <div key={index} className={styles.SubmenuItem}>
              <p className={styles.AsideSubMenu}>{submenu}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
