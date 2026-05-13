// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const rentals = defineCollection({
    type: 'content',
    schema: ({ image }) => z.object({
        title: z.string(),
        vacancyStatus: z.discriminatedUnion('discriminant', [
            z.object({ discriminant: z.literal('occupied') }),
            z.object({ 
                discriminant: z.literal('vacant'), 
                value: z.array(z.object({
                    unitType: z.string(),
                    price: z.string()
                })).min(1)
            }),
        ]),
        address: z.object({
            street: z.string(),
            city: z.string(),
            province: z.string(),
            postalCode: z.string(),
        }),
        coverImage: image().optional(),        
        iGuideUrl: z.string().url().or(z.literal('')).optional(),
        superintendent: z.object({
            name: z.string().optional(),
            phone: z.string().optional(),
            hours: z.string().optional(),
        }).optional(),
        specs: z.object({
            stories: z.string().optional(),
            totalUnits: z.string().optional(),
            elevators: z.string().optional(),
            laundry: z.string().optional(),
            sqft: z.string().optional(),
            utilities: z.string().optional(),
            // Locked to the exact values Keystatic's select fields produce
            pets: z.enum(['No Pets', 'Pet Friendly']).optional(),
            smoking: z.enum(['No Smoking', 'Smoking Permitted']).optional(),
        }).optional(),
        gallery: z.array(image()).optional(),
    }),
});

const news = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        date: z.coerce.date(),
    }),
});

export const collections = { rentals, news };