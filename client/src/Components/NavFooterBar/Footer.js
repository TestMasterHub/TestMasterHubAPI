import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../../Styles/NavFooterStyles/Footer.module.css";
import { VscDebugConsole } from "react-icons/vsc";
import { RiBaseStationLine } from "react-icons/ri";
function Footer() {
  const [proxyStatus, setProxyStatus] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProxyStatus = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/proxystatus"
        );
        setProxyStatus(response.data);
      } catch (error) {
        console.error("Error fetching proxy status:", error);
        setError("Failed to fetch proxy status");
      }
    };

    fetchProxyStatus();
  }, []);

  const openConsole = () => {
    window.consoleWindow = window.open(
      "/console",
      "_blank",
      "width=800,height=600"
    );
  };
  return (
    <div className={styles.FooterMainWrapper}>
      <p className={styles.FproxyStatud}>
        {<RiBaseStationLine className={styles.FStatusIcon}/>}
        {proxyStatus ? proxyStatus.message : "Offline"}
      </p>
      <div className={styles.FConsolePage}>
        <VscDebugConsole className={styles.FConsoleIcon} />
        <button className={styles.FConsolePagebtn} onClick={openConsole}>
          Console
        </button>
      </div>
    </div>
  );
}

export default Footer;
