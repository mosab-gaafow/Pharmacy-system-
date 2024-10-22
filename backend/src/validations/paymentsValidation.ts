import { z } from 'zod';

export const paymentValidationSchema = z.object({
  patientId: z.string().min(1, "Patient ID is required"),  // Check if not empty
  prescriptionId: z.string().min(1, "Prescription ID is required"),  // Check if not empty
  amount: z.number().positive("Amount must be a positive number"),  // Positive number validation
  status: z.string()
});
