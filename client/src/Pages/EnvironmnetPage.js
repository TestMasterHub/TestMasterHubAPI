import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Mainlayout from "../Layouts/MainLayout";
import { v4 as uuidv4 } from "uuid";
import JsonFileImporter from "../Utlis/JsonFileImporter";
import Styles from "../Styles/PageStyles/EnvironmentPage.module.css";
const EnvironmentPage = () => {
  const location = useLocation();
  const navigatedEnvironment = location.state?.environment; // Retrieve the environment from navigation state

  const initialData = {
    id: uuidv4(),
    name: `environment${Date.now()}`,
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

  const [environmentVariables, setEnvironmentVariables] = useState(
    navigatedEnvironment ? [navigatedEnvironment] : [initialData]
  );
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (navigatedEnvironment) {
      setEnvironmentVariables([navigatedEnvironment]);
    } else {
      const storedEnvironments = localStorage.getItem("environments");
      if (storedEnvironments) {
        try {
          const parsedEnvironments = JSON.parse(storedEnvironments);
          setEnvironmentVariables(Object.values(parsedEnvironments));
        } catch (error) {
          console.error("Failed to parse stored environments:", error);
        }
      }
    }
  }, [navigatedEnvironment]);

  const updateLocalStorage = (updatedVariables) => {
    const environmentsObject = { 0: updatedVariables[0] };
    localStorage.setItem("environments", JSON.stringify(environmentsObject));
  };

  const handleInputChange = (index, field, value) => {
    const updatedVariables = [...environmentVariables];
    updatedVariables[0].values[index][field] = value;

    if (
      field === "key" &&
      value.trim() !== "" &&
      index === updatedVariables[0].values.length - 1
    ) {
      // Add a new empty row if user enters a key in the last row
      updatedVariables[0].values.push({
        key: "",
        value: "",
        type: "default",
        enabled: true,
      });
    }

    setEnvironmentVariables(updatedVariables);
    updateLocalStorage(updatedVariables);
  };

  const handleExport = () => {
    const json = JSON.stringify(environmentVariables[0], null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "environment.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredVariables =
    environmentVariables[0]?.values.filter(
      (variable) =>
        variable.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
        variable.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (variable.value &&
          variable.value.toLowerCase().includes(searchQuery.toLowerCase()))
    ) || [];

  return (
    <Mainlayout handleFileUpload={JsonFileImporter}>
      <div className={Styles.container}>
        <h3 className={Styles.title}>{environmentVariables[0].name}</h3>
        <div className={Styles.searchSection}>
          <input
            type="text"
            placeholder="Search variables"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={Styles.searchInput}
          />
          <button onClick={handleExport} className={Styles.exportButton}>
            Export
          </button>
          <button
            onClick={() => setEnvironmentVariables([initialData])}
            className={Styles.clearButton}
          >
            Clear Data
          </button>
        </div>
        <div className={Styles.tableContainer}>
          <table className={Styles.table}>
            <thead>
              <tr>
                <th className={Styles.tableHeader}>Variable</th>
                <th className={Styles.tableHeader}>Type</th>
                <th className={Styles.tableHeader}>Value</th>
              </tr>
            </thead>
            <tbody>
              {filteredVariables.map((variable, index) => (
                <tr key={index} className={Styles.tableRow}>
                  <td className={Styles.tableCell}>
                    <input
                      type="text"
                      className={Styles.inputField}
                      value={variable.key}
                      onChange={(e) =>
                        handleInputChange(index, "key", e.target.value)
                      }
                    />
                  </td>
                  <td className={Styles.tableCell}>
                    <select
                      className={Styles.selectField}
                      value={variable.type}
                      onChange={(e) =>
                        handleInputChange(index, "type", e.target.value)
                      }
                    >
                      <option value="default">Default</option>
                      <option value="custom">Custom</option>
                    </select>
                  </td>
                  <td className={Styles.tableCell}>
                    <input
                      type="text"
                      className={Styles.inputField}
                      value={variable.value}
                      onChange={(e) =>
                        handleInputChange(index, "value", e.target.value)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Mainlayout>
  );
};

export default EnvironmentPage;
