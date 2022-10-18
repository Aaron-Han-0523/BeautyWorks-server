const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('users', {
    users_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "사용자 식별번호"
    },
    email: {
      type: DataTypes.STRING(320),
      allowNull: false,
      comment: "이메일(ID)",
      unique: "users_UK"
    },
    password: {
      type: DataTypes.STRING(200),
      allowNull: false,
      comment: "비밀번호"
    },
    userType: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
      comment: "권한코드"
    },
    country: {
      type: DataTypes.STRING(2),
      allowNull: false,
      comment: "국가명"
    },
    brandName: {
      type: DataTypes.STRING(300),
      allowNull: false,
      comment: "브랜드명"
    },
    firstName: {
      type: DataTypes.STRING(500),
      allowNull: false,
      comment: "이름"
    },
    lastname: {
      type: DataTypes.STRING(500),
      allowNull: false,
      comment: "성"
    },
    companyName: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "회사명"
    },
    team: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "팀명"
    },
    position: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "직급"
    },
    mobileContacts: {
      type: DataTypes.STRING(500),
      allowNull: false,
      comment: "핸드폰번호"
    },
    profileImagePath: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "프로필사진"
    },
    registerDate: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: "가입날짜"
    },
    lastAccessDate: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: "마지막 접속날짜"
    }
  }, {
    sequelize,
    tableName: 'users',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "users_id" },
        ]
      },
      {
        name: "users_UK",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "email" },
        ]
      },
    ]
  });
};
