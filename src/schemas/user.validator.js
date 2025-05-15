import {z} from 'zod';

const createUserSchema = z.object({
    first_name: z.string(),
    last_name: z.string(),
    email: z.string(),
    age: z.number(),
    password: z.string(),
})

export default createUserSchema; 