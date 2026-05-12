const cloudinary = require('cloudinary').v2;

// Configure if env present
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });
  } catch (err) {
    console.error('Cloudinary config error:', err && err.message);
  }
}

/**
 * Delete a Cloudinary image by URL or public id/path.
 * Accepts full CDN URL, or path like '/uploads/gli_actions/<id>' or 'gli_actions/<id>' or just publicId.
 * Returns { success: boolean, publicId?: string, error?: string }
 */
async function deleteImage(resource) {
  if (!resource) return { success: false, error: 'no resource' };

  let publicId = resource;

  try {
    const asStr = String(resource).trim();
    if (asStr.includes('res.cloudinary.com')) {
      // try to extract public id after '/upload/'
      const parts = asStr.split('/upload/');
      if (parts.length > 1) {
        publicId = parts[1];
      } else {
        publicId = asStr;
      }
    }

    // remove leading slashes and possible file extension
    publicId = publicId.replace(/^\/+/, '');
    // remove query string
    publicId = publicId.split('?')[0];
    // remove file extension if present
    publicId = publicId.replace(/\.(jpg|jpeg|png|webp|gif)$/i, '');

    // If stored under uploads/gli_actions/... ensure folder name used
    // Cloudinary public ids used by multer-storage-cloudinary include folder name gli_actions/<id>

    if (!cloudinary.config().cloud_name) {
      return { success: false, error: 'cloudinary not configured' };
    }

    const res = await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
    return { success: true, publicId, result: res };
  } catch (err) {
    return { success: false, publicId, error: err && err.message };
  }
}

module.exports = { deleteImage };
