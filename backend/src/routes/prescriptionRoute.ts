import express from 'express';
import { deletePrescription, getAllPrescriptions, getPrescriptionById, registerPrescription, updatePrescription } from '../controllers/prescriptionController.ts';

const prescriptionRoutes = express.Router();

prescriptionRoutes.post('/register-prescription', registerPrescription)
prescriptionRoutes.get('/get-all-prescriptions', getAllPrescriptions)
prescriptionRoutes.get('/get-prescriptionsById/:id', getPrescriptionById)
prescriptionRoutes.patch('/update-prescription/:id', updatePrescription)
prescriptionRoutes.delete('/delete-prescription/:id', deletePrescription)


export default prescriptionRoutes;
