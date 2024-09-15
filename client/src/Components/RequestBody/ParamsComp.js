// src/Components/ParamsComp.js

import React from "react";
import styles from "../../Styles/RequestBody/ParamsComp.module.css";

export default function ParamsComp({
  onParamsChange,
  pathParams,
  setPathParams,
  queryParams,
  setQueryParams,
}) {
  // Handle adding a new query parameter
  const handleAddNew = () => {
    if (pathParams.length + queryParams.length < 20) {
      setQueryParams([
        ...queryParams,
        { key: "", value: "", description: "", isPath: false },
      ]);
    } else {
      alert("You cannot add more than 17 parameters in total.");
    }
  };

  // Handle changes in the path parameters
  const handlePathParamChange = (index, field, value) => {
    const updatedPathParams = [...pathParams];
    updatedPathParams[index] = {
      ...updatedPathParams[index],
      [field]: value,
    };
    setPathParams(updatedPathParams);
    onParamsChange(updatedPathParams, queryParams);
  };

  // Handle changes in query parameters
  const handleQueryParamChange = (index, field, value) => {
    const updatedQueryParams = [...queryParams];
    updatedQueryParams[index][field] = value;
    setQueryParams(updatedQueryParams);
    onParamsChange(pathParams, updatedQueryParams);
  };

  return (
    <div className={styles.PMainWrapper}>
      {/* Container for both Path and Query Parameters */}
      <div className={styles.ParametersContainer}>
        {/* Path Parameters Section */}
        {pathParams.length > 0 && <h6 className={styles.PHeadFied}>Path Parameters</h6>}
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
                      onChange={(e) => handlePathParamChange(index, "value", e.target.value)}
                      placeholder={`Enter value for ${row.key}`}
                    />
                  </td>
                  <td>
                    <input
                      value={row.description}
                      onChange={(e) => handlePathParamChange(index, "description", e.target.value)}
                      placeholder="Description (optional)"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Query Parameters Section */}
        <h6 className={styles.PHeadFied}>Query Parameters</h6>
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
                    onChange={(e) => handleQueryParamChange(index, "key", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    value={row.value}
                    onChange={(e) => handleQueryParamChange(index, "value", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    value={row.description}
                    onChange={(e) => handleQueryParamChange(index, "description", e.target.value)}
                  />
                </td>
                <td className={styles.actions}>
                  {index === queryParams.length - 1 && (
                    <button className={styles.PAddnewbtn} onClick={handleAddNew}>Add</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
