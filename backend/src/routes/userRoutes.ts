import express from 'express';
import { deleteUser, getAllUsers, getUserById, RegisterUser, updateUser } from '../controllers/userController.ts';
 // Ensure this points to the correct file

const userRoutes = express.Router();

userRoutes.post('/register-user', RegisterUser);
userRoutes.get('/get-all-users', getAllUsers);
userRoutes.get('/get-userById/:id', getUserById);
userRoutes.put('/update-user/:id', updateUser); // No change needed here
userRoutes.delete('/delete-user/:id', deleteUser);

export default userRoutes;
