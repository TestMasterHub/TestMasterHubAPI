import Navbar from ".././Components/NavFooterBar/NavBar";
import AsideBar from "../Components/Aside/AsideBar";
import styles from "../Styles/PageLayouts/Layout.module.css";
function MainLayout({ children }) {
  return (
    <div className={styles.LayoutMainWrapper}>
      <div className={styles.LayoutInnerWrapper}>
        <div className={styles.LayoutNavBarrWrapper}>
          <Navbar />
        </div>
        <div className={styles.LayoutAsideWrapper}>
          <AsideBar />
        </div>
        <div className={styles.LayoutContentWrapper}>{children}</div>
        <div className={styles.LayoutFooterWrapper}>
        </div>
      </div>
    </div>
  );
}

export default MainLayout;
