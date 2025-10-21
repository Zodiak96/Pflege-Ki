/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',            // erzeugt statische Seite in /out
  images: { unoptimized: true } // falls next/image genutzt wird
};
module.exports = nextConfig;
