import express from 'express';
import { selectSql } from '../database/sql.js';

const router = express.Router();

// Route to fetch and display books
router.get('/book', async (req, res) => {
  const searchQuery = req.query.query || ''; // Capture the search query (default to empty string)
  const CustomerID = req.cookies.customer;

  try {
    const books = await selectSql.getBooks(searchQuery); // Get books filtered by search query
    const customerDetails = await selectSql.getCustomerDetails(CustomerID);
  
  
    res.render('books', { books, query: searchQuery, customerDetails }); // Pass books and query to the view
  } catch (err) {
    console.error("Error fetching books:", err);
    res.status(500).send("Error fetching books from the database.");
  }
});

export default router;
