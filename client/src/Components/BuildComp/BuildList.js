import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../Styles/BuildListStyles/BuildList.module.css";
export default function BuildList() {
  const [buildData, setBuildData] = useState([]);
  const [openBuilds, setOpenBuilds] = useState({}); // Track open state per build
  const navigate = useNavigate();

  useEffect(() => {
    const savedBuilds = localStorage.getItem("builds");
    if (savedBuilds) {
      const parsedBuilds = JSON.parse(savedBuilds);
      setBuildData(parsedBuilds);
    }
  }, []); // Added dependency array to prevent infinite loop

  const toggleBuild = (buildNumber) => {
    setOpenBuilds((prev) => ({
      ...prev,
      [buildNumber]: !prev[buildNumber],
    }));
  };

  const handleBuildClick = (build) => {
    navigate(`/builds/${build.buildNumber}`, {
      state: { build },
    });
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className={styles.buildsContainer}>
      {buildData.map((build) => (
        <div key={build.buildNumber} className={styles.buildContainer}>
          <div
            className={styles.buildHeader}
            onClick={() => toggleBuild(build.buildNumber)}
          >
            <div className={styles.buildInfo}>
              <span
                className={styles.buildNumber}
                onClick={(e) => {
                  e.stopPropagation();
                  handleBuildClick(build);
                }}
              >
                Build #{build.buildNumber}
              </span>
            </div>
          </div>
        </div>
      ))}

      {buildData.length === 0 && (
        <div className={styles.noBuilds}>No builds available</div>
      )}
    </div>
  );
}
