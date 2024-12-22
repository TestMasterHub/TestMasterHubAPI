import React, { useState, useEffect } from "react";
import styles from "../Styles/PageStyles/ReportsPage.module.css";
import Mainlayout from "../Layouts/MainLayout";
import JsonFileImporter from "../Utlis/JsonFileImporter";

const ReportsPage = () => {
  const [builds, setBuilds] = useState([]);

  // Load the reports (builds) from localStorage when the component is mounted
  useEffect(() => {
    const savedBuilds = JSON.parse(
      localStorage.getItem("buildReports") || "[]"
    );
    setBuilds(savedBuilds);
  }, []); // Empty dependency array ensures this only runs once on initial render

  // Function to generate HTML report
  const generateHTMLReport = (build) => {
    const { collectionName, totalRequests, requests, collectionTime } = build;

    let reportHTML = `
      <html>
        <head>
          <title>${collectionName} - Build Report</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
            h1 { text-align: center; color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px 12px; text-align: left; }
            th { background-color: #f2f2f2; }
            .summary { margin-top: 20px; font-size: 16px; }
            .summary span { font-weight: bold; 
            .response { max-width: 300px; overflow: auto; }
          </style>
        </head>
        <body>
        <h1>TestMasterHub - Report</h1>
          <h1>${collectionName} - Summary</h1>
          <div class="summary">
            <p><span>Total Requests:</span> ${totalRequests}</p>
            <p><span>Total Collection Time:</span> ${collectionTime} ms</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Request Name</th>
                <th>URL</th>
                <th>Response</th>
                <th>Request Time (ms)</th>
              </tr>
            </thead>
            <tbody>
              ${requests
                .map(
                  (request) => ` 
                    <tr>
                      <td>${request.name}</td>
                      <td>${request.url}</td>
                      <td class="response">${JSON.stringify(
                        request.response
                      )}</td>
                      <td>${request.runTime}</td>
                    </tr>`
                )
                .join("")}
            </tbody>
          </table>
        </body>
      </html>
    `;

    return reportHTML;
  };

  // Function to download the report
  const downloadReport = (build) => {
    const reportHTML = generateHTMLReport(build);
    const blob = new Blob([reportHTML], { type: "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${build.collectionName}_Build_Report_${build.buildNumber}.html`;
    link.click();
  };

  return (
    <Mainlayout handleFileUpload={JsonFileImporter}>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Build Reports</h2>
          </div>
          <div className={styles.cardContent}>
            <h3 className={styles.sectionTitle}>List of Reports</h3>
            <div className={styles.reportsList}>
              {builds.length > 0 ? (
                builds.map((build) => (
                  <div key={build.buildNumber} className={styles.reportItem}>
                    <span>{`Build #${build.buildNumber} - ${build.collectionName}`}</span>
                    <button
                      onClick={() => downloadReport(build)}
                      className={styles.downloadButton}
                    >
                      &#8595; Download Report
                    </button>
                  </div>
                ))
              ) : (
                <p>No reports available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Mainlayout>
  );
};

export default ReportsPage;
