const { DataTypes } = require('sequelize');
const AppDataSource = require('../dataSource');
const test = require('./test');

const AuditTrail = AppDataSource.define('AuditTrail', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    action: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
     user_id: {
         type: DataTypes.INTEGER,
         allowNull: true,  // Allow null for unauthenticated operations (e.g., login attempts)
         references: {
           model: test,
           key: 'id',
         },
         onDelete: 'CASCADE',
       },
    entity: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    value: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'audit_trail',
    timestamps: false,
    indexes: [
        { fields: ['created_at'] },
        { fields: ['user_id'] },
    ],
});

// Define associations
AuditTrail.associate = (models) => {
    AuditTrail.belongsTo(models.Test, {
        foreignKey: 'user_id',
        as: 'user',
    });
};

module.exports = AuditTrail;

