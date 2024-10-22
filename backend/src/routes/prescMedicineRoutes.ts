import express from 'express';
import { deletePrescriptionMedicine, getAllPrescriptionsMedicine, getPrescriptionsMedicineById, registerMedicinePrescription, updatePrescriptionMedicine } from '../controllers/prescMedicineController.ts';

const prescriptionMedicineRoutes = express.Router();

prescriptionMedicineRoutes.post('/register-prescriptionMedicine', registerMedicinePrescription)
prescriptionMedicineRoutes.get('/get-all-prescriptionMedicines', getAllPrescriptionsMedicine)
prescriptionMedicineRoutes.get('/get-prescriptionMedicineById/:id', getPrescriptionsMedicineById)
prescriptionMedicineRoutes.patch('/update-prescriptionMedicine/:id', updatePrescriptionMedicine)
prescriptionMedicineRoutes.delete('/delete-prescriptionMedicine/:id', deletePrescriptionMedicine) 


export default prescriptionMedicineRoutes;