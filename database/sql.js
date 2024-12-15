import mysql from "mysql2";

// Database connection pool
const pool = mysql.createPool(
  process.env.JAWSDB_URL ?? {
    host: "localhost",
    user: "root",
    database: "bookstore",
    password: "Teymur2004.",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  }
);

const promisePool = pool.promise();

// SQL Query Functions
export const selectSql = {
  // Get all customers
  getCustomers: async () => {
    const [rows] = await promisePool.query(`SELECT * FROM customer`);
    return rows;
  },
  getBasket: async (CustomerID) => {
    const query = `
      SELECT 
        Book.BookID,                
        Book.Title, 
        Author.Name AS AuthorName, 
        Book.Price,                
        ShoppingBasket.Quantity
      FROM ShoppingBasket
      JOIN Book ON ShoppingBasket.BookID = Book.BookID
      JOIN Author ON Book.AuthorID = Author.AuthorID
      WHERE ShoppingBasket.CustomerID = ?`;
    const [rows] = await promisePool.query(query, [CustomerID]);
    return rows;
  },
  getAdmins: async () => {
    const query = 'SELECT * FROM Admin';  // Replace with your Admin table query
    const [rows] = await promisePool.query(query);
    return rows;
  },

  // Get all books and their availability
  getBooks: async () => {
    const query = `
      SELECT 
        Book.BookID, 
        Book.Title, 
        Author.Name AS AuthorName, 
        Book.Price, 
        IFNULL(SUM(Inventory.Quantity), 0) AS AvailableQuantity
      FROM Book
      JOIN Author ON Book.AuthorID = Author.AuthorID
      LEFT JOIN Inventory ON Book.BookID = Inventory.BookID
      GROUP BY Book.BookID, Book.Title, Author.Name, Book.Price;
    `;
    const [rows] = await promisePool.query(query);
    return rows;
  },
  getBooks: async (query = '') => {
    const searchQuery = `%${query}%`; // Use `%` for partial matching
    const queryStr = `
      SELECT 
        Book.BookID, 
        Book.Title, 
        Author.Name AS AuthorName, 
        Book.Price, 
        IFNULL(SUM(Inventory.Quantity), 0) AS AvailableQuantity
      FROM Book
      JOIN Author ON Book.AuthorID = Author.AuthorID
      LEFT JOIN Inventory ON Book.BookID = Inventory.BookID
      WHERE Book.Title LIKE ? OR Author.Name LIKE ? 
      GROUP BY Book.BookID, Book.Title, Author.Name, Book.Price;
    `;
    const [rows] = await promisePool.query(queryStr, [searchQuery, searchQuery]);
    return rows;
  },
  // Get shopping basket for a specific customer
  getBasket: async (CustomerID) => {
    const query = `
      SELECT 
        Book.BookID,                
        Book.Title, 
        Author.Name AS AuthorName, 
        Book.Price, 
        ShoppingBasket.Quantity
      FROM ShoppingBasket
      JOIN Book ON ShoppingBasket.BookID = Book.BookID
      JOIN Author ON Book.AuthorID = Author.AuthorID
      WHERE ShoppingBasket.CustomerID = ?`;
    const [rows] = await promisePool.query(query, [CustomerID]);
    return rows;
  },

  // Get reservations for a specific customer
  getReservations: async (CustomerID) => {
    const query = `
      SELECT 
        Book.Title, 
        Reservation.PickupTime, 
        Reservation.Status
      FROM Reservation
      JOIN Book ON Reservation.BookID = Book.BookID
      WHERE Reservation.CustomerID = ?`;
    const [rows] = await promisePool.query(query, [CustomerID]);
    return rows;
  },

  // Get purchases for a specific customer
  getPurchases: async (CustomerID) => {
    const query = `
      SELECT 
        Book.Title, 
        Purchase.PurchaseDate
      FROM Purchase
      JOIN Book ON Purchase.BookID = Book.BookID
      WHERE Purchase.CustomerID = ?`;
    const [rows] = await promisePool.query(query, [CustomerID]);
    return rows;
  },

  // Get customer account details
  getCustomerDetails: async (CustomerID) => {
    const query = `SELECT Name, Email FROM Customer WHERE CustomerID = ?`;
    const [rows] = await promisePool.query(query, [CustomerID]);
    return rows[0]; // Return a single row
  },

  // Fetch book details by BookID
  getBookById: async (BookID) => {
    const query = `
      SELECT 
        Book.Title, 
        Author.Name AS AuthorName, 
        Book.Price
      FROM Book
      JOIN Author ON Book.AuthorID = Author.AuthorID
      WHERE Book.BookID = ?`;
    const [rows] = await promisePool.query(query, [BookID]);
    return rows[0]; // Return a single book
  },
};

