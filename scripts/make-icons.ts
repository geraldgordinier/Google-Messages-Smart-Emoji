import fs from 'fs';
import sharp from 'sharp';

async function main() {
  const url = 'https://raw.githubusercontent.com/googlefonts/noto-emoji/main/png/512/emoji_u2728.png';
  console.log(`Downloading ${url}...`);
  const res = await fetch(url);
  
  if (!res.ok) {
    console.error('Failed to download');
    return;
  }
  
  const buffer = await res.arrayBuffer();
  const imgBuffer = Buffer.from(buffer);
  
  const sizes = [16, 48, 128];
  
  for (const size of sizes) {
    await sharp(imgBuffer)
      .resize(size, size)
      .png()
      .toFile(`public/extension/icon${size}.png`);
    console.log(`Created icon${size}.png`);
  }
}

main().catch(console.error);
