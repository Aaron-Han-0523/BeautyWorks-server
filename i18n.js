//모듈 불러오기
const i18n = require('i18n');

//옵션 설정
i18n.configure({
    //사용언어 설정 
    locales: ['ko', 'en'],

    //언어를 설정한 json 파일 생성위치 - 기본은 ./locales
    directory: __dirname + '/locales',

    //기본 사용언어 설정
    defaultLocale: 'ko',

    //사용언어를 저장할 cookie 이름
    cookie: 'lang'
});

module.exports = (req, res, next) => {
    i18n.init(req, res);
    res.locals.__ = res.__;  // ejs에서 사용시 추가
    return next();
};