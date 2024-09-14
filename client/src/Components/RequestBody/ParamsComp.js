import React from "react";
import styles from "../../Styles/RequestBody/ParamsComp.module.css";

export default function ParamsComp({
  onParamsChange,
  pathParams,
  setPathParams,
  queryParams,
  setQueryParams,
}) {
  // Handle adding a new query parameter (unchanged)
  const handleAddNew = () => {
    if (queryParams.length < 17) {
      setQueryParams([
        ...queryParams,
        { key: "", value: "", description: "", isPath: false },
      ]);
    } else {
      alert("You cannot add more than 17 rows.");
    }
  };

  // Handle changes in the path parameters (only updating value, not key)
  const handlePathParamChange = (index, value) => {
    const updatedPathParams = [...pathParams];

    updatedPathParams[index] = {
      ...updatedPathParams[index],
      value: value, // Only allow the value to be modified
    };

    setPathParams(updatedPathParams); // Update state with modified path parameters
    onParamsChange(updatedPathParams, queryParams); // Notify parent component
  };

  // Handle changes in query parameters (unchanged)
  const handleQueryParamChange = (index, field, value) => {
    const updatedQueryParams = [...queryParams];
    updatedQueryParams[index][field] = value;

    setQueryParams(updatedQueryParams);
    onParamsChange(pathParams, updatedQueryParams);
  };

  return (
    <div className={styles.PMainWrapper}>
      {/* Path Parameters Section */}
      {pathParams.length > 0 && <h6>Path Parameters</h6>}
      {pathParams.length > 0 && (
        <table className={styles.PtableMain}>
          <thead>
            <tr className={styles.PtableRowWrap}>
              <th>Key</th>
              <th>Value</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {pathParams.map((row, index) => (
              <tr key={index}>
                <td>
                  <input value={row.key} readOnly disabled /> {/* Non-editable key */}
                </td>
                <td>
                  <input
                    value={row.value}
                    onChange={(e) => handlePathParamChange(index, e.target.value)}
                    placeholder={`Enter value for ${row.key}`}
                  />
                </td>
                <td>
                  <input
                    value={row.description}
                    onChange={(e) =>
                      handlePathParamChange(index, e.target.value)
                    }
                    placeholder="Description (optional)"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Query Parameters Section */}
      <h6>Query Parameters</h6>
      <table className={styles.PtableMain}>
        <thead>
          <tr className={styles.PtableRowWrap}>
            <th>Key</th>
            <th>Value</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {queryParams.map((row, index) => (
            <tr key={index}>
              <td>
                <input
                  value={row.key}
                  onChange={(e) =>
                    handleQueryParamChange(index, "key", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  value={row.value}
                  onChange={(e) =>
                    handleQueryParamChange(index, "value", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  value={row.description}
                  onChange={(e) =>
                    handleQueryParamChange(index, "description", e.target.value)
                  }
                />
              </td>
              <td className={styles.actions}>
                {index === queryParams.length - 1 && (
                  <button onClick={handleAddNew}>Add</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
