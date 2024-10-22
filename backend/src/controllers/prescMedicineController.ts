
import { Response, Request } from "express";

import prisma from '../../prisma/client.ts';
import { prescriptionMedicineValidationSchema } from "../validations/prescMedicineValidation.ts";

// export const registerMedicinePrescription = async (req: Request, res: Response): Promise<void> => {
//     try{

//         const {prescriptionId, medicineId, dosage, duration, quantity, instructions} = req.body;

//         const isPrescriptionIdExists = await prisma.prescription.findUnique({where: {id: prescriptionId}});
//         if(!isPrescriptionIdExists) {
//             res.status(404).send({ message: "Prescription not found with this Id" });
//             return;
//         };

//         const isMedicineIdExists = await prisma.medicine.findUnique({where: {id: medicineId}});
//         if(!isMedicineIdExists) {
//             res.status(404).send({ message: "Medicine not found with this Id" });
//             return;
//         };

//         const isPrescriptionMedicineExists = await prisma.prescriptionMedicine.findFirst({where: {id: prescriptionId, medicineId}});
//         if(isPrescriptionMedicineExists) {
//             res.status(400).send({ message: "Medicine already prescribed for this prescription" });
//             return;
//         };

//         const validation = prescriptionMedicineValidationSchema.safeParse(req.body);
//         if(!validation.success) {
//             res.status(400).json({ status: false, message: "Invalid data", errors: validation.error.errors });
//             return;
//         };


//         const newPrescription = await prisma.prescriptionMedicine.create({
//             data:{
//                 prescriptionId,
//                 medicineId,
//                 dosage,
//                 duration,
//                 quantity,
//                 instructions
//             }
//         });

//         res.status(201).json(newPrescription);

//     }catch(e){
//         console.log("Error registering Prescription Medicine",e);
//         res.status(500).send({ message: "Unknown Error", error: e });
//     }
// }

export const registerMedicinePrescription = async (req: Request, res: Response): Promise<void> => {
    try {
      const { prescriptionId, medicineId, dosage, duration, quantity, instructions } = req.body;
  
      // Validate prescription and medicine IDs
      const isPrescriptionExists = await prisma.prescription.findUnique({ where: { id: prescriptionId } });
      if (!isPrescriptionExists) {
        res.status(404).send({ message: "Prescription not found with this ID" });
        return;
      }
  
      const isMedicineExists = await prisma.medicine.findUnique({ where: { id: medicineId } });
      if (!isMedicineExists) {
        res.status(404).send({ message: "Medicine not found with this ID" });
        return;
      }
  
      // Check for duplicate entries
      const isPrescriptionMedicineExists = await prisma.prescriptionMedicine.findFirst({
        where: { prescriptionId, medicineId },
      });
      if (isPrescriptionMedicineExists) {
        res.status(400).send({ message: "Medicine already prescribed for this prescription" });
        return;
      }
  
      // Create the PrescriptionMedicine entry
      const newPrescriptionMedicine = await prisma.prescriptionMedicine.create({
        data: {
          prescriptionId,
          medicineId,
          dosage,
          duration,
          quantity,
          instructions,
        },
      });
  
      res.status(201).json(newPrescriptionMedicine);
    } catch (e) {
      console.log("Error registering Prescription Medicine", e);
      res.status(500).send({ message: "Unknown Error", error: e });
    }
  };
  

export const getAllPrescriptionsMedicine = async (req: Request, res: Response) : Promise<void> => {
    try{

        const prescriptionMedicines = await prisma.prescriptionMedicine.findMany({
            include: {
                prescription: {
                    select: {
                        patient: {
                            select: {
                                name: true,
                                ageInYears: true,
                                ageInMonths: true,
                                sex: true
                            }
                        }
                    }
                },
                medicine: {
                    select:{
                        name: true,
                        category:{
                            select: {
                                name: true
                            }
                        },
                        types: true,
                        stock: true,
                        price:true
                    }
                }
            }
        });

       if(prescriptionMedicines.length === 0) {
        res.status(404).send({ message: "No Prescriptions Medicines found" , data: []});
        return;  
       }

        res.status(200).json(prescriptionMedicines);

    }catch(e){
        console.log("Error getting all Prescriptions Medicine", e);
        res.status(500).send({ message: "Unknown Error", error: e });
    }
}

