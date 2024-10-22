import {z} from 'zod';

export const prescriptionMedicineValidationSchema = z.object({
    prescriptionId: z.string(),
    medicineId: z.string(),
    dosage: z.string(),
    duration: z.string(),
    quantity: z.number().positive().int(),
    instructions: z.string().optional()
});

