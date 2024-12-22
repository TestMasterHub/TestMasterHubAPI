import React from "react";

// HandleCollectionStorage function to store collection data
function HandleCollectionStorage(data) {
  if (!data) {
    console.error("No data provided to store in collections.");
    return;
  }

  try {
    const existingCollections = localStorage.getItem("collections");
    let collections;

    if (!existingCollections) {
      collections = { 0: data };
    } else {
      const parsedCollections = JSON.parse(existingCollections);
      const nextIndex = Object.keys(parsedCollections).length;
      collections = { ...parsedCollections, [nextIndex]: data };
    }

    localStorage.setItem("collections", JSON.stringify(collections));
  } catch (error) {
    console.error("Failed to handle collection storage:", error);
  }
}

// HandleEnvironmentStorage function to store environment data
function HandleEnvironmentStorage(data) {
  if (!data) {
    console.error("No data provided to store in environments.");
    return;
  }
  console.log("Data loaded: " + JSON.stringify(data.values[0]));
  try {
    const existingEnvironments = localStorage.getItem("environments");
    let environments;

    if (!existingEnvironments) {
      environments = { 0: data };
    } else {
      const parsedEnvironments = JSON.parse(existingEnvironments);
      const nextIndex = Object.keys(parsedEnvironments).length;
      environments = { ...parsedEnvironments, [nextIndex]: data };
    }
    localStorage.setItem("environments", JSON.stringify(environments));
  } catch (error) {
    console.error("Failed to handle environment storage:", error);
  }
}

// Export both functions
export { HandleCollectionStorage, HandleEnvironmentStorage };
