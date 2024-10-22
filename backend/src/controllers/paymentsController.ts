import { Request, Response } from "express";
import prisma from '../../prisma/client.ts';
import { paymentValidationSchema } from "../validations/paymentsValidation.ts";

// Register Payment
export const registerPayment = async (req: Request, res: Response): Promise<void> => {
    try {
        const { patientId, prescriptionId, amount, status } = req.body;

        // Validate the input using Zod
        const validationResult = paymentValidationSchema.safeParse(req.body);
        if (!validationResult.success) {
            res.status(400).json({
                error: validationResult.error.format()
            });
            return;
        }

        // Check if the patient exists
        const isPatientIdExists = await prisma.patient.findUnique({ where: { id: patientId } });
        if (!isPatientIdExists) {
            res.status(404).send({ message: "Patient not found with this Id" });
            return;
        }

        // Check if the prescription exists
        const isPrescriptionIdExists = await prisma.prescription.findUnique({ where: { id: prescriptionId } });
        if (!isPrescriptionIdExists) {
            res.status(404).send({ message: "Prescription not found with this Id" });
            return;
        }

        // Check if a payment already exists for this prescription
        const existingPayment = await prisma.payment.findUnique({
            where: { prescriptionId }
        });
        if (existingPayment) {
            res.status(400).send("Payment already exists for this prescription.");
            return;
        }

        // Create the payment if it doesn't already exist
        const payment = await prisma.payment.create({
            data: {
                patientId,
                prescriptionId,
                amount,
                status,
            },
        });

        res.status(201).json(payment);

    } catch (error) {
        console.error('Error creating payment:', error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
};

// Get all payments
export const getAllPayments = async (req: Request, res: Response): Promise<void> => {
    try {
        const payments = await prisma.payment.findMany({
            include: {
                patient: {
                    select: {
                        name: true,
                        phone: true,
                        ageInYears: true,
                        ageInMonths: true,
                        sex: true,
                    },
                },
                prescription: {
                    select: {
                        medicines: true,
                    },
                },
            },
        });

        res.status(200).send(payments);

    } catch (e) {
        console.log("Error at getting all payments", e);
        res.status(500).send({ message: "Unknown Error", error: e });
    }
};

// Get payment by ID
export const getPaymentById = async (req: Request, res: Response): Promise<void> => {
    try {
        const payment = await prisma.payment.findUnique({
            where: { id: req.params.id },
            include: {
                patient: {
                    select: {
                        name: true,
                        phone: true,
                        ageInYears: true,
                        ageInMonths: true,
                        sex: true,
                    },
                },
                prescription: {
                    select: {
                        medicines: true,
                    },
                },
            },
        });

        if (!payment) {
            res.status(404).send({ message: "Payment not found" });
            return;
        }

        res.status(200).send(payment);

    } catch (e) {
        console.log("Error at getting payment by id", e);
        res.status(500).send({ message: "Unknown Error", error: e });
    }
};

// Update Payment
export const updatePayment = async (req: Request, res: Response): Promise<void> => {
    try {
        const { patientId, prescriptionId, amount, status } = req.body;
        const paymentId = req.params.id;

        // Validate input using Zod
        const validationResult = paymentValidationSchema.safeParse(req.body);
        if (!validationResult.success) {
            res.status(400).json({
                error: validationResult.error.format()
            });
            return;
        }

        // Check if the patient exists
        const isPatientIdExists = await prisma.patient.findUnique({ where: { id: patientId } });
        if (!isPatientIdExists) {
            res.status(404).send({ message: "Patient not found with this Id" });
            return;
        }

        // Check if the prescription exists
        const isPrescriptionIdExists = await prisma.prescription.findUnique({ where: { id: prescriptionId } });
        if (!isPrescriptionIdExists) {
            res.status(404).send({ message: "Prescription not found with this Id" });
            return;
        }

        // Check if another payment exists for this prescription during the update
        const existingPayment = await prisma.payment.findUnique({
            where: { prescriptionId },
        });

        if (existingPayment && existingPayment.id !== paymentId) {
            res.status(400).send("Another payment already exists for this prescription.");
            return;
        }

        // Update the payment
        const payment = await prisma.payment.update({
            where: { id: paymentId },
            data: {
                patientId,
                prescriptionId,
                amount,
                status,
            },
        });

        res.status(200).send(payment);

    } catch (e) {
        console.log("Error at updating payment", e);
        res.status(500).send({ message: "Unknown Error", error: e });
    }
};

export const deletePayment = async (req: Request, res: Response): Promise<void> => {
    try{

        const paymentId = req.params.id;
        const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
        if(!payment){
            res.status(404).send({ message: "Payment not found with this Id" });
            return;
        }

        await prisma.payment.delete({ where: { id: paymentId } });

        res.status(200).send({ message: "Payment deleted successfully" });

    }catch(e){
        console.log("error at deleting payment", e);
        res.status(500).send({ message: "Unknown Error", error: e });
    }
}
