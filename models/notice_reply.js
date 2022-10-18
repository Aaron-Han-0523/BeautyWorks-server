const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('notice_reply', {
    notice_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "공지사항 식별번호"
    },
    reply_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "댓글 식별번호"
    },
    users_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "사용자 식별번호"
    },
    contents: {
      type: DataTypes.STRING(200),
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
    tableName: 'notice_reply',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "notice_id" },
          { name: "reply_id" },
        ]
      },
    ]
  });
};
