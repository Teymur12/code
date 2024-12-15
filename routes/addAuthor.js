import express from 'express';
import { createSqlAuthor } from '../database/sql.js';

const router = express.Router();

// GET: Show the form to add a new author
router.get('/authors/add', (req, res) => {
  res.render('addAuthor'); // Render the form for adding a new author
});

// POST: Handle the form submission and add a new author to the database
router.post('/authors/add', async (req, res) => {
  const { name, bio } = req.body;

  // Validate the input fields
  if (!name || !bio) {
    return res.status(400).send("All fields are required");
  }

  try {
    // Insert the new author into the database
    await createSqlAuthor.addAuthor(name, bio);
    res.redirect('/admin'); // Redirect to authors page after successful insertion
  } catch (err) {
    console.error("Error adding new author:", err);
    res.status(500).send("Error adding new author to the database");
  }
});

export default router;
