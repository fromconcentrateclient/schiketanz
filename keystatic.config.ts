import { config, fields, collection } from '@keystatic/core';

const isLocal = process.env.NODE_ENV === 'development' || !process.env.NETLIFY;

export default config({
  storage: isLocal ? { kind: 'local' } : { kind: 'cloud' },
  cloud: {
    project: 'fromconcentrateclien/schiketanz',
  },
  collections: {
    rentals: collection({
      label: 'Rental Properties',
      slugField: 'title',
      path: 'src/content/rentals/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Property Name/Address' } }),
        // Binary Vacancy Status with conditional fields for pricing
        vacancyStatus: fields.conditional(
          fields.select({
            label: 'Availability',
            description: 'Is there currently space available in this building?',
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
                unitType: fields.text({ label: 'Unit Type (e.g. 2 Bedroom)' }),
                price: fields.text({ label: 'Starting Price (e.g. $1850.00 + Hydro)' }),
              }),
              {
                label: 'Available Units',
                itemLabel: (props) => props.fields.unitType.value || 'New Unit Listing',
              }
            )
          }
        ),
        address: fields.object({
          street: fields.text({ label: 'Street Address (e.g. 195 Natchez Rd.)' }),
          city: fields.text({ label: 'City', defaultValue: 'Kitchener' }),
          province: fields.text({ label: 'Province', defaultValue: 'Ontario' }),
          postalCode: fields.text({ label: 'Postal Code' }),
        }),
        coverImage: fields.image({
          label: 'Building Photo',
          directory: 'src/assets/rentals', 
          publicPath: '../../assets/rentals/', 
        }),
        iGuideUrl: fields.url({
          label: 'iGuide Virtual Tour URL',
          description: 'If this property has an iGuide/3D tour, paste the link here.',
        }),

        // Structured specs that will only show if filled out
        specs: fields.object({
          stories: fields.text({ label: 'Stories (e.g. 9)' }),
          totalUnits: fields.text({ label: 'Number of Units' }),
          elevators: fields.text({ label: 'Elevators' }),
          laundry: fields.text({ label: 'Laundry (e.g. On-site)' }),
          sqft: fields.text({ label: 'Unit Sq. Footage' }),
          utilities: fields.text({ label: 'Utilities Note (e.g. Rent includes utilities)' }),
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