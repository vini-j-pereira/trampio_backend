import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface ClientProfileAttributes {
    id: string;
    user_id: string;
    name: string;
    cpf?: string;
    avatar_url?: string;
    location?: string;
    city?: string;
    state?: string;
    created_at?: Date;
    updated_at?: Date;
}

interface ClientProfileCreationAttributes extends Optional<ClientProfileAttributes, 'id'> { }

export class ClientProfile
    extends Model<ClientProfileAttributes, ClientProfileCreationAttributes>
    implements ClientProfileAttributes {
    declare id: string;
    declare user_id: string;
    declare name: string;
    declare cpf: string | undefined;
    declare avatar_url: string | undefined;
    declare location: string | undefined;
    declare city: string | undefined;
    declare state: string | undefined;
    declare readonly created_at: Date;
    declare readonly updated_at: Date;
}

ClientProfile.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: 'users', key: 'id' },
            onDelete: 'CASCADE',
        },
        name: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },
        cpf: {
            type: DataTypes.STRING(14),
            allowNull: true,
            unique: true,
        },
        avatar_url: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        location: {
            type: DataTypes.STRING(200),
            allowNull: true,
        },
        city: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        state: {
            type: DataTypes.STRING(2),
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: 'client_profiles',
        underscored: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
);
