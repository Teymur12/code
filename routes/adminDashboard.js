import express from 'express';
import { selectSql, createSql } from '../database/sql.js';

const router = express.Router();

// Display Books
router.get('/', async (req, res) => {
  const books = await selectSql.getBooks();
  res.render('books', { books });
});

// Add Book
router.get('/add', (req, res) => {
  res.render('addBook'); // Add a form template for adding books
});

router.post('/add', async (req, res) => {
  const { title, authorId, price, publishedYear } = req.body;
  await createSql.addBook(title, authorId, price, publishedYear);
  res.redirect('/admin/books');
});

// Edit Book
router.get('/edit/:bookId', async (req, res) => {
  const bookId = req.params.bookId;
  const book = await selectSql.getBookById(bookId);
  res.render('editBook', { book });
});

router.post('/edit/:bookId', async (req, res) => {
  const bookId = req.params.bookId;
  const { title, authorId, price, publishedYear } = req.body;
  await createSql.updateBook(bookId, title, authorId, price, publishedYear);
  res.redirect('/admin/books');
});

// Delete Book
router.post('/delete/:bookId', async (req, res) => {
  const bookId = req.params.bookId;
  await createSql.deleteBook(bookId);
  res.redirect('/admin/books');
});

export default router;
