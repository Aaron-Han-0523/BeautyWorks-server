const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('documents', {
    users_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      comment: "사용자 식별번호",
      references: {
        model: 'users',
        key: 'id'
      }
    },
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      comment: "프로젝트 식별번호",
      references: {
        model: 'projects',
        key: 'id'
      }
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "제목"
    },
    message: {
      type: DataTypes.STRING(1000),
      allowNull: true,
      comment: "메시지"
    },
    file_path: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "파일 경로"
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
    tableName: 'documents',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "users_id" },
          { name: "id" },
        ]
      },
    ]
  });
};
