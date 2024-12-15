import cookieParser from "cookie-parser";
import express from "express";
import expressSession from 'express-session';
import { selectSql } from "../database/sql.js";

const router = express.Router();

router.use(cookieParser());
router.use(expressSession({
    secret: 'adminsecretkey', // Secret key for session management
    resave: true,
    saveUninitialized: true,
}));

// Admin login page
router.get('/login', (req, res) => {
    if (req.cookies.admin) {
        res.redirect('/admin/dashboard'); // Redirect to admin dashboard if already logged in
    } else {
        res.render('adminLogin'); // Render login page if not logged in
    }
});

// Admin login process (POST)
router.post('/login', async (req, res) => {
    const vars = req.body;
    const admins = await selectSql.getAdmins(); // Fetch all admins from the database
    let checkLogin = false;
    let adminID = null;

    // Find admin by username and password
    const admin = admins.find((a) => a.Username === vars.username && a.Password === vars.password);

    if (admin) {
        checkLogin = true;
        adminID = admin.AdminID;
    }

    if (checkLogin) {
        // If login successful, store admin ID in cookies
        res.cookie('admin', adminID, {
            expires: new Date(Date.now() + 3600000), // 1 hour expiration
            httpOnly: true,
        });
        res.redirect('/admin/dashboard'); // Redirect to the admin dashboard
    } else {
        res.redirect('/admin/login'); // Redirect to login page if credentials are incorrect
    }
});

// Admin logout
router.get('/logout', (req, res) => {
    if (req.cookies.admin) {
        res.clearCookie('admin'); // Clear the admin session cookie
        res.redirect('/admin/login'); // Redirect to login page after logout
    } else {
        res.redirect('/admin/login'); // Redirect to login page if no session exists
    }
});

// Admin dashboard (only accessible after login)
router.get('/dashboard', (req, res) => {
    if (req.cookies.admin) {
        // Render admin dashboard if admin is logged in
        res.render('adminDashboard', { adminID: req.cookies.admin });
    } else {
        res.redirect('/admin/login'); // Redirect to login if not logged in
    }
});

export default router;
