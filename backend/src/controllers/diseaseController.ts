import { Request, Response } from "express";
import prisma from '../../prisma/client.ts';
import { z } from 'zod';
import { diseaseValidationSchema } from "../validations/diseaseValidation.ts";



export const registerDisease = async (req: Request, res: Response): Promise<void> => {
  try {
  

    const { name, signsAndEffects, description } = req.body;

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
        name: name.toLowerCase(),
        description,
        signsAndEffects
        // healthCheckId
      },
    });

    res.status(201).json({ message: 'Disease created successfully', disease: newDisease });
  } catch (error) {
    console.error('Error creating disease:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
};


export const getAllDiseases  =  async (req: Request, res: Response): Promise<void> => {
    try{

      const diseases = await prisma.disease.findMany();

      if(diseases.length === 0) {
        res.status(404).send({ message: "No Diseases found" });
        return;
      }

      res.status(200).send(diseases);


    }catch(e){
      console.log("error at getting all diseases", e);
      res.status(500).send({ message: "Unknown Error", error: e });
    }
}

export const getDiseaseById = async (req: Request, res: Response): Promise<void> => {
    try{

      const disease = await prisma.disease.findUnique({where: {id: req.params.id}});
      
      if(!disease) {
        res.status(404).send({ message: "Disease not found with this Id.." });
        return;
      };

      res.status(200).send(disease);

    }catch(e){
      console.log("error at getting disease by id", e);
      res.status(500).send({ message: "Unknown Error", error: e });
    }
}
export const updateDisease = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, signsAndEffects, description } = req.body;

    // Validate the input data using your Zod schema
    const validationResult = diseaseValidationSchema.safeParse(req.body);
    if (!validationResult.success) {
      res.status(400).json({ error: validationResult.error.format() });
      return;
    }

    // Check if the disease exists by ID
    const disease = await prisma.disease.findUnique({
      where: { id },
    });

    if (!disease) {
      res.status(404).json({ message: 'Disease not found with this Id' });
      return;
    }

    // Check if another disease with the same name exists (excluding current one)
    const isDiseaseExists = await prisma.disease.findFirst({
      where: {
        name: name.toLowerCase(),
        NOT: { id }
      }
    });

    if (isDiseaseExists) {
      res.status(400).json({ message: 'Another disease with this name already exists' });
      return;
    }

    // Update the disease record
    const updatedDisease = await prisma.disease.update({
      where: { id },
      data: {
        name: name.toLowerCase(),
        description,
        signsAndEffects
      }
    });

    res.status(200).json({ message: 'Disease updated successfully', disease: updatedDisease });
  } catch (error) {
    console.error('Error updating disease:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
};


export const deleteDisease = async (req: Request, res: Response): Promise<void> => {
  try{

      
      const disease = await prisma.disease.findUnique({where: {id: req.params.id}});
      
      if(!disease) {
        res.status(404).json({ message: "Disease not found with this Id" });
        return;
      }
      
      await prisma.disease.delete({where: {id: req.params.id}});
      
      res.status(200).json({ status: true, message: "Disease deleted successfully" });

    }catch(e){
      console.log("error at deleting disease", e);
      res.status(500).send({ message: "Unknown Error", error: e });
    }
}
