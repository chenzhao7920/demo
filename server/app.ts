import express from 'express';
import cors from 'cors';
import multer from 'multer'
import route from "./src/controllers/routes/index.js"
const multerStorage = multer.memoryStorage();
const multerUpload = multer({ storage: multerStorage });

const app = express();
app.use(express.json()); // Middleware to parse JSON request bodies

// Test route
app.get('/', (req:any, res:any) => {
    res.json({ message: "healthy" });
});

app.use(route);

// Use the routes
app.use(cors());


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
