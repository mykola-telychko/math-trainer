

// INIT DB -- start 
// Database configuration
const dbConfig = { name: 'MyDatabase', version: 1, storeName: 'items'};

// Global variable to store the database instance
let dbInstance = null;

// Initialize the database
function initDatabase() {
  return new Promise((resolve, reject) => {
    // Check if the database is already initialized
    if (dbInstance) {
      console.log('Database is already initialized');
      resolve(dbInstance);
      return;
    }

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
      dbInstance = event.target.result; // Save the database instance
      console.log(`Database "${dbConfig.name}" opened successfully`);
      resolve(dbInstance);
    };

    // Handle errors
    request.onerror = (event) => {
      console.error('Error opening database:', event.target.error);
      reject(event.target.error);
    };
  });
}

// Initialize the database when the page loads
document.addEventListener('DOMContentLoaded', () => {
  initDatabase()
    .then((db) => {
      console.log('Database is ready to use:', db);
      // displayAllItems();
      // You can now use the database instance (db) for operations
    })
    .catch((error) => {
      console.error('Failed to initialize database:', error);
    });
});
// INIT DB -- end 


// ------------------------------------ pring all 
// Function to read all items from the database and display them
function displayAllItems() {
  if (!dbInstance) {
    console.error('Database is not initialized');
    return;
  }
  const transaction = dbInstance.transaction(dbConfig.storeName, 'readonly');
  const store = transaction.objectStore(dbConfig.storeName);
  const request = store.getAll(); // Get all items from the store

  // request.onsuccess = (event) => {
  //   const items = event.target.result;
  //   const outputElement = document.getElementById('output');

  //   // Clear previous content
  //   outputElement.innerHTML = '';

  //   // Display each item
  //   if (items.length > 0) {
  //     items.forEach((item) => {
  //       const itemElement = document.createElement('div');
  //       itemElement.textContent = `ID: ${item.id}, Name: ${item.name}, Email: ${item.email}`;
  //       outputElement.appendChild(itemElement);
  //     });
  //   } else {
  //     outputElement.textContent = 'No items found in the database.';
  //   }
  // };

  request.onerror = (event) => {
    console.error('Error reading items:', event.target.error);
  };
}
// ------------------------------------ pring all 


// CRUD DB -- start 
// Example: Add an item to the database
function addItem(item) {
  if (!dbInstance) {
    console.error('Database is not initialized');
    return;
  }

  const transaction = dbInstance.transaction(dbConfig.storeName, 'readwrite');
  const store = transaction.objectStore(dbConfig.storeName);
  const request = store.add(item);

  request.onsuccess = () => {
    console.log('Item added successfully');
  };

  request.onerror = (event) => {
    console.error('Error adding item:', event.target.error);
  };
}

// Example usage
function repo(){

  console.log('send result');

  document.addEventListener('DOMContentLoaded', () => {
    initDatabase()
      .then((db) => {
        console.log('Database is ready to use:', db);
        // Add an item to the database
        addItem({ name: 'John Doe', email: 'john@example.com' });
      })
      .catch((error) => {
        console.error('Failed to initialize database:', error);
      });
  });
}

// CRUD DB -- end 



// Open DB
// const request = indexedDB.open('MyDatabase', 1);
// request.onupgradeneeded = (event) => {
//   const db = event.target.result;
//   const store = db.createObjectStore('users', { keyPath: 'id' });
//   store.createIndex('name', 'name', { unique: false });
// };
// request.onsuccess = (event) => {
//   const db = event.target.result;
//   // Add data
//   const transaction = db.transaction('users', 'readwrite');
//   const store = transaction.objectStore('users');
//   store.add({ id: 1, name: 'Rob Doot', age: 30 });
//   // Read data 
//   const getRequest = store.get(1);
//   getRequest.onsuccess = () => {
//     console.log('read db:', getRequest.result); 
//   };
// };
// request.onerror = (event) => {
//   console.error('Error opening database:', event.target.error);
// };