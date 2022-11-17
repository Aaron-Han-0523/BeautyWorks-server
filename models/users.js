const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('users', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      comment: "사용자 식별번호"
    },
    email: {
      type: DataTypes.STRING(500),
      allowNull: false,
      comment: "이메일(ID)",
      unique: "users_UK"
    },
    password: {
      type: DataTypes.STRING(200),
      allowNull: false,
      comment: "비밀번호"
    },
    user_type: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      comment: "권한코드"
    },
    country: {
      type: DataTypes.STRING(5),
      allowNull: false,
      comment: "국가"
    },
    profile_image_path: {
      type: DataTypes.STRING(300),
      allowNull: false,
      defaultValue: "\/images\/default-user-profile.png",
      comment: "프로필사진"
    },
    first_name: {
      type: DataTypes.STRING(500),
      allowNull: false,
      comment: "이름"
    },
    last_name: {
      type: DataTypes.STRING(500),
      allowNull: false,
      comment: "성"
    },
    mobile_contact: {
      type: DataTypes.STRING(500),
      allowNull: false,
      comment: "핸드폰번호"
    },
    brand_name: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "브랜드명"
    },
    company_name: {
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
    logistics_address: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "택배주소"
    },
    company_address: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "회사주소"
    },
    last_access_date: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "마지막 접속날짜"
    },
    is_project_update: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 0,
      comment: "프로젝트알림여부"
    },
    create_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      comment: "생성일"
    },
    update_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      comment: "수정일"
    },
    delete_date: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "삭제일"
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
          { name: "id" },
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
