import {
  HandleCollectionStorage,
  HandleEnvironmentStorage,
} from "./HandleCookieStorage";

export default function JsonFileImporter(e) {
  return new Promise((resolve, reject) => {
    const file = e.target.files[0];

    if (!file) {
      alert("No file selected.");
      reject(new Error("No file selected."));
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target.result);

        // Check if it's a collection
        if (
          importedData.info &&
          importedData.item &&
          Array.isArray(importedData.item)
        ) {
          HandleCollectionStorage(importedData); // Store collection data
          setTimeout(() => {
            window.location.reload(); // Delay reload for async handling
          }, 100);
          resolve(importedData); // Return the collection data
        }
        // Check if it's an environment
        else if (
          (importedData._postman_variable_scope ||
            importedData._TestmasterHub_variable_scope) &&
          Array.isArray(importedData.values)
        ) {
          HandleEnvironmentStorage(importedData); // Store environment data
          setTimeout(() => {
            window.location.reload(); // Delay reload for async handling
          }, 100);
          resolve(null); // No need to return data for environment
        } else {
          alert(
            "Invalid JSON structure. Expected a collection or environment."
          );
          reject(new Error("Invalid JSON structure."));
        }
      } catch (error) {
        console.error("Error processing file:", error);
        alert("Invalid JSON file.");
        reject(error);
      }
    };

    reader.onerror = () => {
      alert("Error reading file.");
      reject(new Error("Error reading file."));
    };

    reader.readAsText(file);
  });
}
