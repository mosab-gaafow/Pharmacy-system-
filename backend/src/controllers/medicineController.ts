import prisma from '../../prisma/client.ts';
import {Request, Response} from 'express';
import { medicineValidationSchema } from '../validations/medicineValidation.ts';


export const registerMedicine = async (req: Request, res: Response): Promise<void> => {
    try{

        const {name, description, categoryId, types, stock, expiration, price} = req.body;

        // Convert expiration string to Date object before validation
        const parsedExpiration = new Date(expiration);
        if (isNaN(parsedExpiration.getTime())) {
        res.status(400).json({ status: false, message: "Invalid expiration date" });
        return;
        }

        // Validate the data with Zod
        const validation = await medicineValidationSchema.safeParse({
        ...req.body,
        expiration: parsedExpiration, // Use the parsed Date object
        });

    if (!validation.success) {
      res.status(400).json({ status: false, message: "Invalid data", errors: validation.error.errors });
      return;
    }
        const isMedicineExists = await prisma.medicine.findFirst({where: {name: name.toLowerCase()}});
        if(isMedicineExists) {
            res.status(400).send({message: "No Medicine found with this Id..."});
            return;
        }

        

        const newMedicine = await prisma.medicine.create({
            data: {
                name: name.toLowerCase(),
                description,
                categoryId,
                types,
                stock,
                expiration :parsedExpiration,
                price,
            }
        });

        res.status(201).json({status: true, message: "Medicine registered successfully", data: newMedicine});


    }catch(e){
        console.log("error at registering medicine", e);
        res.status(500).send({ message: "Unknown Error", error: e });
    }
}




export const getAllMedicines = async(req:Request, res:Response) : Promise<void> => {

    try{

        const medicines = await prisma.medicine.findMany({
            include: {
                category: {
                    select: {
                        id: true,
                        name: true
                    },
                },
            },
        });
        if (medicines.length === 0) {
            res.status(404).json({ message: "No Medicines found" });
            return;
          }

         res.status(200).send(medicines);
         return

    }catch(e) {
        console.log("error at getting all medicines", e);
        res.status(500).send({ message: "Unknown Error", error: e });
    }
}

export const getMedicinesById = async (req:Request, res:Response) : Promise<void> => {
    try {

        const medicine = await prisma.medicine.findUnique({
            where: {
                id: req.params.id
            },
            include:{
                category:{
                    select:{
                        // id: true,
                        name: true
                    }
                }
            }
        });
        if(!medicine) {
            res.status(404).json({ message: "No Medicine found with this Id..." });
            return;
        }

        res.status(200).json(medicine);

    }catch(e){
        console.log("error at getting medicine by Id", e);
        res.status(500).send({ message: "Unknown Error", error: e });
    }
}

export const updateMedicine = async (req: Request, res: Response): Promise<void> => {
    try {

        const {name, description, categoryId, types, stock, expiration, price} = req.body;

        const existingMedicine  = await prisma.medicine.findUnique({where: {id: req.params.id}});
        if (!existingMedicine ) {
            console.log("No medicine found with id:", req.params.id);
            res.status(404).send({ message: "Medicine not found." });
            return; 
        }

        const duplicateMedicine = await prisma.medicine.findFirst({
            where: {
                name: name.toLowerCase(),
                NOT: {id: req.params.id}
            }
        });
        if(duplicateMedicine) {
            res.status(400).send({ message: "This Medicine Already Exists..." });
            return;
        }

        const parsedExpiration = new Date(expiration);
        if (isNaN(parsedExpiration.getTime())) {
        res.status(400).json({ status: false, message: "Invalid expiration date" });
        return;
        }

        const validation = medicineValidationSchema.safeParse({
        ...req.body,
        expiration: parsedExpiration, // Use the parsed Date object
        });

        if (!validation.success) {
            res.status(400).json({ status: false, message: "Invalid data", errors: validation.error.errors });
            return;
        }

        const updateMedicine = await prisma.medicine.update({where: {id: req.params.id}, data: {
            name: name.toLowerCase(),
            description,
            categoryId,
            types,
            stock,
            expiration: parsedExpiration,
            price,
        }});

        res.status(200).json({status: true, message: "Medicine updated successfully", data: updateMedicine});

    }catch(e){
        console.log("error at updating medicine", e);
        res.status(500).send({ message: "Unknown Error", error: e });
    }
}

export const deleteMedicine = async (req: Request, res: Response): Promise<void> => {
    try {

        const medicine = await prisma.medicine.findUnique({where: {id: req.params.id}});

        if(!medicine) {
            res.status(404).json({ message: "No Medicine found with this Id..." });
            return;
        }

        await prisma.medicine.delete({where: {id: req.params.id}});
        
        res.status(200).json({status: true, message: "Medicine deleted successfully"});

    }catch(e){
        console.log("error at deleting medicine", e);
        res.status(500).send({ message: "Unknown Error", error: e });
    }
}