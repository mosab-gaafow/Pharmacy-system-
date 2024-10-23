import express from 'express';
import { deleteDisease, getAllDiseases, getDiseaseById, registerDisease, updateDisease } from '../controllers/diseaseController.ts';

export const diseaseRoutes = express.Router();

diseaseRoutes.post('/register-disease', registerDisease);
diseaseRoutes.get('/get-all-diseases', getAllDiseases);
diseaseRoutes.get('/get-diseaseById/:id', getDiseaseById)
diseaseRoutes.patch('/update-disease/:id', updateDisease)
diseaseRoutes.delete('/delete-disease/:id', deleteDisease)

export default diseaseRoutes;



