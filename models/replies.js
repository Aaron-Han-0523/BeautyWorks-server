const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('replies', {
    communities_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      comment: "커뮤니티 식별번호",
      references: {
        model: 'communities',
        key: 'id'
      }
    },
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      comment: "댓글 식별번호"
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
    content: {
      type: DataTypes.STRING(200),
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
    tableName: 'replies',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "communities_id" },
          { name: "id" },
        ]
      },
      {
        name: "replies_FK1",
        using: "BTREE",
        fields: [
          { name: "users_id" },
        ]
      },
    ]
  });
};
