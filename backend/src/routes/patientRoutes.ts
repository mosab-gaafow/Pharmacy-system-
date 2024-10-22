import express from 'express';
import { deletePatient, getAllPatients, getPatientById, registerPatient, updatePatient } from '../controllers/patientController.ts';

const patientRoutes = express.Router();

patientRoutes.post('/register-patient', registerPatient);
patientRoutes.get('/get-all-patients', getAllPatients);
patientRoutes.patch('/update-patient/:id', updatePatient);
patientRoutes.get('/get-patientById/:id', getPatientById);
patientRoutes.delete('/delete-patient/:id', deletePatient);
export default patientRoutes;
