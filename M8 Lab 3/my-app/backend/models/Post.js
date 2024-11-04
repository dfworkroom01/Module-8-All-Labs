const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const User = require('./User');

const Post = sequelize.define('Post', {
    post_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'user_id',
        },
    },
    title: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    image_url: {
        type: DataTypes.STRING(255),
    },
}, {
    timestamps: true,
});

// Associations
Post.associate = (models) => {
    Post.belongsTo(models.User, { foreignKey: 'user_id' });
    Post.hasMany(models.Comment, { foreignKey: 'post_id' });
    Post.hasMany(models.Like, { foreignKey: 'post_id' });
};

module.exports = Post;
