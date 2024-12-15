import express from 'express';
import { createSqlAuthor } from '../database/sql.js';

const router = express.Router();

// Get all authors
router.get('/', async (req, res) => {
  const authors = await createSqlAuthor.getAuthors();
  res.render('adminAuthors', { authors });
});

// Add a new author (GET form)
router.get('/add', (req, res) => {
  res.render('addAuthor'); // Render form for adding a new author
});

// Add a new author (POST form)
router.post('/add', async (req, res) => {
  const { name, bio } = req.body;
  await createSqlAuthor.addAuthor(name, bio);
  res.redirect('/admin/authors'); // Redirect to authors page after adding
});

// Edit an author (GET form)
router.get('/edit/:authorId', async (req, res) => {
  const authorId = req.params.authorId;
  const author = await createSqlAuthor.getAuthorById(authorId);
  res.render('editAuthor', { author });
});

// Edit an author (POST form)
router.post('/edit/:authorId', async (req, res) => {
  const { name, bio } = req.body;
  const authorId = req.params.authorId;
  await createSqlAuthor.updateAuthor(authorId, name, bio);
  res.redirect('/admin/authors'); // Redirect to authors page after editing
});

// Delete an author
router.post('/delete/:authorId', async (req, res) => {
  const authorId = req.params.authorId;
  await createSqlAuthor.deleteAuthor(authorId);
  res.redirect('/admin/authors'); // Redirect to authors page after deleting
});

export default router;
