const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('news', {
    news_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "공지사항 식별번호"
    },
    users_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "사용자 식별번호"
    },
    title: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: "제목"
    },
    contents: {
      type: DataTypes.STRING(500),
      allowNull: false,
      comment: "내용"
    },
    createDate: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: "생성일"
    },
    updateDate: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: "변경일"
    }
  }, {
    sequelize,
    tableName: 'news',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "news_id" },
        ]
      },
    ]
  });
};
