const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user_log', {
    email: {
      type: DataTypes.STRING(500),
      allowNull: false,
      primaryKey: true,
      comment: "이메일(ID)",
      references: {
        model: 'users',
        key: 'email'
      }
    },
    create_date: {
      type: DataTypes.DATE,
      allowNull: false,
      primaryKey: true,
      comment: "기록시간"
    },
    ip: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "ip"
    },
    method: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: "method"
    },
    url: {
      type: DataTypes.STRING(1000),
      allowNull: true,
      comment: "url"
    },
    environment: {
      type: DataTypes.STRING(1000),
      allowNull: true,
      comment: "실행환경"
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
          { name: "email" },
          { name: "create_date" },
        ]
      },
    ]
  });
};
