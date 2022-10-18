const SequelizeAuto = require('sequelize-auto');
const auto = new SequelizeAuto("데이터베이스명", "사용자명", "비밀번호", {
    host: "localhost",
    port: "3306",
    dialect: "mysql",
});

auto.run((err)=>{
    if(err) throw err;
})