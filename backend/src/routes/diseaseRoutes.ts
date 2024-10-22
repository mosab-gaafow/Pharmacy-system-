import express from 'express';
import { registerDisease } from '../controllers/diseaseController.ts';

export const diseaseRoutes = express.Router();

diseaseRoutes.post('/register-disease', registerDisease);

export default diseaseRoutes;



