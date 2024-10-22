import { Response, Request } from "express"
import prisma from '../../prisma/client.ts';
import { prescriptionValidationSchema } from "../validations/prescriptionValidation.ts";


export const registerPrescription = async (req: Request, res: Response) : Promise<void> => {

    try{

        const {patientId, doctorId, status} = req.body;

        const isPatientExists = await prisma.patient.findUnique({where: {id: patientId}});
        if(!isPatientExists) {
            res.status(404).send({ message: "Patient not found with this Id" });
            return;
        }

        const isDoctorExists = await prisma.user.findUnique({where: {id: doctorId}});
        if(!isDoctorExists) {
            res.status(404).send({ message: "Doctor not found with this Id" });
            return;
        }

       

        const newPrescription = await prisma.prescription.create({
            data:{
                patientId,
                doctorId,
                status
                // medicines: []
            }
        });

        res.status(201).json(newPrescription);

    }catch(e){
        console.log("Error at registering prescription", e);
        res.status(500).send({ message: "Unknown Error", error: e });
    }

}

export const getAllPrescriptions = async (req: Request, res: Response): Promise<void> => {

    try{

        const prescriptions = await prisma.prescription.findMany({
            include: {
                patient:{
                    select:{
                        name: true,
                        ageInYears: true,
                        ageInMonths: true,
                        sex: true,
                        phone:true
                    }
                },
                doctor: {
                    select:{
                        name: true,
                        phone: true
                    }
                }
            }
        });

        if(!prescriptions) {
            res.status(404).send({ message: "No prescriptions found" });
            return;
        }

        res.status(200).json(prescriptions);

    }catch(e){
        console.log("Error at getting all prescriptions", e);
        res.status(500).send({ message: "Unknown Error", error: e });
    }

}

export const getPrescriptionById = async (req: Request, res: Response): Promise<void> => {

    try{

        const prescriptionId = req.params.id;

        const prescription = await prisma.prescription.findUnique({where: {id: prescriptionId}, 
        include: {
            patient:{
                select:{
                    name: true,
                    ageInYears: true,
                    ageInMonths: true,
                    sex: true,
                    phone:true
                }
            },
            doctor: {
                select:{
                    name: true,
                    phone: true
                }
            },
            
        }
        });
        if(!prescription) {
            res.status(404).send({ message: "Prescription not found with this Id" });
            return;
        };
        
        res.status(200).json(prescription);

    }catch(e){
        console.log("Error at getting prescription by id", e);
        res.status(500).send({ message: "Unknown Error", error: e });
    }
}

export const updatePrescription = async (req: Request, res: Response): Promise<void> => {
    try{

        const {patientId, doctorId, status} = req.body;
        const prescriptionId = req.params.id;

        const isPrescriptionExists = await prisma.prescription.findUnique({where: {id: req.params.id}});
        if(!isPrescriptionExists) {
            res.status(404).send({ message: "Prescription not found with this Id" });
            return;
        }

        const validation = prescriptionValidationSchema.safeParse(req.body);
        if(!validation.success) {
            res.status(400).json({ status: false, message: "Invalid data", errors: validation.error.errors });
            return;
        };

        const isPatientExists = await prisma.patient.findUnique({where: {id: patientId}});
        if(!isPatientExists) {
            res.status(404).send({ message: "Patient not found with this Id" });
            return;
        }

        const isDoctorExists = await prisma.user.findUnique({where: {id: doctorId}});
        if(!isDoctorExists) {
            res.status(404).send({ message: "Doctor not found with this Id" });
            return;
        }

        const updatedPrescription = await prisma.prescription.update({where: {id: req.params.id}, data: {
            patientId,
            doctorId,
            status
            // medicines: []
        }});

        res.status(200).json(updatedPrescription);
        

    }catch(e){
        console.log("Error at updating prescription", e);
        res.status(500).send({ message: "Unknown Error", error: e });
    }
}

export const deletePrescription = async (req: Request, res: Response): Promise<void> => {
    try{

        const prescriptionId = req.params.id;

        const isPrescriptionExists = await prisma.prescription.findUnique({where: {id: req.params.id}});
        if(!isPrescriptionExists) {
            res.status(404).send({ message: "Prescription not found with this Id" });
            return;
        }

        await prisma.prescription.delete({where: {id: req.params.id}});
        
        res.status(200).json({ status: true, message: "Prescription deleted successfully" });

    }catch(e){
        console.log("Error at deleting prescription", e);
        res.status(500).send({ message: "Unknown Error", error: e });
    }
}