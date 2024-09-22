Here’s the enhanced README file you provided, with some formatting adjustments for clarity:

---

# 🚀 **TestMasterHub-Tool**

An open-source API testing and report-generating tool. Build and manage your API tests effortlessly!

## 📋 **Project Overview**

**TestMasterHub-Tool** is a powerful API testing platform that allows you to:

- 🛠️ Send API requests.
- 📊 Generate reports.
- 💻 Integrate with any development pipeline.

## 🛠️ **Prerequisites**

Before you start, make sure you have the following installed:

- ✅ [Node.js](https://nodejs.org/) (v14 or higher)
- ✅ [npm](https://www.npmjs.com/get-npm) (comes with Node.js)
- ✅ A modern web browser (like Chrome, Firefox, etc.)

## 📦 **How to Install**

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/testmasterhub-tool.git
   ```

2. **Navigate to the project directory:**

   ```bash
   cd testmasterhub-tool
   ```

3. **Install dependencies:**

   ```bash
   npm install
   ```

## 🚀 **Starting the Server**

1. **Start the server:**

   ```bash
   npm start
   ```

   By default, the server will run at **`http://localhost:8888`**.

2. **Client Setup (if applicable):**

   Navigate to the client directory:

   ```bash
   cd client
   ```

   Install client dependencies:

   ```bash
   npm install
   ```

   Then, start the client server:

   ```bash
   npm start
   ```

   The client will run at **`http://localhost:3000`**.

## 🧪 **How to Use**

1. **Launch the Application** by navigating to `http://localhost:5000` (for the backend) or `http://localhost:3000` (for the frontend).
2. Enter the **API URL**, select the **HTTP method**, and provide the necessary headers, request body, and parameters.
3. Click **Send Request** to view the response.
4. Validate and assert the responses with your custom scripts.

## 💾 **Temporary Database (TempDB)**

TempDB is a simple JavaScript utility for managing a temporary database using `localStorage`. It provides an easy-to-use API to save, update, retrieve, and delete data.

### 📋 **Features**

- **Easy to Use**: Functions like `set`, `get`, `update`, and `delete` make data management straightforward.
- **Persistent Storage**: Data is stored in the browser's `localStorage`, persisting even after page refreshes.
- **Flexible**: Store any data type (objects, arrays, strings, etc.) associated with unique keys.

### 📦 **Installation of TempDB**

1. Copy `tempDB.js` into your project directory.
2. Import it into your JavaScript file.

```javascript
import tempDB from './tempDB';
```

### 🛠️ **Usage of TempDB**

- **Set Data**

  ```javascript
  tempDB.set('key', value);
  ```

- **Get Data**

  ```javascript
  const value = tempDB.get('key');
  ```

- **Update Data**

  ```javascript
  tempDB.update('key', newValue);
  ```

- **Delete Data**

  ```javascript
  tempDB.delete('key');
  ```

- **Clear the Database**

  ```javascript
  tempDB.clear();
  ```

- **Get All Data**

  ```javascript
  const allData = tempDB.getAll();
  ```

### 💡 **Example**

Here’s a simple example demonstrating the usage of TempDB:

```javascript
import tempDB from './tempDB';

// Saving request data
tempDB.set('requestData', { method: 'GET', url: 'https://api.example.com/data' });

// Retrieving request data
const requestData = tempDB.get('requestData');
console.log('Request Data:', requestData);

// Updating response data
tempDB.set('responseData', { status: 200, body: { message: 'Success' } });
tempDB.update('responseData', { status: 500, body: { message: 'Error' } });

// Fetching updated response data
const updatedResponseData = tempDB.get('responseData');
console.log('Updated Response Data:', updatedResponseData);

// Deleting imported files
tempDB.set('importedFiles', ['file1.json', 'file2.json']);
tempDB.delete('importedFiles');

// Checking deleted files
const deletedFiles = tempDB.get('importedFiles');
console.log('Deleted Files:', deletedFiles); // Should be null

// Clearing all data
tempDB.clear();
const allData = tempDB.getAll();
console.log('All Data After Clear:', allData); // Should be {}
```

## 🔥 **Key Features**

- 📝 Send API requests with custom headers and request bodies.
- ⚙️ Supports GET, POST, PUT, DELETE, and more.
- 📊 View response status, headers, and body in real-time.
- 💾 Save and reuse API configurations.
- 🧑‍💻 Friendly UI for API testing.

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Enjoy testing your APIs and managing your temporary database! 😎

---