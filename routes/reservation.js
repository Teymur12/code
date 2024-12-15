import express from "express";
const router = express.Router();
import { createSql, selectSql } from "../database/sql.js";

router.post("/reservation", async (req, res) => {
  const CustomerID = req.cookies.customer;

  if (!CustomerID) {
    return res.status(400).send("Customer not logged in.");
  }

  try {
    // Fetch the basket data for the customer
    const basket = await selectSql.getBasket(CustomerID);

    if (!basket.length) {
      return res.status(400).send("Your basket is empty.");
    }

    res.render("reservation", { basket });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading reservation page.");
  }
});

// Confirm Reservation Route
router.post("/reservation/confirm", async (req, res) => {
  const CustomerID = req.cookies.customer;

  if (!CustomerID) {
    return res.status(400).send("Customer not logged in.");
  }

  try {
    const basket = await selectSql.getBasket(CustomerID);
    console.log(basket);
    

    const pickupDate = new Date();
    pickupDate.setDate(pickupDate.getDate() + 15); 
    

    // Insert basket items into reservation table
    for (const item of basket) {
      await createSql.addToReservation(CustomerID, item.BookID, pickupDate);
    }
    
    // Clear the customer's basket after reserving
    await createSql.clearBasket(CustomerID);

    res.redirect("/reservation/success");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error confirming reservation.");
  }
});

router.get("/reservation/success", (req, res) => {
  res.send("Reservation successfully made. Pickup in 2 days.");
});

export default router;
