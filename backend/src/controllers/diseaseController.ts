import { Request, Response } from "express";
import prisma from '../../prisma/client.ts';
import { z } from 'zod';
import { diseaseValidationSchema } from "../validations/diseaseValidation.ts";



export const registerDisease = async (req: Request, res: Response): Promise<void> => {
  try {
  

    const { name, signsAndEffects, healthCheckId } = req.body;

    const validationResult = diseaseValidationSchema.safeParse(req.body);
    if (!validationResult.success) {
      res.status(400).json({ error: validationResult.error.format() });
      return;
    }

    const isDiseaseExists = await prisma.disease.findFirst({where: {name: name.toLowerCase()}});
    if(isDiseaseExists) {
        res.status(400).json({ message: 'Disease with this name already exists' });
      return;
    };


    const newDisease = await prisma.disease.create({
      data: {
        name,
        signsAndEffects,
        healthCheckId
      },
    });

    res.status(201).json({ message: 'Disease created successfully', disease: newDisease });
  } catch (error) {
    console.error('Error creating disease:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
};
