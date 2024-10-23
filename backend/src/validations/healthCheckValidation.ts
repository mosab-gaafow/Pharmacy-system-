import {z} from 'zod';

export const healthCheckValidationSchema = z.object({
    patientId: z.string(),
    labDoctorId:z.string(),
    signs: z.array(z.string()),
    diseases: z.array(z.string())
});



