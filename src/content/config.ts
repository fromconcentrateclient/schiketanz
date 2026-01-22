import { defineCollection, z } from 'astro:content';

const rentals = defineCollection({
    type: 'content',
    schema: ({ image }) => z.object({
        title: z.string(),
        vacancyStatus: z.enum(['occupied', 'vacant', 'waitlist']),
        address: z.string(),
        // cover image
        coverImage: image().optional(),        
        // iGuide Link: Optional string, validated as a URL
        iGuideUrl: z.string().url().optional(),
        // Gallery: Optional array of images
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