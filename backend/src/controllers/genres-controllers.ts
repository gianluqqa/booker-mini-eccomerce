import { Request, Response } from "express";
import { getAllGenresServices } from "../services/genres-services";

export const getAllGenresController = async (req: Request, res: Response) => {
    try {
        const genres = await getAllGenresServices();
        res.status(200).json(genres);
    } catch (error) {
        console.error("Error getting genres:", error);
        res.status(500).json({ error: "Could not get genres" });
    }
}
