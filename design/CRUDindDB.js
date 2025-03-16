// IndexedDB CRUD Operations

// Database configuration
const dbConfig = {
    name: 'MyDatabase',
    version: 1,
    storeName: 'items'
  };
  
  // Initialize the database
  function initDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbConfig.name, dbConfig.version);
      
      // Handle database upgrade (runs when version changes or DB is created)
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Create object store (table) if it doesn't exist
        if (!db.objectStoreNames.contains(dbConfig.storeName)) {
          // Create with auto-incrementing key
          const objectStore = db.createObjectStore(dbConfig.storeName, { 
            keyPath: 'id', 
            autoIncrement: true 
          });
          // Define indexes for searching (optional)
          objectStore.createIndex('name', 'name', { unique: false });
          objectStore.createIndex('email', 'email', { unique: true });
          
          console.log(`Object store "${dbConfig.storeName}" created successfully`);
        }
      };
      // Handle success
      request.onsuccess = (event) => {
        const db = event.target.result;
        console.log(`Database "${dbConfig.name}" opened successfully`);
        resolve(db);
      };
      // Handle errors
      request.onerror = (event) => {
        console.error('Error opening database:', event.target.error);
        reject(event.target.error);
      };
    });
  }
  
  // CREATE - Add an item to the database
  function addItem(item) {
    return new Promise((resolve, reject) => {
      initDatabase().then(db => {
        // Start a transaction
        const transaction = db.transaction([dbConfig.storeName], 'readwrite');
        const store = transaction.objectStore(dbConfig.storeName);
        
        // Add the item
        const request = store.add(item);
        
        // Handle success
        request.onsuccess = (event) => {
          console.log('Item added successfully, ID:', event.target.result);
          resolve(event.target.result); // Returns the generated id
        };
        
        // Handle errors
        request.onerror = (event) => {
          console.error('Error adding item:', event.target.error);
          reject(event.target.error);
        };
        
        // Close the database when transaction completes
        transaction.oncomplete = () => db.close();
      }).catch(error => reject(error));
    });
  }
  
  // READ - Get an item by its ID
  function getItemById(id) {
    return new Promise((resolve, reject) => {
      initDatabase().then(db => {
        const transaction = db.transaction([dbConfig.storeName], 'readonly');
        const store = transaction.objectStore(dbConfig.storeName);
        
        // Get the item by ID
        const request = store.get(id);
        
        request.onsuccess = (event) => {
          if (event.target.result) {
            console.log('Item retrieved:', event.target.result);
            resolve(event.target.result);
          } else {
            console.log(`Item with ID ${id} not found`);
            resolve(null);
          }
        };
        
        request.onerror = (event) => {
          console.error('Error getting item:', event.target.error);
          reject(event.target.error);
        };
        
        transaction.oncomplete = () => db.close();
      }).catch(error => reject(error));
    });
  }
  
  // READ - Get all items
  function getAllItems() {
    return new Promise((resolve, reject) => {
      initDatabase().then(db => {
        const transaction = db.transaction([dbConfig.storeName], 'readonly');
        const store = transaction.objectStore(dbConfig.storeName);
        
        // Get all items
        const request = store.getAll();
        
        request.onsuccess = (event) => {
          console.log('Retrieved all items:', event.target.result);
          resolve(event.target.result);
        };
        
        request.onerror = (event) => {
          console.error('Error getting all items:', event.target.error);
          reject(event.target.error);
        };
        
        transaction.oncomplete = () => db.close();
      }).catch(error => reject(error));
    });
  }
  
  // READ - Query items using an index
  function queryItemsByIndex(indexName, value) {
    return new Promise((resolve, reject) => {
      initDatabase().then(db => {
        const transaction = db.transaction([dbConfig.storeName], 'readonly');
        const store = transaction.objectStore(dbConfig.storeName);
        
        // Get the index
        const index = store.index(indexName);
        const request = index.getAll(value);
        
        request.onsuccess = (event) => {
          console.log(`Items with ${indexName}="${value}":`, event.target.result);
          resolve(event.target.result);
        };
        
        request.onerror = (event) => {
          console.error('Error querying items:', event.target.error);
          reject(event.target.error);
        };
        
        transaction.oncomplete = () => db.close();
      }).catch(error => reject(error));
    });
  }
  
  // UPDATE - Update an existing item
  function updateItem(item) {
    return new Promise((resolve, reject) => {
      // Item must have an ID
      if (!item.id) {
        reject(new Error('Item must have an ID to be updated'));
        return;
      }
      
      initDatabase().then(db => {
        const transaction = db.transaction([dbConfig.storeName], 'readwrite');
        const store = transaction.objectStore(dbConfig.storeName);
        
        // Put will update if id exists, or add if it doesn't
        const request = store.put(item);
        
        request.onsuccess = (event) => {
          console.log('Item updated successfully');
          resolve(item);
        };
        
        request.onerror = (event) => {
          console.error('Error updating item:', event.target.error);
          reject(event.target.error);
        };
        
        transaction.oncomplete = () => db.close();
      }).catch(error => reject(error));
    });
  }
  
  // DELETE - Delete an item by its ID
  function deleteItem(id) {
    return new Promise((resolve, reject) => {
      initDatabase().then(db => {
        const transaction = db.transaction([dbConfig.storeName], 'readwrite');
        const store = transaction.objectStore(dbConfig.storeName);
        
        // Delete the item
        const request = store.delete(id);
        
        request.onsuccess = (event) => {
          console.log(`Item with ID ${id} deleted successfully`);
          resolve(true);
        };
        
        request.onerror = (event) => {
          console.error('Error deleting item:', event.target.error);
          reject(event.target.error);
        };
        
        transaction.oncomplete = () => db.close();
      }).catch(error => reject(error));
    });
  }
  
  // DELETE - Clear all items from the store
  function clearAllItems() {
    return new Promise((resolve, reject) => {
      initDatabase().then(db => {
        const transaction = db.transaction([dbConfig.storeName], 'readwrite');
        const store = transaction.objectStore(dbConfig.storeName);
        
        // Clear the store
        const request = store.clear();
        
        request.onsuccess = (event) => {
          console.log('All items cleared successfully');
          resolve(true);
        };
        
        request.onerror = (event) => {
          console.error('Error clearing items:', event.target.error);
          reject(event.target.error);
        };
        
        transaction.oncomplete = () => db.close();
      }).catch(error => reject(error));
    });
  }
  
  // Example usage:
  
  // 1. Add items
  /*
  addItem({
    name: 'John Doe',
    email: 'john@example.com',
    age: 30
  }).then(id => console.log('Added item with ID:', id));
  
  addItem({
    name: 'Jane Smith',
    email: 'jane@example.com',
    age: 25
  }).then(id => console.log('Added item with ID:', id));
  */
  
  // 2. Get an item by ID
  // getItemById(1).then(item => console.log('Retrieved item:', item));
  
  // 3. Get all items
  // getAllItems().then(items => console.log('All items:', items));
  
  // 4. Query items by index
  // queryItemsByIndex('name', 'John Doe').then(items => console.log('Query results:', items));
  
  // 5. Update an item
  /*
  getItemById(1).then(item => {
    if (item) {
      item.age = 31;
      return updateItem(item);
    }
  }).then(updatedItem => console.log('Updated item:', updatedItem));
  */
  
  // 6. Delete an item
  // deleteItem(1).then(success => console.log('Item deleted:', success));
  
  // 7. Clear all items
  // clearAllItems().then(success => console.log('All items cleared:', success));