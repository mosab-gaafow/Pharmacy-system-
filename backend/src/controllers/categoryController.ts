import { Request, Response } from "express"
import { categoryValidationSchema } from "../validations/categoryValidation.ts";

export const registerCategory = async (req:Request, res:Response): Promise<void> => {

    try{
        const {name} = req.body;

    const isCategoryExists = await prisma?.category.findFirst({where: {name: name.toLowerCase()}});

    if(isCategoryExists) {
        res.status(400).json({message: "Category already exists"});
        return;
    }

    const validation = categoryValidationSchema.safeParse(req.body);
    if(!validation.success) {
        res.status(400).json({status: false, message: "Invalid data", errors: validation.error.errors});
        return;
    }

    const newCategory = await prisma?.category.create({
        data:{
            name: name.toLowerCase(),
        }
    });
    res.status(201).json({status: true, message: "Category registered successfully", category: newCategory});


    }catch(e) {
        console.log("Error at registering category", e);
        res.status(500).send({ message: "Unknown Error", error: e });
    }


}

export const getCategoriesById = async (req:Request, res:Response): Promise<void> => {
    try {

        const categoryId = req.params.id;

        const category = await prisma?.category.findUnique({where: {id: categoryId}});
        if(!category) {
            res.status(404).send({ message: "Category not found with this Id"});
            return;
        }
        
        res.status(200).json(category);

    }catch(e){
        console.log("Error at getting category by Id", e);
        res.status(500).send({ message: "Unknown Error", error: e });
    }
}

export const getAllCategories = async (req:Request, res:Response): Promise<void> => {
    try{

        const categories = await prisma?.category.findMany();

        if(!categories) {
            res.status(404).send({ message: "No categories found"});
            return;
        }

        res.status(200).send(categories);

    }catch(e){
        console.log("Error at getting all categories", e);
        res.status(500).send({ message: "Unknown Error", error: e });
    }
}


export const updateCategory = async (req:Request, res:Response): Promise<void> => {
    try{

        const {name} = req.body;
        const categoryId = req.params.id;

        const validation = categoryValidationSchema.safeParse(req.body);
        if(!validation.success) {
            res.status(400).json({status: false, message: "Invalid data", errors: validation.error.errors});
            return;
        }

        const isCategoryExists = await prisma?.category.findUnique({where: {id: categoryId}});
        if(!isCategoryExists) {
            res.status(404).send({ message: "Category not found with this Id"});
            return;  
        }

        const duplicateCategory = await prisma?.category.findFirst({
            where: {
                name: name.toLowerCase(),
                NOT: {id: categoryId}
            }
        });

        if(duplicateCategory){
            res.status(400).json({message: "Category with this name already exists"});
            return;
        }

        const updateCategory = await prisma?.category.update({where: {id: categoryId}, data: {
            name: name.toLowerCase()
        }});

        res.status(200).json({status: true, message: "Category updated successfully", category: updateCategory});


    }catch(e) {
        console.log("Error at updating category", e);
        res.status(500).send({ message: "Unknown Error", error: e });
    }
}

export const deleteCategory = async (req:Request, res:Response): Promise<void> => {
    try{
        const category = await prisma?.category.findUnique({where: {id: req.params.id}});
        if(!category) {
            res.status(404).send({ message: "Category not found with this Id"});
            return;
        };

        await prisma?.category.delete({where: {id: req.params.id}});;
        res.status(200).json({status: true, message: "Category deleted successfully"});

    }catch(e){
        console.log("Error at deleting category", e);
        res.status(500).send({ message: "Unknown Error", error: e });
    }
}