export const createSql = {
  // Add Book
  addBook: async (title, authorId, price, publishedYear) => {
    const query = `
      INSERT INTO Book (Title, AuthorID, Price, PublishedYear)
      VALUES (?, ?, ?, ?)`;
    await promisePool.query(query, [title, authorId, price, publishedYear]);
  },

  // Update Book
  updateBook: async (bookId, title, authorId, price, publishedYear) => {
    const query = `
      UPDATE Book 
      SET Title = ?, AuthorID = ?, Price = ?, PublishedYear = ? 
      WHERE BookID = ?`;
    await promisePool.query(query, [title, authorId, price, publishedYear, bookId]);
  },

  // Delete Book
  deleteBook: async (bookId) => {
    const query = `DELETE FROM Book WHERE BookID = ?`;
    await promisePool.query(query, [bookId]);
  },

  // Get Book by ID
  getBookById: async (bookId) => {
    const query = `
      SELECT * FROM Book WHERE BookID = ?`;
    const [rows] = await promisePool.query(query, [bookId]);
    return rows[0]; // Return the book details
  },

  // Get All Books
  getBooks: async () => {
    const query = `
      SELECT * FROM Book`;
    const [rows] = await promisePool.query(query);
    return rows;
  }
};

// --- Author CRUD Operations ---
export const createSqlAuthor = {
  // Add Author
  addAuthor: async (name, bio) => {
    const query = `
      INSERT INTO Author (Name, Bio)
      VALUES (?, ?)`;
    await promisePool.query(query, [name, bio]);
  },

  // Update Author
  updateAuthor: async (authorId, name, bio) => {
    const query = `
      UPDATE Author
      SET Name = ?, Bio = ?
      WHERE AuthorID = ?`;
    await promisePool.query(query, [name, bio, authorId]);
  },

  // Delete Author
  deleteAuthor: async (authorId) => {
    const query = `DELETE FROM Author WHERE AuthorID = ?`;
    await promisePool.query(query, [authorId]);
  },

  // Get All Authors
  getAuthors: async () => {
    const query = `SELECT * FROM Author`;
    const [rows] = await promisePool.query(query);
    return rows;
  }
};

// --- Award CRUD Operations ---
export const createSqlAward = {
  // Add Award
  addAward: async (name, description) => {
    const query = `
      INSERT INTO Award (Name, Description)
      VALUES (?, ?)`;
    await promisePool.query(query, [name, description]);
  },

  // Update Award
  updateAward: async (awardId, name, description) => {
    const query = `
      UPDATE Award
      SET Name = ?, Description = ?
      WHERE AwardID = ?`;
    await promisePool.query(query, [name, description, awardId]);
  },

  // Delete Award
  deleteAward: async (awardId) => {
    const query = `DELETE FROM Award WHERE AwardID = ?`;
    await promisePool.query(query, [awardId]);
  },

  // Get All Awards
  getAwards: async () => {
    const query = `SELECT * FROM Award`;
    const [rows] = await promisePool.query(query);
    return rows;
  }
};

// --- Warehouse CRUD Operations ---
export const createSqlWarehouse = {
  // Add Warehouse
  addWarehouse: async (location) => {
    const query = `
      INSERT INTO Warehouse (Location)
      VALUES (?)`;
    await promisePool.query(query, [location]);
  },

  // Update Warehouse
  updateWarehouse: async (warehouseId, location) => {
    const query = `
      UPDATE Warehouse
      SET Location = ?
      WHERE WarehouseID = ?`;
    await promisePool.query(query, [location, warehouseId]);
  },

  // Delete Warehouse
  deleteWarehouse: async (warehouseId) => {
    const query = `DELETE FROM Warehouse WHERE WarehouseID = ?`;
    await promisePool.query(query, [warehouseId]);
  },

  // Get All Warehouses
  getWarehouses: async () => {
    const query = `SELECT * FROM Warehouse`;
    const [rows] = await promisePool.query(query);
    return rows;
  }
};

// --- Inventory CRUD Operations ---
export const createSqlInventory = {
  // Add Inventory
  addInventory: async (bookId, warehouseId, quantity) => {
    const query = `
      INSERT INTO Inventory (BookID, WarehouseID, Quantity)
      VALUES (?, ?, ?)`;
    await promisePool.query(query, [bookId, warehouseId, quantity]);
  },

  // Update Inventory
  updateInventory: async (inventoryId, quantity) => {
    const query = `
      UPDATE Inventory
      SET Quantity = ?
      WHERE InventoryID = ?`;
    await promisePool.query(query, [quantity, inventoryId]);
  },

  // Delete Inventory
  deleteInventory: async (inventoryId) => {
    const query = `DELETE FROM Inventory WHERE InventoryID = ?`;
    await promisePool.query(query, [inventoryId]);
  },

  // Get Inventory by BookID
  getInventoryByBookId: async (bookId) => {
    const query = `
      SELECT * FROM Inventory WHERE BookID = ?`;
    const [rows] = await promisePool.query(query, [bookId]);
    return rows;
  }
};

// --- Contains CRUD Operations ---
export const createSqlContains = {
  // Add Contains
  addContains: async (bookId, awardId) => {
    const query = `
      INSERT INTO Contains (BookID, AwardID)
      VALUES (?, ?)`;
    await promisePool.query(query, [bookId, awardId]);
  },

  // Delete Contains
  deleteContains: async (bookId, awardId) => {
    const query = `DELETE FROM Contains WHERE BookID = ? AND AwardID = ?`;
    await promisePool.query(query, [bookId, awardId]);
  },

  // Get All Contains
  getContains: async () => {
    const query = `SELECT * FROM Contains`;
    const [rows] = await promisePool.query(query);
    return rows;
  }
};

export default {
  createSql,
  createSqlAuthor,
  createSqlAward,
  createSqlWarehouse,
  createSqlInventory,
  createSqlContains
};