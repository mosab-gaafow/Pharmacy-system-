import express from 'express';
import { deleteHealthCheck, getAllHealthChecks, getHealthCheckById, registerHealthCheck, updateHealthCheck } from '../controllers/healthCheckControllers.ts';

const healthCheckRoutes = express.Router();

healthCheckRoutes.post('/register-healthCheck', registerHealthCheck)
healthCheckRoutes.get('/get-all-healthChecks', getAllHealthChecks);
healthCheckRoutes.get('/get-healthCheckById/:id', getHealthCheckById);
healthCheckRoutes.patch('/update-healthCheck/:id', updateHealthCheck);
healthCheckRoutes.delete('/delete-healthCheck/:id', deleteHealthCheck);


export default healthCheckRoutes
