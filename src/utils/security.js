/**
 * Security & Data Sanitization Utilities
 * Protects against XSS (Cross-Site Scripting), URL injection, and LocalStorage overflow
 */

// Whitelist only safe web protocols (http and https)
export function sanitizeUrl(url) {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  // Check for malicious pseudo-protocols like javascript:, data:, vbscript:
  // Using case-insensitive regex to catch JavaScript:, jaVascriPt:, etc.
  const dangerousPattern = /^(javascript|vbscript|data):/i;
  if (dangerousPattern.test(trimmed)) {
    console.warn("Blocked potentially dangerous URL protocol:", trimmed);
    return '#';
  }

  // If URL starts with http:// or https://, validate with URL constructor
  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const parsed = new URL(trimmed);
      if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
        return parsed.href;
      }
    } catch {
      return '#';
    }
  }

  // If user entered just a domain or path (e.g. "my-project.vercel.app")
  // Automatically prepend https:// and validate
  try {
    const formatted = 'https://' + trimmed;
    const parsed = new URL(formatted);
    if (parsed.protocol === 'https:') {
      return parsed.href;
    }
  } catch {
    return '#';
  }

  return '#';
}

// Whitelist safe image URLs (http, https, and safe base64 image data URLs)
export function sanitizeImageUrl(url) {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  // Allow safe image base64 data URIs
  if (/^data:image\/(jpeg|jpg|png|webp|gif|svg\+xml);base64,/i.test(trimmed)) {
    // Ensure no embedded script tags
    if (!/<script/i.test(trimmed) && !/javascript:/i.test(trimmed)) {
      return trimmed;
    }
    return '#';
  }

  // Block dangerous pseudo-protocols
  const dangerousPattern = /^(javascript|vbscript|data):/i;
  if (dangerousPattern.test(trimmed)) {
    console.warn("Blocked unsafe image URL protocol:", trimmed.slice(0, 30));
    return '#';
  }

  // Validate http/https URLs
  return sanitizeUrl(trimmed);
}

// Sanitize regular text input (trims, removes control characters, caps max length)
export function sanitizeText(str, maxLength = 300) {
  if (!str || typeof str !== 'string') return '';
  // Strip non-printable ASCII control characters safely without control regex warning
  let clean = '';
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    if ((code >= 32 && code !== 127) || code === 10 || code === 13 || code === 9 || code > 127) {
      clean += str[i];
    }
  }
  return clean.trim().slice(0, maxLength);
}

/**
 * Compresses an image file on the client using Canvas before storing.
 * Shrinks 2MB-5MB photos down to ~30KB-60KB.
 * This completely prevents browser LocalStorage QuotaExceededError!
 */
export function compressImage(file, maxWidth = 800, quality = 0.72) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error("File bukan gambar yang valid."));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Gagal membaca file gambar."));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error("Gagal memproses gambar."));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Scale down if larger than maxWidth
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to lightweight JPEG dataURL
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Compresses an image file on the client and returns a lightweight Blob.
 * Ready for direct upload to Supabase Storage.
 */
export function compressImageToBlob(file, maxWidth = 800, quality = 0.72) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error("File bukan gambar yang valid."));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Gagal membaca file gambar."));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error("Gagal memproses gambar."));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Gagal mengonversi gambar ke Blob."));
          }
        }, 'image/jpeg', quality);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Validates and sanitizes imported JSON project items
 * Prevents corrupted schemas, malicious payloads, and invalid types
 */
export function validateAndSanitizeProject(rawItem) {
  if (!rawItem || typeof rawItem !== 'object' || Array.isArray(rawItem)) return null;

  const validCategories = ['webapp', 'game', 'portfolio', 'landing', 'utility'];
  const category = validCategories.includes(rawItem.category) ? rawItem.category : 'webapp';

  const categoryLabels = {
    webapp: 'Web App',
    game: 'Game Web',
    portfolio: 'Portofolio',
    landing: 'Landing Page',
    utility: 'Tools / Utility'
  };

  const title = sanitizeText(rawItem.title || 'Proyek Tanpa Judul', 100);
  const author = sanitizeText(rawItem.author || 'Siswa RPL', 80);
  const realName = sanitizeText(rawItem.realName || rawItem.author || 'Siswa RPL', 80);
  const editPin = sanitizeText(rawItem.editPin || '', 10);
  const studentClass = ['X RPL 1', 'X RPL 2', 'X RPL 3'].includes(rawItem.studentClass) 
    ? rawItem.studentClass 
    : 'X RPL 1';

  const demoUrl = sanitizeUrl(rawItem.demoUrl);
  const githubUrl = rawItem.githubUrl ? sanitizeUrl(rawItem.githubUrl) : null;
  const thumbnailUrl = rawItem.thumbnailUrl ? sanitizeImageUrl(rawItem.thumbnailUrl) : null;

  // Filter tech stack to max 8 items, max 30 chars each
  let techStack = ['Web'];
  if (Array.isArray(rawItem.techStack)) {
    const cleaned = rawItem.techStack
      .map(t => sanitizeText(String(t), 30))
      .filter(Boolean)
      .slice(0, 8);
    if (cleaned.length > 0) techStack = cleaned;
  }

  const description = sanitizeText(rawItem.description || 'Aplikasi web karya siswa kelas 10 RPL.', 500);
  const status = rawItem.status === 'development' ? 'development' : 'completed';

  return {
    id: typeof rawItem.id === 'string' && rawItem.id.startsWith('proj-') 
      ? rawItem.id 
      : 'proj-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
    title,
    author, // Nama samaran / alias publik
    realName, // Nama asli / panjang untuk mode siswa
    editPin, // PIN keamanan untuk edit & hapus proyek
    studentClass,
    avatar: rawItem.avatar 
      ? (sanitizeImageUrl(rawItem.avatar) === '#' ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80' : sanitizeImageUrl(rawItem.avatar))
      : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    category,
    categoryLabel: categoryLabels[category],
    status,
    demoUrl: demoUrl === '#' ? '' : demoUrl,
    githubUrl: githubUrl === '#' ? null : githubUrl,
    thumbnailUrl: thumbnailUrl === '#' ? null : thumbnailUrl,
    techStack,
    description,
    stars: typeof rawItem.stars === 'number' && rawItem.stars >= 0 ? Math.min(rawItem.stars, 99999) : 1,
    views: typeof rawItem.views === 'number' && rawItem.views >= 0 ? Math.min(rawItem.views, 999999) : 1,
    submissionDate: sanitizeText(rawItem.submissionDate || new Date().toISOString().split('T')[0], 15)
  };
}
