import express from "express";
import { selectSql, createSql } from "../database/sql.js";
import cookieParser from "cookie-parser";

const router = express.Router();

// Middleware to parse cookies
router.use(cookieParser());

// Add book to the shopping basket
router.post("/basket/add", async (req, res) => {
  const { BookID } = req.body;
  const CustomerID = req.cookies.customer; // Retrieve CustomerID from cookies

  if (!CustomerID) {
    return res.status(400).send("Customer not logged in.");
  }

  try {
    // Check if the book is available
    const books = await selectSql.getBooks();
    const book = books.find((b) => b.BookID == BookID);

    console.log(books);
    

    if (book && book.AvailableQuantity > 0) {
      // Add to basket
      await createSql.addToBasket(CustomerID, BookID);
      res.redirect("/basket");
    } else {
      res.status(400).send("This book is not available.");
    }
  } catch (err) {
    console.error("Error adding to basket:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Get books in the shopping basket for the logged-in customer
router.get("/basket", async (req, res) => {
  const CustomerID = req.cookies.customer;

  if (!CustomerID) {
    return res.status(400).send("Customer not logged in.");
  }

  try {
    const basket = await selectSql.getBasket(CustomerID);
    res.render("basket", { basket });
  } catch (err) {
    console.error("Error fetching basket:", err);
    res.status(500).send("Internal Server Error");
  }
});
router.post("/basket/remove", async (req, res) => {
  const { BookID } = req.body;
  const CustomerID = req.cookies.customer;

  if (!CustomerID) return res.status(400).send("Customer not logged in.");
  try {
    await createSql.deleteFromBasket(CustomerID, BookID);
    res.redirect("/basket");
  } catch (err) {
    console.error("Error removing item:", err);
    res.status(500).send("Error removing item.");
  }
});


export default router;
