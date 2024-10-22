import { Request, Response } from "express";
import prisma from '../../prisma/client.ts';
import { patientValidationSchema } from "../validations/patientValidations.ts";

export const registerPatient = async (req:Request, res:Response): Promise<void> => {
    try{

        const {name, ageInYears, ageInMonths, sex, phone} = req.body;

        const isPatientExists = await prisma.patient.findFirst({
            where: {
                OR: [
                    {name: name.toLowerCase()},
                    {phone: phone.toLowerCase()},
                ]
            }
        });

        if(isPatientExists?.name === name.toLowerCase()) {
            res.status(400).json({ status: false, message: "Patient with this name already exists" });
            return;
        }
        if(isPatientExists?.phone === phone) {
            res.status(400).json({ status: false, message: "Patient with this phone number already exists" });
            return;
        }

        const validation = patientValidationSchema.safeParse(req.body);

        // const intAgeInMonths = Math.floor(ageInMonths);
        const newPatient = await prisma.patient.create({
            data: {
                name: name.toLowerCase(),
                ageInYears,
                ageInMonths,
                sex,
                phone
            }
        });

        res.status(201).json({ status: true, message: "Patient registered successfully", patient: newPatient });
        

    }catch(e){
        console.log("error at registering patient", e);
        res.status(500).send({ message: "Unknown Error", error: e });
    }
}

export const getAllPatients = async(req: Request, res: Response): Promise<void> => {
    try{

        const getPatients = await prisma.patient.findMany();
        
        if (!getPatients || getPatients.length === 0) {
             res.status(404).send({ message: "Patients not found" });
             return; // Use 404 for not found
        }

         res.status(200).send(getPatients);
         return

    }catch(e) {
        console.log("error at getting all patients", e);
    res.status(500).send({ message: "Unknown Error", error: e });
       return;
    }
}

export const updatePatient = async(req:Request, res:Response): Promise<void>  => {

    try{

        const {name, ageInMonths, ageInYears, sex, phone} = req.body;
        const {id} = req.params;

        const isPatientExists = await prisma.patient.findUnique({where: {id: req.params.id}});
        if(!isPatientExists) {
             res.status(200).send({ message: "Patient with this Id Not found", status: 400});
        }

        const validation = patientValidationSchema.safeParse(req.body);;
        if(!validation.success) {
            res.status(400).json({ status: false, message: "Invalid data", errors: validation.error.errors });
            return; 
        }

        const isDuplicatePatient = await prisma.patient.findFirst({
            where: {
               OR: [
                {name: name.toLowerCase(), id:{ not:id} },
                {phone}
               ]
            }
        });

       
        if (isDuplicatePatient) {
            if (isDuplicatePatient.name === name.toLowerCase()) {
                 res.status(400).json({ status: false, message: "Patient with this name already exists." });
                 return
            }
            if (isDuplicatePatient.phone === phone) {
                 res.status(400).json({ status: false, message: "Patient with this phone number already exists." });
                 return
            }
        }

        const updatedPatients = await prisma.patient.update({
            where: {id: req.params.id},
            data: {
                name: name.toLowerCase(),
                ageInYears,
                ageInMonths,
                sex,
                phone
            }
        });

        res.status(200).json({ status: true, message: "Patient updated successfully", patient: updatedPatients });
        return

    }catch(e) {
        console.log("error at updating patient", e);
        res.status(500).send({ message: "Unknown Error", error: e });
    }
}


export const deletePatient = async (req: Request, res: Response): Promise<void> => {
    try {

        const {id} = req.params;
        
        const isPatientExists = await prisma.patient.findUnique({where: {id: req.params.id}});
        if(!isPatientExists){
            res.status(404).send({ message: "No Patient found with this Id.." });
            return;
        }

        await prisma.patient.delete({where: {id: req.params.id}});

        res.status(200).json({ status: true, message: "Patient deleted successfully" });

    }catch(e){
        console.log("error at deleting patient", e);
        res.status(500).send({ message: "Unknown Error", error: e });
    }
}

export const getPatientById = async (req: Request, res: Response): Promise<void> => {
    try{

        const getPatientById = await prisma.patient.findUnique({where: {id: req.params.id}});
        
        if (!getPatientById) {
             res.status(404).send({ message: "No Patient found with this Id.." });
             return; 
        }

         res.status(200).json(getPatientById);
         return

    }catch(e){
        console.log("error at getting patient by Id",e);
        res.status(400).send({ message: "Unknown Error", error: e });
    }
}