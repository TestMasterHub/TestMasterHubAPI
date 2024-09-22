// tempDB.js
class TempDB {
    constructor() {
      this.dbName = 'tempDB';
    }
  
    // Save data to the temporary database
    set(key, value) {
      const db = this.getAll();
      db[key] = value;
      localStorage.setItem(this.dbName, JSON.stringify(db));
    }
  
    // Get a specific value from the temporary database
    get(key) {
      const db = this.getAll();
      return db[key] || null;
    }
  
    // Update a specific value in the temporary database
    update(key, value) {
      const db = this.getAll();
      if (db[key] !== undefined) {
        db[key] = value;
        localStorage.setItem(this.dbName, JSON.stringify(db));
      } else {
        console.warn(`Key "${key}" does not exist.`);
      }
    }
  
    // Delete a specific value from the temporary database
    delete(key) {
      const db = this.getAll();
      delete db[key];
      localStorage.setItem(this.dbName, JSON.stringify(db));
    }
  
    // Clear the entire temporary database
    clear() {
      localStorage.removeItem(this.dbName);
    }
  
    // Get all data in the temporary database
    getAll() {
      const data = localStorage.getItem(this.dbName);
      return data ? JSON.parse(data) : {};
    }
  }
  
  // Create an instance of TempDB
  const tempDB = new TempDB();
  export default tempDB;
  