import express from 'express';
import { deleteMedicine, getAllMedicines, getMedicinesById, registerMedicine, updateMedicine } from '../controllers/medicineController.ts';

const medicineRoutes = express.Router();

medicineRoutes.post('/register-medicine', registerMedicine);
medicineRoutes.get('/get-all-medicines', getAllMedicines);
medicineRoutes.get('/get-medicinesById/:id', getMedicinesById);
medicineRoutes.patch('/update-medicine/:id', updateMedicine);
medicineRoutes.delete('/delete-medicine/:id', deleteMedicine);

export default medicineRoutes;