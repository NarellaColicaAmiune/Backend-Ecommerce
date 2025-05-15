import {z} from 'zod';

const createProductSchema = z.object({
    name: z.string(),
    description: z.string(),
    price: z.number(),
    stock: z.number(),
    category: z.string(),
    availability: z.boolean()
})

export default createProductSchema;