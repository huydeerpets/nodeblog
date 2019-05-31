module.exports = (sequelize, DataTypes) => {
    const Image = sequelize.define(
        'Image',
        {
            src: {
                type: DataTypes.STRING(500),
                allowNull: false,
            },
            fileName: {
                type: DataTypes.STRING(300),
                allowNull: false,
            },
            fileExtension: {
                type: DataTypes.STRING(20),
                allowNull: true,
            },
            size: {
                type: DataTypes.BIGINT,
                allowNull: false,
            },
            contentType: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
        },
        {
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        },
    );

    Image.associate = db => {
        db.Image.belongsToMany(db.Post, {
            through: 'PostImage',
            as: 'posts',
        });
    };

    return Image;
};