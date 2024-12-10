// utils/generateCollectionJson.js
import { v4 as uuidv4 } from "uuid";

/**
 * Generates a JSON object representing a new collection
 * @param {string} CollectionData The name of the new collection
 * @returns {object} The new collection object
 * @throws {Error} If the CollectionData parameter is null or empty
 */
export const generateCollectionJson = (CollectionData, requestdata) => {
  // Check if a collection name is provided as a parameter
  if (CollectionData === null || CollectionData === "") {
    throw new Error("generateCollectionJson: No collection name provided");
  }

  /**
   * Create a new collection object with the given name and an empty array of items
   * The schema value is set to the latest version (v2.1.0)
   */
  const newCollection = {
    info: {
      _testmasterhub_id: uuidv4(),
      _exporter_id: uuidv4(),
      name: CollectionData,
      description: "This is a new collection description.",
      schema:
        "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
    },
    item: requestdata,
  };

  return newCollection;
};
