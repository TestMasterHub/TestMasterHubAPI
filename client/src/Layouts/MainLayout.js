import React, { useState, useEffect } from "react";
import Navbar from "../Components/NavFooterBar/NavBar";
import AsideBar from "../Components/Aside/AsideBar";
import Footer from "../Components/NavFooterBar/Footer";
import styles from "../Styles/PageLayouts/Layout.module.css";

function MainLayout({ children, handleFileUpload, handleRequestClick }) {
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false); // Fixed syntax
  const [collections, setCollections] = useState([]);

  // Load collections from LocalDB when the component mounts
  useEffect(() => {
    const savedCollections = localStorage.getItem("collections");
    setCollections(savedCollections ? JSON.parse(savedCollections) : []); // Parse JSON or set empty array if not found
  }, []);
  // Callback function to add a new collection
  const handleAddCollection = (newCollection) => {
    const updatedCollections = [...collections, newCollection];
    setCollections(updatedCollections);
    localStorage.setItem("collections", JSON.stringify(updatedCollections)); // Persist to LocalDB with JSON.stringify
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
            onRequestClick={handleRequestClick}
            handleAddCollection={handleAddCollection}
          />
        </div>
        <div className={styles.LayoutContentWrapper}>
          {/* Pass collections to children */}
          {React.cloneElement(children, {
            collections,
            handleAddCollection,
          })}
        </div>
        <div className={styles.LayoutFooterWrapper}>
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default MainLayout;
