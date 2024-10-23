import connectDB from './config/db.ts';
import categoryRoutes from './routes/categoryRoutes.ts';
import medicineRoutes from './routes/medicineRoutes.ts';
import patientRoutes from './routes/patientRoutes.ts';
import userRoutes from './routes/userRoutes.ts';
import chalk from 'chalk';
import express, { Request, Response, NextFunction } from 'express';
import prescriptionRoutes from './routes/prescriptionRoute.ts';
import prescriptionMedicineRoutes from './routes/prescMedicineRoutes.ts';
import paymentsRoutes from './routes/paymentsRoutes.ts';
import diseaseRoutes from './routes/diseaseRoutes.ts';
import healthCheckRoutes from './routes/healthCheckRoutes.ts';

const PORT = process.env.PORT || 4000;

const app = express();
app.use(express.json()); // Make sure this line is present


// Middleware for error handling
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('Error Stack:', err.stack); // Log the error stack
    res.status(500).send({ message: 'Something went wrong!' });
});



// Routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/patients', patientRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/medicines',medicineRoutes);
app.use('/api/v1/prescriptions', prescriptionRoutes);
app.use('/api/v1/prescriptionMedicines', prescriptionMedicineRoutes);
app.use('/api/v1/payments', paymentsRoutes);
app.use('/api/v1/diseases', diseaseRoutes);
app.use('/api/v1/healthCheck', healthCheckRoutes);

// Connect to Database
connectDB();

// Start server
app.listen(PORT, () => {
    console.log(`${chalk.cyan.bold('Server is Running on Port: ')}${chalk.yellow.bold.italic(PORT)}`);
});
