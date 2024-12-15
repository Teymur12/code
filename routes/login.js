import cookieParser from "cookie-parser";
import express from "express";
import expressSession from 'express-session';
import { selectSql } from "../database/sql.js";

const router = express.Router();


router.use(cookieParser());
router.use(expressSession({
    secret: 'dilab',
    resave: true,
    saveUninitialized: true,
}))

router.get('/', (req, res) => {
    if (req.cookies.customer) {
        res.render('books', { 
            'customer': req.cookies.customer,
        });
    } else {
        res.render('login');
    }
});

router.get('/logout', (req, res) => {
    if (req.cookies.user) {
        res.clearCookie('customer')
        res.redirect("/");
    } else {
        res.redirect("/");
    }
})

router.post('/', async (req, res) => {
    const vars = req.body;
    const customers = await selectSql.getCustomers();
    var whoAmI = 1;
    let checkLogin = false;

 
    const customer = customers.find((c) => c.Name === vars.name && c.PasswordHash === vars.password);

if (customer) {
    checkLogin = true;
    whoAmI = customer.CustomerID;
}

    if (checkLogin) {
        res.cookie('customer', whoAmI, {
            expires: new Date(Date.now() + 3600000), 
            httpOnly: true
        })
        res.redirect('/book');
    } else {
        res.redirect('/');
        
    }
})

export default router;