export const getPrescriptionsMedicineById = async (req: Request, res: Response) : Promise<void> => {
    try{

        const prescriptionMedicine = await prisma.prescriptionMedicine.findUnique({
            where: {id: req.params.id},
            include:{
                prescription: {
                    select: {
                        id: true,
                        patient: {
                            select:{
                                name: true,
                                ageInYears: true,
                                ageInMonths: true,
                                sex: true
                            }
                        },
                    }
                },
                medicine:{
                    select:{
                        id: true,
                        name: true,
                        category:{
                            select:{
                            name: true
                            }
                        },
                        types: true,
                        stock: true,
                        price:true
                    }
                }
            }
        });

        if(!prescriptionMedicine){
            res.status(404).send({ message: "Prescription Medicine not found with this Id" });
            return;
        }

        res.status(200).json(prescriptionMedicine);
       

    }catch(e){
        console.log("Error getting Prescription Medicine by Id", e);
        res.status(500).send({ message: "Unknown Error", error: e });
    }
}

export const updatePrescriptionMedicine = async (req: Request, res: Response) : Promise<void> => {
    try {
      const { prescriptionId, medicineId, dosage, duration, quantity, instructions } = req.body;
      const prescriptionMedicineId = req.params.id;
  
      // Validate prescription and medicine IDs
      const isPrescriptionExists = await prisma.prescription.findUnique({ where: { id: prescriptionId } });
      if (!isPrescriptionExists) {
        res.status(404).send({ message: "Prescription not found with this ID" });
        return;
      }
  
      const isMedicineExists = await prisma.medicine.findUnique({ where: { id: medicineId } });
      if (!isMedicineExists) {
        res.status(404).send({ message: "Medicine not found with this ID" });
        return;
      }
  
      // Check for duplicate entries (excluding current record)
      const isPrescriptionMedicineExists = await prisma.prescriptionMedicine.findFirst({
        where: {
          prescriptionId,
          medicineId,
          id: { not: prescriptionMedicineId },
        },
      });
      if (isPrescriptionMedicineExists) {
        res.status(400).send({ message: "Medicine already prescribed for this prescription" });
        return;
      }
  
      // Update the PrescriptionMedicine entry
      const updatedPrescriptionMedicine = await prisma.prescriptionMedicine.update({
        where: { id: prescriptionMedicineId },
        data: {
          prescriptionId,
          medicineId,
          dosage,
          duration,
          quantity,
          instructions,
        },
      });
  
      res.status(200).json(updatedPrescriptionMedicine);
    } catch (e) {
      console.log("Error updating Prescription Medicine", e);
      res.status(500).send({ message: "Unknown Error", error: e });
    }
  };
  

  export const deletePrescriptionMedicine = async (req: Request, res: Response): Promise<void> => {
    try {

        const prescriptionMedicineId = req.params.id;

        const prescriptionMedicine = await prisma.prescriptionMedicine.findUnique({
            where: { id: prescriptionMedicineId }
        });

        if (!prescriptionMedicine) {
            res.status(404).json({ message: "Prescription Medicine not found with this ID" });
            return;
        }

        await prisma.prescriptionMedicine.delete({
            where: { id: prescriptionMedicineId }
        });

        res.status(200).json({ message: "Prescription Medicine deleted successfully" });
    } catch (e) {
        console.error("Error deleting Prescription Medicine", e);
        res.status(500).json({ message: "Unknown Error", error: e });
    }
};
