import {z} from 'zod';

export const diseaseValidationSchema = z.object({
    name: z.string().min(3,"Disease name should be at least 3 characters").nonempty("Disease name is required"),
    description: z.string().min(6,"Disease description should be at least 6 characters").optional(),
  signsAndEffects: z.array(z.string()).nonempty("At least one sign or effect is required"),
})


