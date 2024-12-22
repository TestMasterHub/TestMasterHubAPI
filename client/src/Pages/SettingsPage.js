import React from "react";
import styles from "../Styles/PageStyles/SettingsPage.module.css";
import MainLayout from "../Layouts/MainLayout";
import JsonFileImporter from "../Utlis/JsonFileImporter";

const SettingsPage = () => {
  const clearAllData = () => {
    localStorage.removeItem("collections");
    localStorage.removeItem("environments");
    localStorage.removeItem("builds");
    alert("All data has been deleted.");
    window.location.reload(); // Refresh to reflect changes
  };

  const resetAllData = () => {
    localStorage.setItem("collections", JSON.stringify({}));
    localStorage.setItem("environments", JSON.stringify({}));
    localStorage.setItem("builds", JSON.stringify([]));
    alert("All data has been reset.");
  };

  const deleteAllEnvironmentData = () => {
    localStorage.removeItem("environments");
    alert("All environment data has been deleted.");
    window.location.reload(); // Refresh to reflect changes
  };

  const deleteAllBuildData = () => {
    localStorage.removeItem("builds");
    alert("All build data has been deleted.");
    window.location.reload(); // Refresh to reflect changes
  };

  const deleteAllCollectionData = () => {
    localStorage.removeItem("collections");
    alert("All collections data has been deleted.");
    window.location.reload(); // Refresh to reflect changes
  };

  return (
    <MainLayout handleFileUpload={JsonFileImporter}>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Settings</h2>
          </div>
          <div className={styles.cardContent}>
            <h3 className={styles.sectionTitle}>Data Management</h3>

            <button className={styles.button} onClick={clearAllData}>
              Delete All Data
            </button>
            <button className={styles.button} onClick={resetAllData}>
              Reset All Data
            </button>

            <h3 className={styles.sectionTitle}>Collection Data</h3>
            <button className={styles.button} onClick={deleteAllCollectionData}>
              Delete All Collection Data
            </button>

            <h3 className={styles.sectionTitle}>Environment Data</h3>
            <button
              className={styles.button}
              onClick={deleteAllEnvironmentData}
            >
              Delete All Environment Data
            </button>

            <h3 className={styles.sectionTitle}>Build Data</h3>
            <button className={styles.button} onClick={deleteAllBuildData}>
              Delete All Build Data
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SettingsPage;
