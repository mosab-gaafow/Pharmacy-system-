import { z } from 'zod';

export const medicineValidationSchema = z.object({
    name: z.string().min(3, "Medicine name should be at least 2 characters").max(100, "Medicine name should not exceed 100 characters"),
    description: z.string().optional(),
    categoryId: z.string(),
    types: z.array(
        z.enum(["Tablet", "Syrup", "Injection", "Ointment", "Capsule"])
      ).nonempty("At least one type must be selected"), // Assuming the category ID is required
    stock: z.number().nonnegative("Stock cannot be negative"), // Ensure stock is a non-negative number
    expiration: z.date().refine(date => date > new Date(), "Expiration date must be in the future"), // Validate expiration date
    price: z.number().positive("Price must be greater than zero").refine(val => val % 1 !== 0 || val < 100000, "Price must be a valid float value"), // Ensure price is positive and allows for float values
});
