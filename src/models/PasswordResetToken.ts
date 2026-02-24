import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface PasswordResetTokenAttributes {
    id: string;
    user_id: string;
    token_hash: string;
    expires_at: Date;
    created_at?: Date;
}

interface PasswordResetTokenCreationAttributes extends Optional<PasswordResetTokenAttributes, 'id'> { }

export class PasswordResetToken
    extends Model<PasswordResetTokenAttributes, PasswordResetTokenCreationAttributes>
    implements PasswordResetTokenAttributes {
    declare id: string;
    declare user_id: string;
    declare token_hash: string;
    declare expires_at: Date;
    declare readonly created_at: Date;
}

PasswordResetToken.init(
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
        token_hash: {
            type: DataTypes.STRING(64),
            allowNull: false,
            unique: true,
        },
        expires_at: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'password_reset_tokens',
        underscored: true,
        timestamps: true,
        updatedAt: false,
        createdAt: 'created_at',
    }
);
