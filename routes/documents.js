const express = require('express');
const router = express.Router();

const directory_name = "documents"

// 업로드 파일 저장 설정
let storage = (newFilename) => multer.diskStorage({
    destination: function (req, file, callback) {
        const FILES_PATH = path.join(process.env.UPLOADFILES_ROOT, directory_name);
        const FOLDER_PATH = path.join(process.cwd(), FILES_PATH);
        myUtils.mkdir(FOLDER_PATH);

        callback(null, FILES_PATH)
    }, filename: function (req, file, callback) {

        console.log(file);
        
        let extension = path.extname(file.originalname);
        let basename = path.basename(file.originalname, extension);
        let encoding = ""
        for (let i = 0; i < basename.length; i++) {
            encoding += basename.codePointAt(i).toString(16);
        }
        encoding = encoding.slice(0, 200);
        callback(null, req.res.locals.user.id + '-' + Date.now() + "-" + encoding + extension);
    },
});

// 미들웨어 등록
const upload = (newFilename) => multer({
    storage: storage(newFilename),
    // file size 제한(MB)
    limits: {
        fileSize: process.env.FILE_MAX_SIZE * 1024 * 1024,
    },
});

router.get('/:id', (req, res, next) => res.render('documents/detail'))
router.get('/', (req, res, next) => res.render('documents/index'))

module.exports = router;