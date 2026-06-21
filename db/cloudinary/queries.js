const cloudinary = require('./pool');
const fs = require('fs/promises');

async function uploadImage(filePath) {
    const result = await cloudinary.uploader.upload(filePath, {
        folder: 'pokemon',
        use_filename: true,
        unique_filename: true,
    });

    try {
        await fs.unlink(filePath);
    } catch (err) {
        console.warn('Failed to delete temp upload file:', err.message);
    }

    return result.secure_url;
}

module.exports = {
    uploadImage,
};