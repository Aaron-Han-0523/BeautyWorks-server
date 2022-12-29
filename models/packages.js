const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('packages', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      comment: "용기 식별번호"
    },
    packaging_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "용기명"
    },
    packaging_type: {
      type: DataTypes.TINYINT,
      allowNull: true,
      comment: "용기종류"
    },
    category1: {
      type: DataTypes.TINYINT,
      allowNull: true,
      comment: "대분류"
    },
    category2: {
      type: DataTypes.TINYINT,
      allowNull: true,
      comment: "중분류"
    },
    category3: {
      type: DataTypes.TINYINT,
      allowNull: true,
      comment: "소분류"
    },
    capacity: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "용량"
    },
    use: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "용도"
    },
    image_paths: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "이미지"
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "가격"
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
    tableName: 'packages',
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
