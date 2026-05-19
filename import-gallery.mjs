// script to pull all iGuide images at once
// open project root folder in command prompt, then run 
// node import-gallery.mjs https://youriguide.com/vEN92C3Z6V8DD1 bluebird-apartments
// but obviously swap out the iGuide in the middle and the slug for the apartment so they match

import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

async function processGallery(tourUrl, propertySlug) {
  try {
    console.log(`🌍 Fetching iGuide tour: ${tourUrl}`);
    const res = await fetch(tourUrl);
    const html = await res.text();
    // find hidden JSON array containing images in page source
    const imagesArrayMatch = html.match(/"images"\s*:\s*\[([\s\S]*?)\]/);
    if (!imagesArrayMatch) {
      console.error("❌ Could not find the images array in the iGuide page.");
      return;
    }
    // extract .jpg filenames from that block
    const imagesBlock = imagesArrayMatch[1];
    const filenameRegex = /"name"\s*:\s*"([^"]+\.jpg)"/g;
    const matches = [...imagesBlock.matchAll(filenameRegex)];
    const filenames = matches.map(m => m[1]);
    if (filenames.length === 0) {
      console.error("❌ No images found.");
      return;
    }
    console.log(`📸 Found ${filenames.length} images. Downloading & optimizing...`);
    // prepare URLs and local directories
    const urlObj = new URL(tourUrl);
    const tourId = urlObj.pathname.replace(/\//g, ''); // extracts vEN92C3Z6V8DD1
    const baseUrl = urlObj.origin; 
    const galleryDir = path.join(process.cwd(), 'src', 'content', 'rentals', propertySlug, 'gallery');
    await fs.mkdir(galleryDir, { recursive: true });
    // download, resize, and compress each image
    const galleryEntries = [];
    for (let i = 0; i < filenames.length; i++) {
      const filename = filenames[i];
      const imageUrl = `${baseUrl}/${tourId}/f/${filename}`;
      console.log(`   Processing ${i + 1}/${filenames.length}: ${filename}`);
      const imgRes = await fetch(imageUrl);
      if (!imgRes.ok) {
        console.warn(`   ⚠️ Failed to fetch ${imageUrl}`);
        continue;
      }
      const arrayBuffer = await imgRes.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      // compress to 1920x1080 webp
      const outputPath = path.join(galleryDir, `${i}.webp`);
      await sharp(buffer)
        .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(outputPath);
      galleryEntries.push(`  - gallery/${i}.webp`);
    }
    // safely update property's index.mdx frontmatter
    const mdxPath = path.join(process.cwd(), 'src', 'content', 'rentals', propertySlug, 'index.mdx');
    let mdxContent = await fs.readFile(mdxPath, 'utf8');
    const galleryYaml = `gallery:\n${galleryEntries.join('\n')}`;
    const galleryRegex = /^gallery:.*(?:\n\s+-.*)*/m;
    // split file to ensure we only target frontmatter block
    const parts = mdxContent.split('---');
    if (parts.length >= 3) {
      let frontmatter = parts[1];
      if (galleryRegex.test(frontmatter)) {
        // replace existing gallery: [] array
        parts[1] = frontmatter.replace(galleryRegex, galleryYaml);
      } else {
        // or append to bottom of frontmatter if it didn't exist
        parts[1] = frontmatter.replace(/\n$/, `\n${galleryYaml}\n`);
      }
      mdxContent = parts.join('---');
      await fs.writeFile(mdxPath, mdxContent, 'utf8');
      console.log(`\n✅ Successfully updated '${propertySlug}' frontmatter!`);
    }
  } catch (error) {
    console.error("❌ An error occurred:", error);
  }
}
// read arguments from terminal command
const tourUrl = process.argv[2];
const propertySlug = process.argv[3];
if (!tourUrl || !propertySlug) {
  console.log("Usage: node import-gallery.mjs <tour-url> <property-folder-name>");
  console.log("Example: node import-gallery.mjs https://youriguide.com/vEN92C3Z6V8DD1 bluebird-apartments");
  process.exit(1);
}

processGallery(tourUrl, propertySlug);