import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

// ─── CondoTransaction ─────────────────────────────────────

interface CondoTransactionAttributes {
    id: string;
    condo_id: string;
    type: 'INCOME' | 'EXPENSE' | 'RECEIVABLE';
    value: number;
    date: string;
    description: string;
    category: string;
    created_at?: Date;
    updated_at?: Date;
}

export class CondoTransaction extends Model<CondoTransactionAttributes, Optional<CondoTransactionAttributes, 'id'>> {
    declare id: string;
    declare condo_id: string;
    declare type: 'INCOME' | 'EXPENSE' | 'RECEIVABLE';
    declare value: number;
    declare date: string;
    declare description: string;
    declare category: string;
}

CondoTransaction.init(
    {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        condo_id: { type: DataTypes.UUID, allowNull: false, references: { model: 'condo_profiles', key: 'id' }, onDelete: 'CASCADE' },
        type: { type: DataTypes.ENUM('INCOME', 'EXPENSE', 'RECEIVABLE'), allowNull: false },
        value: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
        date: { type: DataTypes.DATEONLY, allowNull: false },
        description: { type: DataTypes.STRING(300), allowNull: false },
        category: { type: DataTypes.STRING(100), defaultValue: 'Taxa de condomínio' },
    },
    { sequelize, tableName: 'condo_transactions', underscored: true, timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' }
);

// ─── CondoMeeting ─────────────────────────────────────────

interface CondoMeetingAttributes {
    id: string;
    condo_id: string;
    title: string;
    type: string;
    date: string;
    time: string;
    status: 'SCHEDULED' | 'DONE' | 'CANCELLED';
    notes?: string;
    created_at?: Date;
    updated_at?: Date;
}

export class CondoMeeting extends Model<CondoMeetingAttributes, Optional<CondoMeetingAttributes, 'id' | 'status'>> {
    declare id: string;
    declare condo_id: string;
    declare title: string;
    declare type: string;
    declare date: string;
    declare time: string;
    declare status: 'SCHEDULED' | 'DONE' | 'CANCELLED';
    declare notes: string | undefined;
}

CondoMeeting.init(
    {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        condo_id: { type: DataTypes.UUID, allowNull: false, references: { model: 'condo_profiles', key: 'id' }, onDelete: 'CASCADE' },
        title: { type: DataTypes.STRING(200), allowNull: false },
        type: { type: DataTypes.STRING(100), allowNull: false },
        date: { type: DataTypes.DATEONLY, allowNull: false },
        time: { type: DataTypes.STRING(5), allowNull: false },
        status: { type: DataTypes.ENUM('SCHEDULED', 'DONE', 'CANCELLED'), defaultValue: 'SCHEDULED' },
        notes: { type: DataTypes.TEXT, allowNull: true },
    },
    { sequelize, tableName: 'condo_meetings', underscored: true, timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' }
);

// ─── CondoDocument ────────────────────────────────────────

interface CondoDocumentAttributes {
    id: string;
    condo_id: string;
    name: string;
    category: string;
    file_url: string;
    uploaded_at?: Date;
}

export class CondoDocument extends Model<CondoDocumentAttributes, Optional<CondoDocumentAttributes, 'id'>> {
    declare id: string;
    declare condo_id: string;
    declare name: string;
    declare category: string;
    declare file_url: string;
}

CondoDocument.init(
    {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        condo_id: { type: DataTypes.UUID, allowNull: false, references: { model: 'condo_profiles', key: 'id' }, onDelete: 'CASCADE' },
        name: { type: DataTypes.STRING(200), allowNull: false },
        category: { type: DataTypes.STRING(100), allowNull: false },
        file_url: { type: DataTypes.TEXT, allowNull: false },
        uploaded_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    { sequelize, tableName: 'condo_documents', underscored: true, timestamps: false }
);

// ─── CondoAnnouncement ────────────────────────────────────

interface CondoAnnouncementAttributes {
    id: string;
    condo_id: string;
    title: string;
    content: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    created_at?: Date;
}

export class CondoAnnouncement extends Model<CondoAnnouncementAttributes, Optional<CondoAnnouncementAttributes, 'id' | 'priority'>> {
    declare id: string;
    declare condo_id: string;
    declare title: string;
    declare content: string;
    declare priority: 'LOW' | 'MEDIUM' | 'HIGH';
}

CondoAnnouncement.init(
    {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        condo_id: { type: DataTypes.UUID, allowNull: false, references: { model: 'condo_profiles', key: 'id' }, onDelete: 'CASCADE' },
        title: { type: DataTypes.STRING(200), allowNull: false },
        content: { type: DataTypes.TEXT, allowNull: false },
        priority: { type: DataTypes.ENUM('LOW', 'MEDIUM', 'HIGH'), defaultValue: 'MEDIUM' },
        created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    { sequelize, tableName: 'condo_announcements', underscored: true, timestamps: false }
);

// ─── CondoVoting ──────────────────────────────────────────

interface CondoVotingAttributes {
    id: string;
    condo_id: string;
    title: string;
    description: string;
    deadline?: Date;
    status: 'OPEN' | 'CLOSED';
    yes_votes: number;
    no_votes: number;
    created_at?: Date;
}

export class CondoVoting extends Model<CondoVotingAttributes, Optional<CondoVotingAttributes, 'id' | 'status' | 'yes_votes' | 'no_votes'>> {
    declare id: string;
    declare condo_id: string;
    declare title: string;
    declare description: string;
    declare deadline: Date | undefined;
    declare status: 'OPEN' | 'CLOSED';
    declare yes_votes: number;
    declare no_votes: number;
}

CondoVoting.init(
    {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        condo_id: { type: DataTypes.UUID, allowNull: false, references: { model: 'condo_profiles', key: 'id' }, onDelete: 'CASCADE' },
        title: { type: DataTypes.STRING(200), allowNull: false },
        description: { type: DataTypes.TEXT, allowNull: false },
        deadline: { type: DataTypes.DATE, allowNull: true },
        status: { type: DataTypes.ENUM('OPEN', 'CLOSED'), defaultValue: 'OPEN' },
        yes_votes: { type: DataTypes.INTEGER, defaultValue: 0 },
        no_votes: { type: DataTypes.INTEGER, defaultValue: 0 },
        created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    { sequelize, tableName: 'condo_votings', underscored: true, timestamps: false }
);
