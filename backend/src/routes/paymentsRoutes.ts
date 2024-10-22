import express from 'express';
import { deletePayment, getAllPayments, getPaymentById, registerPayment, updatePayment } from '../controllers/paymentsController.ts';

const paymentsRoutes = express.Router();

paymentsRoutes.post('/register-payment', registerPayment);
paymentsRoutes.get('/get-all-payments',getAllPayments);
paymentsRoutes.get('/get-paymentsById/:id',getPaymentById);
paymentsRoutes.patch('/update-payment/:id', updatePayment)
paymentsRoutes.delete('/delete-payment/:id', deletePayment)

export default paymentsRoutes;
