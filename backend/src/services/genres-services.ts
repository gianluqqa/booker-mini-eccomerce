import { AppDataSource } from "../config/data-source";
import { Genre } from "../entities/Genre";
import { GenresDto } from "../dto/GenresDto";

export const getAllGenresServices = async (): Promise<GenresDto[]> => {
    try {
        const genreRepository = AppDataSource.getRepository(Genre);
        const genres = await genreRepository.find();
        return genres;
    } catch (error) {
        console.error("Error getting genres:", error);
        throw new Error("No se pudieron obtener los géneros");
    }
}

