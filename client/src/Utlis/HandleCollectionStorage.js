export default function HandleCollectionStorage(data) {
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
