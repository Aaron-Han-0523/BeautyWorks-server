const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('news', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      comment: "공지사항 식별번호"
    },
    users_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      comment: "사용자 식별번호",
      references: {
        model: 'users',
        key: 'id'
      }
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "제목"
    },
    content: {
      type: DataTypes.STRING(500),
      allowNull: false,
      comment: "내용"
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
    tableName: 'news',
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
        name: "news_FK",
        using: "BTREE",
        fields: [
          { name: "users_id" },
        ]
      },
    ]
  });
};
