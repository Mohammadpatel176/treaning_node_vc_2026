// const multer = require("multer");
// const path = require("path");

// const uploadPath = path.join(__dirname, '../../uploads');

// // create folder if not exists
// if (!fs.existsSync(uploadPath)) {
//     fs.mkdirSync(uploadPath, { recursive: true });
// }


// const storage = multer.diskStorage({
//     destination: function (req, file, cb){
//         cb(null,"../uploads/");
//     },
//     filename: function (req,file,cb){
//         const uniqueName = Date.now()+path.extname(file.originalname);
//         cb(null,uniqueName);
//     }
// });


// const upload = multer({
//     storage: storage
// })

// module.exports = upload;

const multer = require("multer");
const path = require("path");
const fs = require("fs"); // ✅ FIX 1

// absolute path
const uploadPath = path.join(__dirname, '../../uploads');

// create folder if not exists
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadPath); // 
    },
    filename: function (req, file, cb) {
        const uniqueName = Date.now() + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage: storage
});

module.exports = upload;