import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export type TransactionType = 'INCOME' | 'EXPENSE' | 'RECEIVABLE';

interface TransactionAttributes {
    id: string;
    provider_id: string;
    calendar_event_id?: string;
    type: TransactionType;
    value: number;
    date: string; // YYYY-MM-DD
    description: string;
    category: string;
    created_at?: Date;
    updated_at?: Date;
}

interface TransactionCreationAttributes extends Optional<TransactionAttributes, 'id'> { }

export class Transaction
    extends Model<TransactionAttributes, TransactionCreationAttributes>
    implements TransactionAttributes {
    declare id: string;
    declare provider_id: string;
    declare calendar_event_id: string | undefined;
    declare type: TransactionType;
    declare value: number;
    declare date: string;
    declare description: string;
    declare category: string;
    declare readonly created_at: Date;
    declare readonly updated_at: Date;
}

Transaction.init(
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
        calendar_event_id: {
            type: DataTypes.UUID,
            allowNull: true,
            references: { model: 'calendar_events', key: 'id' },
            onDelete: 'SET NULL',
        },
        type: {
            type: DataTypes.ENUM('INCOME', 'EXPENSE', 'RECEIVABLE'),
            allowNull: false,
        },
        value: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING(300),
            allowNull: false,
        },
        category: {
            type: DataTypes.STRING(100),
            allowNull: false,
            defaultValue: 'Serviço',
        },
    },
    {
        sequelize,
        tableName: 'transactions',
        underscored: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
);
