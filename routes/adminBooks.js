import express from 'express';
import { createSql } from '../database/sql.js';

const router = express.Router();

// Get all books
router.get('/books/', async (req, res) => {
  const books = await createSql.getBooks(); // Fetch all books
  res.render('adminBooks', { books });
});

// Add a new book (GET form)
router.get('/books/add', (req, res) => {
  res.render('adminBook'); // Render form for adding a new book
});

// Add a new book (POST form)
router.post('/books/add', async (req, res) => {
  const { title, authorId, price, publishedYear } = req.body;
  await createSql.addBook(title, authorId, price, publishedYear);
  res.redirect('/admin/books'); // Redirect to books page after adding
});

// Edit a book (GET form)
router.get('/books/edit/:bookId', async (req, res) => {
  const bookId = req.params.bookId;
  const book = await createSql.getBookById(bookId); // Fetch book details by ID
  res.render('editBook', { book });
});

// Edit a book (POST form)
router.post('/books/edit/:bookId', async (req, res) => {
  const { title, authorId, price, publishedYear } = req.body;
  const bookId = req.params.bookId;
  await createSql.updateBook(bookId, title, authorId, price, publishedYear);
  res.redirect('/admin/books'); // Redirect to books page after editing
});

// Delete a book
router.post('/books/delete/:bookId', async (req, res) => {
  const bookId = req.params.bookId;
  await createSql.deleteBook(bookId);
  res.redirect('/admin/books'); // Redirect to books page after deleting
});

export default router;
