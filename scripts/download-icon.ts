import fs from 'fs';

async function main() {
  const url = 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/2728.png';
  const res = await fetch(url);
  if (res.ok) {
    const buffer = await res.arrayBuffer();
    fs.writeFileSync('public/extension/icon.png', Buffer.from(buffer));
    console.log('Icon saved!');
  } else {
    console.error('Failed to download');
  }
}
main();
