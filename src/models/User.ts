import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

// ─── Types ───────────────────────────────────────────────
export type UserRole = 'CLIENT_CPF' | 'CLIENT_CNPJ' | 'PROVIDER';

interface UserAttributes {
    id: string;
    email: string;
    password_hash: string;
    role: UserRole;
    created_at?: Date;
    updated_at?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> { }

// ─── Model ───────────────────────────────────────────────
export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    declare id: string;
    declare email: string;
    declare password_hash: string;
    declare role: UserRole;
    declare readonly created_at: Date;
    declare readonly updated_at: Date;
}

User.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            validate: { isEmail: true },
        },
        password_hash: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM('CLIENT_CPF', 'CLIENT_CNPJ', 'PROVIDER'),
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'users',
        underscored: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
);
