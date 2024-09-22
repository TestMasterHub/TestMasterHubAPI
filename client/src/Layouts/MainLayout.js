import React, { useState } from "react";
import Navbar from ".././Components/NavFooterBar/NavBar";
import AsideBar from "../Components/Aside/AsideBar";
import Footer from "../Components/NavFooterBar/Footer";
import styles from "../Styles/PageLayouts/Layout.module.css";
function MainLayout({ children ,handleFileUpload}) {
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);

  // This callback will be passed to AsideBar to handle submenu toggle
  const handleSubMenuToggle = (isOpen) => {
    setIsSubmenuOpen(isOpen);
  };

  return (
    <div className={`${styles.LayoutMainWrapper} ${isSubmenuOpen ? styles.submenuOpen : ""}`}>
      <div className={styles.LayoutInnerWrapper}>
        <div className={styles.LayoutNavBarrWrapper}>
          <Navbar />
        </div>
        <div className={styles.LayoutAsideWrapper}>
          <AsideBar onSubMenuToggle={handleSubMenuToggle} handleFileUpload={handleFileUpload}/> {/* Passing the callback */}
        </div>
        <div className={styles.LayoutContentWrapper}>{children}</div>
        <div className={styles.LayoutFooterWrapper}>
        <Footer />
        </div>
      </div>
    </div>
  );
}

export default MainLayout;
