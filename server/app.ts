import express from 'express';
import cors from 'cors';
import route from "./src/routes/index.js"

const app = express();
app.use(express.json()); // Middleware to parse JSON request bodies

// Test route
app.get('/', (req:any, res:any) => {
    res.json({ message: "healthy" });
});
app.get('/api/v1/locations', (req:any, res:any) => {
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
