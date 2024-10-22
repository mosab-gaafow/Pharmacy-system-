import { z } from 'zod';

export const patientValidationSchema = z.object({
    name: z.string().min(4, "Patient name must be at least 4 characters").max(50, "Patient name must be at least 50 characters").toLowerCase(),
    ageInYears: z.number().int().min(0, "Age in years must be at least 0").optional(),
    ageInMonths: z.number().min(0, "Age in months must be at least 0").max(11, "Age in months must be less than 12").optional(), // Removed .int()
    sex: z.string(),
    phone: z.string().min(10, "Phone must be at least 10 characters").max(15, "Phone must be at most 15 characters"),
});
