import {z} from 'zod';

export const categoryValidationSchema = z.object({
    name: z.string().min(4, "category name should be at least 4 characters").max(100, "category name should be at least 4 characters"),
    // medicines: z.array(z.string()).optional()
});


