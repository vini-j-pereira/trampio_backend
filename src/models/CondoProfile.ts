import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface CondoProfileAttributes {
    id: string;
    user_id: string;
    name: string;
    cnpj?: string;
    total_units: number;
    defaulters: number;
    address?: string;
    city?: string;
    state?: string;
    created_at?: Date;
    updated_at?: Date;
}

interface CondoProfileCreationAttributes extends Optional<CondoProfileAttributes, 'id' | 'total_units' | 'defaulters'> { }

export class CondoProfile
    extends Model<CondoProfileAttributes, CondoProfileCreationAttributes>
    implements CondoProfileAttributes {
    declare id: string;
    declare user_id: string;
    declare name: string;
    declare cnpj: string | undefined;
    declare total_units: number;
    declare defaulters: number;
    declare address: string | undefined;
    declare city: string | undefined;
    declare state: string | undefined;
    declare readonly created_at: Date;
    declare readonly updated_at: Date;
}

CondoProfile.init(
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
            type: DataTypes.STRING(200),
            allowNull: false,
        },
        cnpj: {
            type: DataTypes.STRING(18),
            allowNull: true,
            unique: true,
        },
        total_units: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        defaulters: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        address: {
            type: DataTypes.STRING(300),
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
        tableName: 'condo_profiles',
        underscored: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
);
