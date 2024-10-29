const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function uploadImage(file) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "products",
        public_id: file.originalname ? file.originalname.split('.')[0] : undefined,
      },
      (error, result) => {
        if (error) {
          console.error("Upload error:", error); 
          reject(error);
        } else {
        //   console.log("Upload successful:", result);  
          resolve(result);
        }
      }
    );

    // console.log("Uploading file:", file.originalname, "Buffer length:", file.buffer.length);

    uploadStream.end(file.buffer);
  });
}

module.exports = { uploadImage };
