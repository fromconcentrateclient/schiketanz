import { config, fields, collection } from '@keystatic/core';

export default config({
  storage: {
    kind: 'local', // local for dev. in production swap to:
 // kind: 'github', repo: 'fromconcentrate/schiketanz' }
  },
  
  collections: {
    rentals: collection({
    label: 'Rental Properties',
    slugField: 'title',
    path: 'src/content/rentals/*',
    format: { contentField: 'content' },
    schema: {
        title: fields.slug({ name: { label: 'Property Name/Address' } }),

        vacancyStatus: fields.select({
            label: 'Vacancy Status',
            description: 'This determines what shows on the website.',
            options: [
                { label: 'No Vacancy', value: 'occupied' },
                { label: 'Vacancies Available', value: 'vacant' },
                { label: 'Waitlist Open', value: 'waitlist' }
            ],
            defaultValue: 'occupied'
        }),

        address: fields.text({ label: 'Full Address' }),
        
        coverImage: fields.image({
            label: 'Building Photo',
            directory: 'src/assets/rentals', 
            publicPath: '../../assets/rentals/', 
        }),

        iGuideUrl: fields.url({
            label: 'iGuide Virtual Tour URL',
            description: 'If this property has an iGuide/3D tour, paste the link here.',
        }),

        gallery: fields.array(
            fields.image({
                label: 'Gallery Image',
                directory: 'src/assets/rentals', 
                publicPath: '../../assets/rentals/',
            }),
            {
                label: 'Property Photo Gallery',
                itemLabel: (props) => 'Photo',
            }
        ),

        content: fields.mdx({
            label: 'Description & Amenities',
        }),
    },
  }),

    // News / Notices (middle column on homepage)
    news: collection({
        label: 'News & Notices',
        slugField: 'title',
        path: 'src/content/news/*',
        format: { contentField: 'content' },
        schema: {
            title: fields.slug({ name: { label: 'Title' } }),
            date: fields.date({ label: 'Date Posted' }),
            content: fields.mdx({
                label: 'Content',
            }),
        }
    })
  },
});