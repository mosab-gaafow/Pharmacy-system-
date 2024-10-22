import {z} from 'zod';

export const userValidationSchema = z.object({
    name: z.string().min(4, "Name should be at least 4 characters").max(40, "Name should be at least 10 characters").toLowerCase(),
    phone: z.string().min(10, "Phone number should be at least 10 digits").max(15, "Phone number should be at most 15 digits"),
    email: z.string().email().toLowerCase(),
    password: z.string().min(6, "Password should be at least 6 characters").max(255, "Password should be at most 255 characters"),
    role: z.string(),

});



