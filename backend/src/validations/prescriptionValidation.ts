import {z} from 'zod'

export const prescriptionValidationSchema = z.object({
    patientId: z.string(),
    doctorId: z.string()
})