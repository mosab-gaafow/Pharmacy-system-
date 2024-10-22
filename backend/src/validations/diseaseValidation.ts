import {z} from 'zod';

export const diseaseValidationSchema = z.object({
    name: z.string().min(4, "Disease name should be at least 4 characters").max(100, "Disease name should be at least 4 characters"),
    signsAndEffects: z.array(z.string()).optional(),
    healthCheckId: z.string()
})


