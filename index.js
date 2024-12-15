import express from "express";
import logger from "morgan";
import path from "path";
import liveReload from 'livereload';
import connectLiveReload from 'connect-livereload';
import { fileURLToPath } from "url";
import winston from 'winston';
import fs from 'fs'; // Import fs to check directory and create logs folder
import winstonDailyRotateFile from 'winston-daily-rotate-file'; // Import winston-daily-rotate-file

// Import routes
import loginRouter from "./routes/login.js";
import accountRouter from "./routes/account.js";
import bookRouter from './routes/book.js';
import basketRouter from './routes/basket.js';
import reservationRouter from './routes/reservation.js';
import purchaseRouter from './routes/purchase.js';
import adminLoginRouter from './routes/adminLogin.js';
import adminBookRouter from './routes/adminBooks.js';
import adminAuthorRouter from './routes/adminAuthors.js';
import adminAwardsRouter from './routes/adminAwards.js';
import addAdminRouter from './routes/addAuthor.js';

const PORT = 8001;

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up live reload
const liveReloadServer = liveReload.createServer(); 
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh('/');
  }, 100)
});

const app = express();

// Create log folder if it doesn't exist
const logDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Set up the logger (Winston) with daily log rotation
const loggerTransport = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
    new winstonDailyRotateFile({
      filename: path.join(logDir, 'requests-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',  // Date format for the log file
      maxFiles: '14d',  // Retain logs for 14 days (optional)
    })
  ]
});

// Use morgan to log HTTP requests and pipe it into winston
app.use(logger('dev')); // Console log for development

// Use winston for more detailed logs (requests and errors)
app.use((req, res, next) => {
  loggerTransport.info(`${req.method} ${req.url}`); // Log HTTP method and URL
  next();
});

// Enable live reload for development
app.use(connectLiveReload());

// Middleware to handle form data and JSON
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Set up views and public directory
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, 'public')));

// Use all the routes for the app
app.use("/", loginRouter);
app.use('/', bookRouter);
app.use('/', basketRouter);
app.use('/', reservationRouter);
app.use("/", accountRouter);
app.use("/", purchaseRouter);
app.use('/admin', adminLoginRouter);
app.use('/admin', adminBookRouter);
app.use('/admin', adminAuthorRouter);
app.use('/admin', adminAwardsRouter);
app.use('/admin', addAdminRouter);

// Handle errors with a general error handler (optional)
app.use((err, req, res, next) => {
  loggerTransport.error(`Error: ${err.message}`);
  res.status(500).send("Something went wrong!");
});

// Start the server
app.listen(PORT, () => {
  loggerTransport.info(`Server is running at http://localhost:${PORT}`);
});
