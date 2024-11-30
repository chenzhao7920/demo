import { Router } from 'express';
import { searchLocation } from '../controllers/searchLocation'; // Adjust based on your actual function exports

export const locations = Router();

locations.get('/locations/search', searchLocation);

