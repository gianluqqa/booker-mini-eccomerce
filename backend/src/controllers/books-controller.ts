import { Request, Response } from "express";
import { getBooksService } from "../services/books-services";

export const getBooksController = async (req: Request, res: Response) => {
    try {
        const books = await getBooksService(req.query.q as string);
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};