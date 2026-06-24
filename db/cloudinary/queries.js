const cloudinary = require('./pool');
const fs = require('fs/promises');

async function uploadImage(filePath, folderName) {
    const result = await cloudinary.uploader.upload(filePath, {
        folder: folderName,
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