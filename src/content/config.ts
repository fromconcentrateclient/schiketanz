import { defineCollection, z } from 'astro:content';

const rentals = defineCollection({
    type: 'content',
    schema: ({ image }) => z.object({
        title: z.string(),
        // Validates the Keystatic conditional field structure
        vacancyStatus: z.discriminatedUnion('discriminant', [
            z.object({ discriminant: z.literal('occupied') }),
            z.object({ 
                discriminant: z.literal('vacant'), 
                value: z.array(z.object({
                    unitType: z.string(),
                    price: z.string()
                }))
            }),
        ]),
        address: z.object({
            street: z.string(),
            city: z.string(),
            province: z.string(),
            postalCode: z.string(),
        }),
        // cover image
        coverImage: image().optional(),        
        // iGuide Link: Optional string, validated as a URL
        iGuideUrl: z.string().url().optional(),
        // Gallery: Optional array of images
        // Structured specs are optional strings
        specs: z.object({
            stories: z.string().optional(),
            totalUnits: z.string().optional(),
            elevators: z.string().optional(),
            laundry: z.string().optional(),
            sqft: z.string().optional(),
            utilities: z.string().optional(),
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