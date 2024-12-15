import express from 'express';
import { selectSql, createSql } from '../database/sql.js'; // Assuming these are exported from sql.js

const router = express.Router();

// Route to display the purchase page
router.get('/purchase', async (req, res) => {
    const CustomerID = req.cookies.customer;
  
    if (!CustomerID) {
      return res.status(400).send("Customer not logged in.");
    }
  
    try {
      const basket = await selectSql.getBasket(CustomerID);
  
      // Calculate total price for each item in the basket
      const basketWithTotal = basket.map(item => {
        item.TotalPrice = item.Price * item.Quantity; // Calculate total price
        return item;
      });
  
      res.render('purchase', { basket: basketWithTotal });
    } catch (err) {
      console.error("Error fetching basket:", err);
      res.status(500).send("Error fetching basket.");
    }
  });
  

// Route to confirm the purchase and store it in the database
router.post('/purchase/confirm', async (req, res) => {
    const CustomerID = req.cookies.customer; // Fetch CustomerID from cookies
  
    if (!CustomerID) {
      return res.status(400).send("Customer not logged in.");
    }
  
    try {
      const basket = await selectSql.getBasket(CustomerID); // Get basket items
  
      // Get the current date for the purchase date
      const purchaseDate = new Date();
  
      // Loop through the basket and insert each item into the Purchase table
      for (const item of basket) {
        const totalPrice = item.Price * item.Quantity; // Calculate total price
        await createSql.addToPurchase(CustomerID, item.BookID, purchaseDate, item.Quantity, totalPrice);
      }
  
      // Clear the basket after successful purchase
      await createSql.clearBasket(CustomerID);
  
      // Redirect to the success page
      res.redirect('/purchase/success');
    } catch (err) {
      console.error("Error confirming purchase:", err);
      res.status(500).send("Error confirming purchase.");
    }
  });
  

// Success page after purchase
router.get('/purchase/success', (req, res) => {
    res.render('purchaseSuccess');
  });
  
export default router;
