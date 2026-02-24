import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

// ─── Conversation ─────────────────────────────────────────

interface ConversationAttributes {
    id: string;
    created_at?: Date;
    updated_at?: Date;
}

export class Conversation extends Model<ConversationAttributes, Optional<ConversationAttributes, 'id'>> {
    declare id: string;
    declare readonly created_at: Date;
    declare readonly updated_at: Date;
}

Conversation.init(
    {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    },
    {
        sequelize,
        tableName: 'conversations',
        underscored: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
);

// ─── ConversationParticipant ──────────────────────────────

interface ParticipantAttributes {
    conversation_id: string;
    user_id: string;
}

export class ConversationParticipant extends Model<ParticipantAttributes> {
    declare conversation_id: string;
    declare user_id: string;
}

ConversationParticipant.init(
    {
        conversation_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: 'conversations', key: 'id' },
            onDelete: 'CASCADE',
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: 'users', key: 'id' },
            onDelete: 'CASCADE',
        },
    },
    {
        sequelize,
        tableName: 'conversation_participants',
        underscored: true,
        timestamps: false,
    }
);

// ─── Message ──────────────────────────────────────────────

interface MessageAttributes {
    id: string;
    conversation_id: string;
    sender_id: string;
    content: string;
    read: boolean;
    created_at?: Date;
}

export class Message
    extends Model<MessageAttributes, Optional<MessageAttributes, 'id' | 'read'>>
    implements MessageAttributes {
    declare id: string;
    declare conversation_id: string;
    declare sender_id: string;
    declare content: string;
    declare read: boolean;
    declare readonly created_at: Date;
}

Message.init(
    {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        conversation_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: 'conversations', key: 'id' },
            onDelete: 'CASCADE',
        },
        sender_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: 'users', key: 'id' },
        },
        content: { type: DataTypes.TEXT, allowNull: false },
        read: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
        sequelize,
        tableName: 'messages',
        underscored: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false,
    }
);

// ─── Notification ─────────────────────────────────────────

interface NotificationAttributes {
    id: string;
    user_id: string;
    title: string;
    message: string;
    type: string;
    read: boolean;
    created_at?: Date;
}

export class Notification
    extends Model<NotificationAttributes, Optional<NotificationAttributes, 'id' | 'read'>>
    implements NotificationAttributes {
    declare id: string;
    declare user_id: string;
    declare title: string;
    declare message: string;
    declare type: string;
    declare read: boolean;
    declare readonly created_at: Date;
}

Notification.init(
    {
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: 'users', key: 'id' },
            onDelete: 'CASCADE',
        },
        title: { type: DataTypes.STRING(200), allowNull: false },
        message: { type: DataTypes.TEXT, allowNull: false },
        type: { type: DataTypes.STRING(50), allowNull: false, defaultValue: 'system' },
        read: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
        sequelize,
        tableName: 'notifications',
        underscored: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false,
    }
);
