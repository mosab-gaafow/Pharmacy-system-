import { Response, Request } from "express";
import { healthCheckValidationSchema } from "../validations/healthCheckValidation.ts";
import prisma from '../../prisma/client.ts'


export const registerHealthCheck = async (req: Request, res: Response): Promise<void> => {
    try{

        const {patientId, labDoctorId, signs, diseases} = req.body;


    const validationResult = healthCheckValidationSchema.safeParse(req.body);
    if (!validationResult.success) {
      res.status(400).json({ error: validationResult.error.format() });
      return;
    }

    const isPatientIdExists = await prisma.patient.findUnique({where: {id: patientId}});
    if(!isPatientIdExists) {
        res.status(400).send({ message: "Patient not found with this Id" });
        return;
    };

   const isLabDoctor  = await prisma.user.findUnique({where: {id: labDoctorId}, select:{
    role: true
   }});

   if(!isLabDoctor ) {
    res.status(400).send({ message: "Lab Doctor not found with this Id" });
    return;
   }

   if(isLabDoctor.role !== 'Lab_Doctor') {
        res.status(400).send({ message: "only Lab Doctor is allowed to be inserted"});
        return;
   };

   const validDiseases = await prisma.disease.findMany({
    where: { id: { in: diseases } },
  });
  
  if (validDiseases.length !== diseases.length) {
    res.status(400).send({ message: "One or more diseases not found" });
    return;
  }


    // const isHealthCheckExists = await prisma.healthCheck.findUnique({where: {id: id}})
    const newHealthCheck = await prisma.$transaction(async (prisma) => {
        return prisma.healthCheck.create({
            data: {
                patientId,
                labDoctorId,
                signs,
                diseases: {
                    create: diseases.map((diseaseId: string) => ({
                        disease: {
                            connect: { id: diseaseId }
                        }
                    }))
                }
            },
            include: {
                diseases: true, // To return the associated diseases in the response
            }
        });
    });

    res.status(201).send(newHealthCheck);

    }catch(e){
        console.log("error at registering health check", e);
        res.status(500).send({ message: "Unknown Error", error: e });
    }
}

export const getAllHealthChecks = async (req: Request, res: Response): Promise<void> => {
    try {
        const healthChecks = await prisma.healthCheck.findMany({
            include: {
                diseases: true, // Include associated diseases in the response
                patient: true,   // Include patient info (optional)
                labDoctor: true   // Include lab doctor info (optional)
            }
        });

        if(healthChecks.length === 0) {
            res.status(400).send({ message: "No Health Checks found" });
            return;  
        }

        res.status(200).json(healthChecks);

    } catch (e) {
        console.error("Error fetching health checks:", e);
        res.status(500).send({ message: "Unknown Error", error: e });
    }
}


export const getHealthCheckById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    
    try {
        const healthCheck = await prisma.healthCheck.findUnique({
            where: { id },
            include: {
                diseases: true, // Include associated diseases
                patient: {
                    select:{
                        name: true,
                        sex: true
                    }
                },   // Include patient info (optional)
                labDoctor: {
                    select:{
                        name: true
                    }
                }  // Include lab doctor info (optional)
            }
        });

        if (!healthCheck) {
            res.status(400).send({ message: "Health Check not found" });
            return
        }

        res.status(200).json(healthCheck);
    } catch (e) {
        console.error("Error fetching health check by ID:", e);
        res.status(500).send({ message: "Unknown Error", error: e });
    }
}


export const updateHealthCheck = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { patientId, labDoctorId, signs, diseases } = req.body;

    try {
        // Validation with Zod schema
        const validationResult = healthCheckValidationSchema.safeParse(req.body);
        if (!validationResult.success) {
            res.status(400).json({ error: validationResult.error.format() });
            return;
        }

        // Check if health check exists
        const existingHealthCheck = await prisma.healthCheck.findUnique({ where: { id } });
        if (!existingHealthCheck) {
            res.status(400).send({ message: "Health Check not found" });
            return;
        }

        // Validate patient existence
        const isPatientIdExists = await prisma.patient.findUnique({ where: { id: patientId } });
        if (!isPatientIdExists) {
            res.status(400).send({ message: "Patient not found with this ID" });
            return;
        }

        // Validate lab doctor and check their role
        const isLabDoctor = await prisma.user.findUnique({
            where: { id: labDoctorId },
            select: { role: true }
        });

        if (!isLabDoctor) {
            res.status(400).send({ message: "Lab Doctor not found with this ID" });
            return;
        }

        if (isLabDoctor.role !== 'Lab_Doctor') {
            res.status(400).send({ message: "Only a Lab Doctor can be assigned to a health check" });
            return;
        }

        // Validate diseases
        const validDiseases = await prisma.disease.findMany({
            where: { id: { in: diseases } },
        });

        if (validDiseases.length !== diseases.length) {
            res.status(400).send({ message: "One or more diseases not found" });
            return;
        }

        // Update health check and diseases associations
        const updatedHealthCheck = await prisma.healthCheck.update({
            where: { id },
            data: {
                patientId,
                labDoctorId,
                signs,
                diseases: {
                    // Disconnect diseases that are not in the update request
                    deleteMany: {
                        healthCheckId: id, // Deletes all associations
                    },
                    // Reconnect the new disease associations
                    create: diseases.map((diseaseId: string) => ({
                        disease: {
                            connect: { id: diseaseId }
                        }
                    }))
                }
            },
            include: {
                diseases: true, // Include updated diseases in the response
            }
        });

        res.status(200).json(updatedHealthCheck);

    } catch (e) {
        console.error("Error updating health check:", e);
        res.status(500).send({ message: "Unknown Error", error: e });
    }
};


export const deleteHealthCheck = async (req: Request, res: Response): Promise<void> => {

    try {
        // Validate existence of the health check
        const existingHealthCheck = await prisma.healthCheck.findUnique({ where: { id: req.params.id } });
        if (!existingHealthCheck) {
            res.status(400).send({ message: "Health Check not found" });
            return
        }

        await prisma.healthCheck.delete({
            where: { id: req.params.id }
        });

        res.status(200).send("health check deleted successfully"); // No content to send back on successful deletion
    } catch (e) {
        console.error("Error deleting health check:", e);
        res.status(500).send({ message: "Unknown Error", error: e });
    }
};

