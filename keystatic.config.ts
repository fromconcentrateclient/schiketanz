import { config, fields, collection } from '@keystatic/core';

// Check if we are running in production (Netlify) or local dev
const isProd = import.meta.env.PROD;

export default config({
  storage: isProd
    ? {
        // PRODUCTION: Use GitHub storage + Keystatic Cloud for Auth
        kind: 'github',
        repo: 'fromconcentrateclient/schiketanz',
      }
    : {
        // LOCAL: Use local file system
        kind: 'local',
      },
  // This connects your project to the Keystatic Cloud dashboard for Auth
  cloud: {
    project: 'schiketanz/schiketanz',
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