import express from 'express';
import prisma from '../../prisma/client.ts';
import { deleteCategory, getAllCategories, getCategoriesById, registerCategory, updateCategory } from '../controllers/categoryController.ts';


const categoryRoutes = express.Router();

categoryRoutes.post('/register-category', registerCategory)
categoryRoutes.get('/get-all-categories', getAllCategories);
categoryRoutes.get('/get-categorybyId/:id', getCategoriesById);
categoryRoutes.patch('/update-category/:id', updateCategory);
categoryRoutes.delete('/delete-category/:id', deleteCategory);
export default categoryRoutes;
