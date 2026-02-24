import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export type RequestStatus = 'OPEN' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED';
export type Urgency = 'URGENTE' | 'NORMAL' | 'FLEXIVEL';

interface ServiceRequestAttributes {
    id: string;
    client_id: string;
    title: string;
    description: string;
    urgency: Urgency;
    photo_url?: string;
    status: RequestStatus;
    created_at?: Date;
    updated_at?: Date;
}

interface ServiceRequestCreationAttributes
    extends Optional<ServiceRequestAttributes, 'id' | 'status'> { }

export class ServiceRequest
    extends Model<ServiceRequestAttributes, ServiceRequestCreationAttributes>
    implements ServiceRequestAttributes {
    declare id: string;
    declare client_id: string;
    declare title: string;
    declare description: string;
    declare urgency: Urgency;
    declare photo_url: string | undefined;
    declare status: RequestStatus;
    declare readonly created_at: Date;
    declare readonly updated_at: Date;
}

ServiceRequest.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        client_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: 'client_profiles', key: 'id' },
            onDelete: 'CASCADE',
        },
        title: { type: DataTypes.STRING(200), allowNull: false },
        description: { type: DataTypes.TEXT, allowNull: false },
        urgency: {
            type: DataTypes.ENUM('URGENTE', 'NORMAL', 'FLEXIVEL'),
            allowNull: false,
            defaultValue: 'NORMAL',
        },
        photo_url: { type: DataTypes.TEXT, allowNull: true },
        status: {
            type: DataTypes.ENUM('OPEN', 'IN_PROGRESS', 'DONE', 'CANCELLED'),
            defaultValue: 'OPEN',
        },
    },
    {
        sequelize,
        tableName: 'service_requests',
        underscored: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
);

// ─── ServiceRequestProfessional (join table) ──────────────
interface ServiceRequestProfessionalAttributes {
    request_id: string;
    profession: string;
}

export class ServiceRequestProfessional extends Model<ServiceRequestProfessionalAttributes> {
    declare request_id: string;
    declare profession: string;
}

ServiceRequestProfessional.init(
    {
        request_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: 'service_requests', key: 'id' },
            onDelete: 'CASCADE',
        },
        profession: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'service_request_professionals',
        underscored: true,
        timestamps: false,
    }
);
