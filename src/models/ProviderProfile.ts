import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export type Availability = 'AVAILABLE' | 'BUSY' | 'VACATION';
export type DocumentType = 'CPF' | 'CNPJ';

interface ProviderProfileAttributes {
    id: string;
    user_id: string;
    name: string;
    document_type: DocumentType;
    document?: string | null;
    company_name?: string | null;
    bio?: string | null;
    area: string;
    radius_km: number;
    experience_yrs: number;
    avatar_url?: string | null;
    city?: string | null;
    state?: string | null;
    availability: Availability;
    rating: number;
    rating_count: number;
    week_goal?: number | null;
    month_goal?: number | null;
    phone?: string | null;
    neighborhood?: string | null;
    categories?: string[] | null;
    services?: string | null;
    created_at?: Date;
    updated_at?: Date;
}

interface ProviderProfileCreationAttributes
    extends Optional<
        ProviderProfileAttributes,
        'id' | 'radius_km' | 'experience_yrs' | 'availability' | 'rating' | 'rating_count'
    > { }

export class ProviderProfile
    extends Model<ProviderProfileAttributes, ProviderProfileCreationAttributes>
    implements ProviderProfileAttributes {
    declare id: string;
    declare user_id: string;
    declare name: string;
    declare document_type: DocumentType;
    declare document: string | undefined;
    declare company_name: string | undefined;
    declare bio: string | undefined;
    declare area: string;
    declare radius_km: number;
    declare experience_yrs: number;
    declare avatar_url: string | undefined;
    declare city: string | undefined;
    declare state: string | undefined;
    declare availability: Availability;
    declare rating: number;
    declare rating_count: number;
    declare week_goal: number | undefined;
    declare month_goal: number | undefined;
    declare phone: string | undefined;
    declare neighborhood: string | undefined;
    declare categories: string[] | undefined;
    declare services: string | undefined;
    declare readonly created_at: Date;
    declare readonly updated_at: Date;
}

ProviderProfile.init(
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
        document_type: {
            type: DataTypes.ENUM('CPF', 'CNPJ'),
            allowNull: false,
            defaultValue: 'CPF',
        },
        document: {
            type: DataTypes.STRING(18),
            allowNull: true,
        },
        company_name: {
            type: DataTypes.STRING(200),
            allowNull: true,
        },
        bio: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        area: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        radius_km: {
            type: DataTypes.INTEGER,
            defaultValue: 10,
        },
        experience_yrs: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        avatar_url: {
            type: DataTypes.TEXT,
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
        availability: {
            type: DataTypes.ENUM('AVAILABLE', 'BUSY', 'VACATION'),
            defaultValue: 'AVAILABLE',
        },
        rating: {
            type: DataTypes.FLOAT,
            defaultValue: 0,
        },
        rating_count: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        week_goal: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: true,
        },
        month_goal: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: true,
        },
        phone: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        neighborhood: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        categories: {
            type: DataTypes.JSON,
            allowNull: true,
            defaultValue: [],
        },
        services: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: 'provider_profiles',
        underscored: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
);
