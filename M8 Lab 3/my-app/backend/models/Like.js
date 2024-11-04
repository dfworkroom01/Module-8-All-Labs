const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const Post = require('./Post');
const User = require('./User');

const Like = sequelize.define('Like', {
    like_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    post_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Post,
            key: 'post_id',
        },
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'user_id',
        },
    },
}, {
    timestamps: true,
});

// Associations
Like.associate = (models) => {
    Like.belongsTo(models.Post, { foreignKey: 'post_id' });
    Like.belongsTo(models.User, { foreignKey: 'user_id' });
};

module.exports = Like;
