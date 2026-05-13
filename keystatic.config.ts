// keystatic.config.ts
import { config, fields, collection } from '@keystatic/core';

export default config({
  storage: { kind: 'cloud' },
  cloud: { project: 'schiketanz/schiketanz' },
  collections: {
    rentals: collection({
      label: 'Rental Properties',
      slugField: 'title',
      path: 'src/content/rentals/*/',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ 
          name: { 
            label: 'Property Name',
            validation: { length: { min: 1 } }
          } 
        }),
        vacancyStatus: fields.conditional(
          fields.select({
            label: 'Availability',
            options: [
              { label: 'No Vacancy', value: 'occupied' },
              { label: 'Vacancies Available', value: 'vacant' },
            ],
            defaultValue: 'occupied'
          }),
          {
            occupied: fields.empty(),
            vacant: fields.array(
              fields.object({
                unitType: fields.text({ 
                  label: 'Unit Type',
                  description: 'e.g. "1 Bedroom", "2 Bedroom + Den"',
                  validation: { length: { min: 1 } }
                }),
                price: fields.text({ 
                  label: 'Starting Price',
                  description: 'e.g. "$1,200/month"',
                  validation: { length: { min: 1 } }
                }),
              }),
              { 
                label: 'Available Units', 
                itemLabel: (p) => p.fields.unitType.value || 'New Unit',
                validation: { length: { min: 1 } }
              }
            )
          }
        ),
        address: fields.object({
          street: fields.text({ 
            label: 'Street Address',
            validation: { length: { min: 1 } } 
          }),
          city: fields.text({ 
            label: 'City', 
            defaultValue: 'Kitchener',
            validation: { length: { min: 1 } } 
          }),
          province: fields.text({ 
            label: 'Province', 
            defaultValue: 'Ontario',
            validation: { length: { min: 1 } } 
          }),
          postalCode: fields.text({ 
            label: 'Postal Code',
            validation: { length: { min: 1 } } 
          }),
        }),
        // No directory/publicPath — Keystatic resolves images relative to each
        // entry's own subfolder automatically via the path: 'src/content/rentals/*/' pattern
        coverImage: fields.image({
          label: 'Building Photo',
        }),
        iGuideUrl: fields.url({ label: 'iGuide Tour URL' }),
        superintendent: fields.object({
          name: fields.text({ label: 'Superintendent Name' }),
          phone: fields.text({ label: 'Superintendent Phone Number' }),
          hours: fields.text({ label: 'Available Hours', description: 'e.g. 9 AM - 5 PM' }),
        }),
        specs: fields.object({
          stories: fields.text({ label: 'Stories' }),
          totalUnits: fields.text({ label: 'Number of Units' }),
          elevators: fields.text({ label: 'Elevators' }),
          laundry: fields.text({ label: 'Laundry', description: 'e.g. "On Each Floor", "On Site"' }),
          sqft: fields.text({ label: 'Unit Sq. Footage' }),
          utilities: fields.text({ label: 'Utilities Note', description: 'e.g. "Hydro and Parking are Extra"' }),
          pets: fields.select({
            label: 'Pet Policy',
            options: [
              { label: 'No Pets', value: 'No Pets' },
              { label: 'Pet Friendly', value: 'Pet Friendly' },
            ],
            defaultValue: 'No Pets'
          }),
          smoking: fields.select({
            label: 'Smoking Policy',
            options: [
              { label: 'No Smoking', value: 'No Smoking' },
              { label: 'Smoking Permitted', value: 'Smoking Permitted' },
            ],
            defaultValue: 'No Smoking'
          }),
        }),
        gallery: fields.array(
          fields.image({
            label: 'Gallery Image',
          }),
          { label: 'Property Photo Gallery' }
        ),
        content: fields.mdx({ label: 'Description & Amenities' }),
      },
    }),

    news: collection({
      label: 'News & Notices',
      slugField: 'title',
      path: 'src/content/news/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ 
          name: { 
            label: 'Title',
            validation: { length: { min: 1 } } 
          } 
        }),
        date: fields.date({ 
          label: 'Date Posted',
          validation: { isRequired: true } 
        }),
        content: fields.mdx({ label: 'Content' }),
      }
    })
  },
});