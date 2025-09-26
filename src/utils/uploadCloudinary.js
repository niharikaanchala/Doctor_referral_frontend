const upload_preset = import.meta.env.VITE_UPLOAD_PRESET;
const cloud_name = import.meta.env.VITE_CLOUD_NAME; // Fixed parameter name

const uploadImageToCloudinary = async (file) => {
    const uploadData = new FormData();
    uploadData.append('file', file);
    uploadData.append('upload_preset', upload_preset);
    uploadData.append('cloud_name', cloud_name); // Correct parameter name

    try {
        const res = await fetch(
            `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
            {
                method: 'post',
                body: uploadData,
            }
        );

        if (!res.ok) {
            throw new Error('Upload failed');
        }

        const data = await res.json();
        return {
            url: data.secure_url,
            public_id: data.public_id
        };

    } catch (error) {
        console.error('Upload error:', error);
        throw error;
    }
};

export default uploadImageToCloudinary;