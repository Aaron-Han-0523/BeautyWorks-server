const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user_log', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    users_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "사용자 식별번호"
    },
    logDateTime: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: "기록시간"
    },
    ip: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "ip"
    },
    method: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: "method"
    },
    url: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: "url"
    },
    body: {
      type: DataTypes.STRING(1000),
      allowNull: true,
      comment: "http요청body"
    },
    statusCode: {
      type: DataTypes.STRING(5),
      allowNull: true,
      comment: "http상태코드"
    },
    statusMessage: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "http상태메시지"
    },
    message: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "내용"
    },
    headers: {
      type: DataTypes.STRING(1000),
      allowNull: true,
      comment: "헤더"
    }
  }, {
    sequelize,
    tableName: 'user_log',
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
    ]
  });
};
