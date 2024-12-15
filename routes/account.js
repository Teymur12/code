import express from "express";
const router = express.Router();
import { selectSql } from "../database/sql.js";

router.get("/account", async (req, res) => {
    const CustomerID = req.cookies.customer;
  
    if (!CustomerID) return res.status(400).send("Customer not logged in.");
  
    try {
      const customerDetails = await selectSql.getCustomerDetails(CustomerID);
      const reservations = await selectSql.getReservations(CustomerID);
      const purchases = await selectSql.getPurchases(CustomerID);
  
      res.render("account", {
        customerDetails,
        reservations,
        purchases,
      });
    } catch (error) {
      console.error("Error fetching account details:", error);
      res.status(500).send("Error loading account details.");
    }
  });
  

  export default router;