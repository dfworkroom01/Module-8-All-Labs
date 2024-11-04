const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const User = sequelize.define('User', {
    user_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true, // Ensure username is unique
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true, // Ensure email is unique
        validate: {
            isEmail: true, // Ensure valid email format
        },
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
}, {
    timestamps: true,
});

// Associations
User.associate = (models) => {
    User.hasMany(models.Post, { foreignKey: 'user_id' });
    User.hasMany(models.Comment, { foreignKey: 'user_id' });
    User.hasMany(models.Like, { foreignKey: 'user_id' });
};

module.exports = User;
