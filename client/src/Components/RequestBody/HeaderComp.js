import React, { useState } from "react";
import styles from "../../Styles/RequestBody/ParamsComp.module.css";

export default function HeaderComp() {
  const [rows, setRows] = useState([{ key: "", value: "", description: "" }]);
  const maxRows = 16;

  const handleAddNew = () => {
    if (rows.length < maxRows) {
      setRows([...rows, { key: "", value: "", description: "" }]);
    } else {
      alert("You cannot add more than 16 rows.");
    }
  };

  // Function to handle input changes
  const handleInputChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };

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
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <td>
                <input className={styles.PtableCheckBoxWrap} type="checkbox" />
              </td>
              <td>
                <input
                  value={row.key}
                  onChange={(e) =>
                    handleInputChange(index, "key", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  value={row.value}
                  onChange={(e) =>
                    handleInputChange(index, "value", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  value={row.description}
                  onChange={(e) =>
                    handleInputChange(index, "description", e.target.value)
                  }
                />
              </td>
              <td>
                {index === 0 && <button onClick={handleAddNew}>Add New</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
