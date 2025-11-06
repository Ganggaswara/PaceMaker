export default function getImageUrl(imgPath) {
  // Kembalikan string kosong agar tidak mem-bypass ke null pada atribut src
  if (!imgPath) return "";

  const path = String(imgPath).trim();
  if (!path) return "";

  // Full URL dari seeder atau CDN
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  // Jika sudah absolute path, kembalikan apa adanya
  if (path.startsWith("/")) {
    return path;
  }

  // Jika path hasil upload ke disk 'public' Laravel (ex: products/xxx.png)
  if (path.startsWith("products/")) {
    return "/storage/" + path;
  }

  // Jika sudah mengandung prefix storage tanpa leading slash
  if (path.startsWith("storage/")) {
    return "/" + path;
  }

  // Default: jadikan relative dari root publik
  return "/" + path.replace(/^\//, "");
}



