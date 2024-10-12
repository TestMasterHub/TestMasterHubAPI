const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid'); // For generating unique IDs

// Create an Express app
const app = express();
const PORT = 5001; // Set your port

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Paths for storing collections and environments
const COLLECTIONS_FILE = path.join(__dirname, 'data', 'collections.json');
const ENVIRONMENTS_FILE = path.join(__dirname, 'data', 'environments.json');

// Create data directory if it doesn't exist
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'));
}

// Utility function to read JSON data from a file
const readJSONFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
  return [];
};

// Utility function to write JSON data to a file
const writeJSONFile = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

const mergeCollections = (existingCollections, newCollections) => {
  // If newCollections is not an array, wrap it in an array
  if (!Array.isArray(newCollections)) {
      newCollections = [newCollections];
  }

  const existingIds = existingCollections.map(c => c.id.toString()); // Convert existing IDs to strings for comparison

  newCollections.forEach(collection => {
      // Check if the collection ID already exists
      if (!existingIds.includes(collection.id.toString())) {
          // If the ID does not exist, push the new collection with a new ID
          collection.id = uuidv4(); // Generate a new unique ID for new collections if necessary
          existingCollections.push(collection);
      } else {
          // If the ID exists, you might want to update the existing collection
          const existingCollection = existingCollections.find(c => c.id.toString() === collection.id.toString());
          Object.assign(existingCollection, collection); // Update the existing collection with new data
      }
  });
  return existingCollections;
};


// Function to avoid duplicating environments
const mergeEnvironments = (existingEnvironments, newEnvironments) => {
  const existingIds = existingEnvironments.map(env => env.id);

  newEnvironments.forEach(environment => {
    if (!existingIds.includes(environment.id)) {
      environment.id = uuidv4(); // Generate a new unique ID for new environments
      existingEnvironments.push(environment);
    }
  });
  return existingEnvironments;
};

// API route to get environments
app.get('/api/environments', (req, res) => {
  const environments = readJSONFile(ENVIRONMENTS_FILE);
  res.json(environments);
});

// API route to get collections
app.get('/api/collections', (req, res) => {
  const collections = readJSONFile(COLLECTIONS_FILE);
  res.json(collections);
});
// API route to save/import collections
app.post('/api/collections', (req, res) => {
  const newCollections = req.body;

  console.log('Received Collections'); // Debug log to check incoming data

  // Ensure that incoming data is an array
  if (!Array.isArray(newCollections)) {
      return res.status(400).json({ success: false, message: 'Invalid data format: Expected an array' });
  }

  let collections = readJSONFile(COLLECTIONS_FILE);

  // Merge new collections with existing ones, avoid duplication
  collections = mergeCollections(collections, newCollections);
  writeJSONFile(COLLECTIONS_FILE, collections);

  res.json({ success: true, message: 'Collections saved and merged successfully' });
});


// API route to save/import environments
app.post('/api/environments', (req, res) => {
  const newEnvironments = req.body;
  let environments = readJSONFile(ENVIRONMENTS_FILE);

  // Merge new environments with existing ones, avoid duplication
  environments = mergeEnvironments(environments, newEnvironments);
  writeJSONFile(ENVIRONMENTS_FILE, environments);

  res.json({ success: true, message: 'Environments saved and merged successfully' });
});

// API route to delete a collection by ID
app.delete('/api/collections/:id', (req, res) => {
  const collectionId = req.params.id;
  let collections = readJSONFile(COLLECTIONS_FILE);

  // Filter out the collection with the specified ID
  collections = collections.filter(collection => collection.id !== collectionId);
  writeJSONFile(COLLECTIONS_FILE, collections);

  res.json({ success: true, message: 'Collection deleted successfully' });
});

// API route to delete an environment by ID
app.delete('/api/environments/:id', (req, res) => {
  const environmentId = req.params.id;
  let environments = readJSONFile(ENVIRONMENTS_FILE);

  // Filter out the environment with the specified ID
  environments = environments.filter(environment => environment.id !== environmentId);
  writeJSONFile(ENVIRONMENTS_FILE, environments);

  res.json({ success: true, message: 'Environment deleted successfully' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
