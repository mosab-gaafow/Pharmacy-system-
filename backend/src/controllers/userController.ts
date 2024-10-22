import prisma from '../../prisma/client.ts';
import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { userValidationSchema } from '../validations/userValidations.ts';

export const RegisterUser = async (req: Request, res: Response): Promise<void> => {

    try {
        const { name, phone, email, password, role } = req.body;

        // Check if the user already exists
        const isUserExists = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: email.toLowerCase() },
                    { phone },
                    { name: name.toLowerCase() }
                ]
            }
        });

        const duplicateFields:string[] = [];

        if(isUserExists?.name === name.toLowerCase()) {
            duplicateFields.push('name');
        }
        if(isUserExists?.email === email.toLowerCase()){
            duplicateFields.push('email')
        }

        if(isUserExists?.phone === phone){
            duplicateFields.push('phone')
        }

        // If there are duplicate fields, return a 400 response

        if(duplicateFields.length > 0) {
            res.status(400).json({
                message: `These Fields already exists: ${duplicateFields.join(", ")}`,
                duplicateFields
            });

        }

        const validation = userValidationSchema.safeParse(req.body);
        if(!validation.success) {
            res.status(400).send({status: false, message: "Please Enter Valid data", errors: validation.error.format()});
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                name: name.toLowerCase(),
                phone,
                email: email.toLowerCase(),
                password: hashedPassword,
                role
            }
        });

        // Log the new user object for verification
        console.log("New user created:", newUser);

        // Return a successful response
         res.status(200).send(newUser);

    } catch (e: any) {
        console.error("Error at registering User", e); // Log the error
        res.status(500).send({ message: "Unknown Error", error: e.message }); // Return a 500 response
    }
};
// Ensure this exists

export const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, phone, email, password, role } = req.body;
        const { id } = req.params;

        const isUserExists = await prisma.user.findUnique({ where: { id } });
        if (!isUserExists) {
            console.log("No user found with id:", id);
            res.status(404).send({ message: "User not found." });
            return; 
        }

        const duplicateUser = await prisma.user.findFirst({
            where: {
                AND : [
                    {id: {not : id}},
                    {
                        OR: [
                            {name: name.toLowerCase()},
                            {email: email.toLowerCase()},
                            {phone}
                        ]
                    }
                ]
            }
        });

        if(duplicateUser) {
            const duplicateFields : string[] = [];
            if(duplicateUser.name === name.toLowerCase()) duplicateFields.push('name');
            if(duplicateUser.email === email.toLowerCase()) duplicateFields.push('email');
            if(duplicateUser.phone === phone) duplicateFields.push('phone');
        

        res.status(400).json({
            message: `The following fields already exists : ${duplicateFields.join(",")}`,
            duplicateFields
        })
    }

        // Validate the input data
        const validation = userValidationSchema.safeParse(req.body);
        if (!validation.success) {
            res.status(400).json({ status: false, message: "Invalid data", errors: validation.error.errors });
            return; 
        }

        const hashedPassword = password ? await  bcrypt.hash(password, 10) : isUserExists.password // hadi password cusub la so baasi waayo ki hore liska heesnaa

        // Proceed to update the user
        const updatedUser = await prisma.user.update({
            where: { id: req.params.id},
            data: {
                name: name.toLowerCase(),
                phone,
                email: email.toLowerCase(),
                password: hashedPassword,
                role,
            },
        });

        res.status(200).send(updatedUser);
    } catch (e) {
        console.error("Error at updating User", e);
        res.status(500).send({ message: "Unknown Error", error: e });
    }
};



export const getAllUsers = async (req: Request, res: Response) => {
    try{

        const getUsers = await prisma.user.findMany();
        if(!getUsers) {
             res.status(404).send({ message: "No User found"})
        } 
        
        res.status(200).send(getUsers);

    }catch(e){
        console.log("error at getting all users",e);
        res.status(500).send({ message: "Unknown Error", error: e });
    }
}

export const getUserById = async (req: Request, res: Response) => {
    try{

        const user = await prisma.user.findUnique({where: {id: req.params.id}});
        if(!user) {
            console.log("No user found with id:", req.params.id)
            res.status(404).send({ message: "User not found." });
        }

         res.status(200).send({message: user, status: 200});

    }catch(e){
        console.log("error at getting user by Id");
        res.status(500).send({ message: "Unknown Error", error: e });
    }
}

export const deleteUser = async (req:Request, res: Response): Promise<void> => {
    try{

        const deleteUser = await prisma.user.findUnique({where: {id: req.params.id}});
        if(!deleteUser) {
            console.log("No user found with id:", req.params.id)
            res.status(404).send({ message: "User not found." });
            return;
        }

        await prisma.user.delete({where: {id: req.params.id}});

        res.status(200).send({ message: "User deleted successfully", status: 200 });

    }catch(e) {

    }
}