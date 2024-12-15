import express from 'express';
import { createSqlAward } from '../database/sql.js';

const router = express.Router();

// Get all awards
router.get('/', async (req, res) => {
  const awards = await createSqlAward.getAwards();
  res.render('adminAwards', { awards });
});

// Add a new award (GET form)
router.get('/add', (req, res) => {
  res.render('addAward'); // Render form for adding a new award
});

// Add a new award (POST form)
router.post('/add', async (req, res) => {
  const { name, description } = req.body;
  await createSqlAward.addAward(name, description);
  res.redirect('/admin/awards'); // Redirect to awards page after adding
});

// Edit an award (GET form)
router.get('/edit/:awardId', async (req, res) => {
  const awardId = req.params.awardId;
  const award = await createSqlAward.getAwardById(awardId);
  res.render('editAward', { award });
});

// Edit an award (POST form)
router.post('/edit/:awardId', async (req, res) => {
  const { name, description } = req.body;
  const awardId = req.params.awardId;
  await createSqlAward.updateAward(awardId, name, description);
  res.redirect('/admin/awards'); // Redirect to awards page after editing
});

// Delete an award
router.post('/delete/:awardId', async (req, res) => {
  const awardId = req.params.awardId;
  await createSqlAward.deleteAward(awardId);
  res.redirect('/admin/awards'); // Redirect to awards page after deleting
});

export default router;
