import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import Orphanage from '../models/Orphanage';
import View from '../views/orphanages_view';
import * as Yup from 'yup';

export default {
    async index(request: Request, response: Response) {
        const repository = getRepository(Orphanage);
        const results = await repository.find({
            relations: ['images']
        });
        return response.json(View.renderMany(results));
    },
    async create(request: Request, response: Response) {
        const {
            name,
            latitude,
            longitude,
            about,
            instructions,
            opening_hours,
            open_on_weekends
        } = request.body;
        const repository = getRepository(Orphanage);
        const requestImages = request.files as Express.Multer.File[];
        const images = requestImages.map(image => {
            return { path: image.filename }
        });
        const data = {
            name,
            latitude,
            longitude,
            about,
            instructions,
            opening_hours,
            open_on_weekends: open_on_weekends === 'true',
            images
        };
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            latitude: Yup.number().required(),
            longitude: Yup.number().required(),
            about: Yup.string().required().max(300),
            instructions: Yup.string().required(),
            opening_hours: Yup.string().required(),
            open_on_weekends: Yup.boolean().required(),
            images: Yup.array(Yup.object().shape({
                path: Yup.string().required()
            }))
        });
        await schema.validate(data, {
            abortEarly: false
        });
        const row = repository.create(data);

        await repository.save(row);

        return response.status(201).json(row);
    },
    async show(request: Request, response: Response) {
        const repository = getRepository(Orphanage);
        const row = await repository.findOne(request.params.id, {
            relations: ['images']
        });
        if (!row) {
            return response.status(404).json({ notFound: true });
        }
        return response.json(View.render(row));
    },
    async delete(request: Request, response: Response) {
        const repository = getRepository(Orphanage);
        const results = await repository.delete(request.params.id);
        return response.json({ ok: true });
    },
}
