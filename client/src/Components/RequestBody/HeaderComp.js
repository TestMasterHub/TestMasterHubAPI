import React, { useState, useEffect } from "react";
import styles from "../../Styles/RequestBody/HeaderComp.module.css";

export default function HeaderComp({ headers, setHeaders }) {
  const [rows, setRows] = useState([
    { key: "Accept-Encoding", value: "gzip, deflate, br", description: "", checked: true, disabled: true },
    { key: "User-Agent", value: "TestMasterHub/1.0 (Windows NT 10.0; Win64; x64)", description: "", checked: true, disabled: true },
    { key: "Accept", value: "application/json", description: "", checked: true, disabled: true },
    { key: "Connection", value: "keep-alive", description: "", checked: true, disabled: true }
  ]);

  const maxRows = 20;

  const handleInputChange = (index, field, value) => {
    if (!rows[index].disabled) {
      const updatedRows = [...rows];
      updatedRows[index][field] = value;
      setRows(updatedRows);
    }
  };

  const handleCheckboxChange = (index, checked) => {
    const updatedRows = [...rows];
    updatedRows[index].checked = checked;
    setRows(updatedRows);
  };

  const handleAddNew = () => {
    if (rows.length < maxRows) {
      setRows([...rows, { key: "", value: "", description: "", checked: false, disabled: false }]);
    } else {
      alert("You cannot add more than 16 rows.");
    }
  };

  useEffect(() => {
    const updatedHeaders = rows.reduce((acc, row) => {
      if (row.checked && row.key.trim() && row.value.trim()) {
        acc[row.key] = row.value;
      }
      return acc;
    }, {});
    setHeaders(updatedHeaders);
  }, [rows, setHeaders]);

  return (
    <div className={styles.PMainWrapper}>
      <h5 className={styles.PHeadFied}>Headers</h5>
      <table className={styles.PtableMain}>
        <thead>
          <tr className={styles.PtableRowWrap}>
            <th></th>
            <th>Key</th>
            <th>Value</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody className={styles.TBodyWrap}>
          {rows.map((row, index) => (
            <tr key={index}>
              <td>
                <input
                  className={styles.PtableCheckBoxWrap}
                  type="checkbox"
                  checked={row.checked}
                  onChange={(e) => handleCheckboxChange(index, e.target.checked)}
                />
              </td>
              <td>
                <input
                  className={row.disabled ? styles.disabledInput : ""}
                  value={row.key}
                  disabled={row.disabled}
                  onChange={(e) => handleInputChange(index, "key", e.target.value)}
                />
              </td>
              <td>
                <input
                  className={row.disabled ? styles.disabledInput : ""}
                  value={row.value}
                  disabled={row.disabled}
                  onChange={(e) => handleInputChange(index, "value", e.target.value)}
                />
              </td>
              <td>
                <input
                  className={row.disabled ? styles.disabledInput : ""}
                  value={row.description}
                  disabled={row.disabled}
                  onChange={(e) => handleInputChange(index, "description", e.target.value)}
                />
              </td>
              <td>
                {index === rows.length - 1 && (
                  <button className={styles.HAddnewbtn} onClick={handleAddNew}>Add</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
