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

// 생성
router.get('/add', (req, res, next) => res.render('documents/detail'));
router.post('/add', (req, res, next) => res.render('documents/detail'));

// 상세 조회
router.get('/:id', (req, res, next) => res.render('documents/detail'));

// 목록 조회
router.get('/', (req, res, next) => res.render('documents/index'));


////////////////////////////////////
//    관리자 로그인 필요한 곳      //
////////////////////////////////////

var createError = require('http-errors');

router
    .use(async (req, res, next) => {
        const user = res.locals.user;
        const base = req.baseUrl.split('/')[1];

        if (!(base == 'admin' && [100, 200].includes(user.user_type))) {
            return next(createError(404));
        }
    })

router.get('/edit/:id', (req, res, next) => res.render('documents/detail'))
router.get('/edit/:id', (req, res, next) => res.render('documents/detail'))
router.get('/edit/:id', (req, res, next) => res.render('documents/detail'))

module.exports = router;