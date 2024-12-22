import React, { useState, useEffect } from "react";
import Navbar from "../Components/NavFooterBar/NavBar";
import AsideBar from "../Components/Aside/AsideBar";
import Footer from "../Components/NavFooterBar/Footer";
import styles from "../Styles/PageLayouts/Layout.module.css";

const MainLayout = ({ children, handleFileUpload, handleRequestClick }) => {
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
  const [collections, setCollections] = useState({}); // Changed to object to match BuildPage
  const [environments, setEnvironments] = useState({}); // Changed to object and fixed capitalization

  // Load collections from LocalDB when the component mounts
  useEffect(() => {
    const savedCollections = localStorage.getItem("collections");
    const savedEnvironments = localStorage.getItem("environments");
    setCollections(savedCollections ? JSON.parse(savedCollections) : {}); // Changed to empty object
    setEnvironments(savedEnvironments ? JSON.parse(savedEnvironments) : {}); // Changed to empty object
  }, []);

  // Callback function to add a new collection
  const handleAddCollection = (newCollection) => {
    const updatedCollections = {
      ...collections,
      [newCollection.id]: newCollection, // Assuming each collection has an id
    };
    setCollections(updatedCollections);
    localStorage.setItem("collections", JSON.stringify(updatedCollections));
  };

  // This callback will be passed to AsideBar to handle submenu toggle
  const handleSubMenuToggle = (isOpen) => {
    setIsSubmenuOpen(isOpen);
  };

  return (
    <div
      className={`${styles.LayoutMainWrapper} ${
        isSubmenuOpen ? styles.submenuOpen : ""
      }`}
    >
      <div className={styles.LayoutInnerWrapper}>
        <div className={styles.LayoutNavBarrWrapper}>
          <Navbar />
        </div>
        <div className={styles.LayoutAsideWrapper}>
          <AsideBar
            onSubMenuToggle={handleSubMenuToggle}
            handleFileUpload={handleFileUpload}
            collections={collections}
            environments={environments} // Fixed capitalization
            onRequestClick={handleRequestClick}
            handleAddCollection={handleAddCollection}
          />
        </div>
        <div className={styles.LayoutContentWrapper}>
          {children}{" "}
          {/* Removed cloneElement since we're passing props through context or props */}
        </div>
        <div className={styles.LayoutFooterWrapper}>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
