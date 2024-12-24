// const multer = require("multer");
// const { GridFsStorage } = require("multer-gridfs-storage");

// const storage = new GridFsStorage({
//     url: 'mongodb://imeldaalexisjbaru:1Gh8Y4DxDNf8GB47@cluster0-shard-00-00.g70d8.mongodb.net:27017,cluster0-shard-00-01.g70d8.mongodb.net:27017,cluster0-shard-00-02.g70d8.mongodb.net:27017/chatAppRevisi?replicaSet=atlas-9d8ugm-shard-0&ssl=true&authSource=admin',
//     file: (req, file) => {
//         const match = ["image/png", "image/jpeg"];

//         if(match.indexOf(file.mimetype) === -1) {
//             const filename = `${Date.now()}-any-name-${file.originalname}`
//             return filename;
//         }

//         return{
//             bucketName: "photos",
//             filename: `${Date.now()}-any-name-${file.originalname}`
//         }
//     }
// });

// module.exports = multer({ storage })