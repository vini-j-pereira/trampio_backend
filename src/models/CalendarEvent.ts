import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export type EventStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'DONE';

interface CalendarEventAttributes {
    id: string;
    provider_id: string;
    title: string;
    client?: string;
    description?: string;
    day: number;
    month: number;
    year: number;
    time: string;
    reminder?: string;
    is_reminder: boolean;
    earnings?: number;
    status: EventStatus;
    created_at?: Date;
    updated_at?: Date;
}

interface CalendarEventCreationAttributes
    extends Optional<CalendarEventAttributes, 'id' | 'is_reminder' | 'status'> { }

export class CalendarEvent
    extends Model<CalendarEventAttributes, CalendarEventCreationAttributes>
    implements CalendarEventAttributes {
    declare id: string;
    declare provider_id: string;
    declare title: string;
    declare client: string | undefined;
    declare description: string | undefined;
    declare day: number;
    declare month: number;
    declare year: number;
    declare time: string;
    declare reminder: string | undefined;
    declare is_reminder: boolean;
    declare earnings: number | undefined;
    declare status: EventStatus;
    declare readonly created_at: Date;
    declare readonly updated_at: Date;
}

CalendarEvent.init(
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
        title: { type: DataTypes.STRING(200), allowNull: false },
        client: { type: DataTypes.STRING(150), allowNull: true },
        description: { type: DataTypes.TEXT, allowNull: true },
        day: { type: DataTypes.INTEGER, allowNull: false },
        month: { type: DataTypes.INTEGER, allowNull: false },
        year: { type: DataTypes.INTEGER, allowNull: false },
        time: { type: DataTypes.STRING(5), allowNull: false },
        reminder: { type: DataTypes.STRING(5), allowNull: true },
        is_reminder: { type: DataTypes.BOOLEAN, defaultValue: false },
        earnings: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
        status: {
            type: DataTypes.ENUM('SCHEDULED', 'IN_PROGRESS', 'DONE'),
            defaultValue: 'SCHEDULED',
        },
    },
    {
        sequelize,
        tableName: 'calendar_events',
        underscored: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
);
