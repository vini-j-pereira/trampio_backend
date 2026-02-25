import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface ProviderPhotoAttributes {
    id: string;
    provider_id: string;
    url: string;
    description?: string;
    created_at?: Date;
    updated_at?: Date;
}

interface ProviderPhotoCreationAttributes
    extends Optional<ProviderPhotoAttributes, 'id'> { }

export class ProviderPhoto
    extends Model<ProviderPhotoAttributes, ProviderPhotoCreationAttributes>
    implements ProviderPhotoAttributes {
    declare id: string;
    declare provider_id: string;
    declare url: string;
    declare description: string | undefined;
    declare readonly created_at: Date;
    declare readonly updated_at: Date;
}

ProviderPhoto.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        provider_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: 'provider_profiles', key: 'id' },
            onDelete: 'CASCADE',
        },
        url: {
            type: DataTypes.TEXT, // Base64 or URL
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: 'provider_photos',
        underscored: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
);
