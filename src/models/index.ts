// Exportações centralizadas de todos os models + associações
import { User } from './User';
import { ClientProfile } from './ClientProfile';
import { CondoProfile } from './CondoProfile';
import { ProviderProfile } from './ProviderProfile';
import { CalendarEvent } from './CalendarEvent';
import { Transaction } from './Transaction';
import { ServiceRequest, ServiceRequestProfessional } from './ServiceRequest';
import { PasswordResetToken } from './PasswordResetToken';
import {
    Conversation,
    ConversationParticipant,
    Message,
    Notification,
} from './ChatAndNotification';

import {
    CondoTransaction,
    CondoMeeting,
    CondoDocument,
    CondoAnnouncement,
    CondoVoting,
} from './CondoModels';

// ─── Associações ──────────────────────────────────────────

// User → ClientProfile (1:1)
User.hasOne(ClientProfile, { foreignKey: 'user_id', as: 'clientProfile', onDelete: 'CASCADE' });
ClientProfile.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// User → CondoProfile (1:1)
User.hasOne(CondoProfile, { foreignKey: 'user_id', as: 'condoProfile', onDelete: 'CASCADE' });
CondoProfile.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// User → ProviderProfile (1:1)
User.hasOne(ProviderProfile, { foreignKey: 'user_id', as: 'providerProfile', onDelete: 'CASCADE' });
ProviderProfile.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// ProviderProfile → CalendarEvents (1:N)
ProviderProfile.hasMany(CalendarEvent, { foreignKey: 'provider_id', as: 'calendarEvents', onDelete: 'CASCADE' });
CalendarEvent.belongsTo(ProviderProfile, { foreignKey: 'provider_id', as: 'provider' });

// ProviderProfile → Transactions (1:N)
ProviderProfile.hasMany(Transaction, { foreignKey: 'provider_id', as: 'transactions', onDelete: 'CASCADE' });
Transaction.belongsTo(ProviderProfile, { foreignKey: 'provider_id', as: 'provider' });

// CalendarEvent → Transactions (1:N)
CalendarEvent.hasMany(Transaction, { foreignKey: 'calendar_event_id', as: 'transactions' });
Transaction.belongsTo(CalendarEvent, { foreignKey: 'calendar_event_id', as: 'event' });

// ClientProfile → ServiceRequests (1:N)
ClientProfile.hasMany(ServiceRequest, { foreignKey: 'client_id', as: 'serviceRequests', onDelete: 'CASCADE' });
ServiceRequest.belongsTo(ClientProfile, { foreignKey: 'client_id', as: 'client' });

// ServiceRequest → ServiceRequestProfessionals (1:N)
ServiceRequest.hasMany(ServiceRequestProfessional, { foreignKey: 'request_id', as: 'professionals', onDelete: 'CASCADE' });
ServiceRequestProfessional.belongsTo(ServiceRequest, { foreignKey: 'request_id', as: 'request' });

// CondoProfile → CondoTransactions (1:N)
CondoProfile.hasMany(CondoTransaction, { foreignKey: 'condo_id', as: 'transactions', onDelete: 'CASCADE' });
CondoTransaction.belongsTo(CondoProfile, { foreignKey: 'condo_id', as: 'condo' });

// CondoProfile → CondoMeetings (1:N)
CondoProfile.hasMany(CondoMeeting, { foreignKey: 'condo_id', as: 'meetings', onDelete: 'CASCADE' });
CondoMeeting.belongsTo(CondoProfile, { foreignKey: 'condo_id', as: 'condo' });

// CondoProfile → CondoDocuments (1:N)
CondoProfile.hasMany(CondoDocument, { foreignKey: 'condo_id', as: 'documents', onDelete: 'CASCADE' });
CondoDocument.belongsTo(CondoProfile, { foreignKey: 'condo_id', as: 'condo' });

// CondoProfile → CondoAnnouncements (1:N)
CondoProfile.hasMany(CondoAnnouncement, { foreignKey: 'condo_id', as: 'announcements', onDelete: 'CASCADE' });
CondoAnnouncement.belongsTo(CondoProfile, { foreignKey: 'condo_id', as: 'condo' });

// CondoProfile → CondoVotings (1:N)
CondoProfile.hasMany(CondoVoting, { foreignKey: 'condo_id', as: 'votings', onDelete: 'CASCADE' });
CondoVoting.belongsTo(CondoProfile, { foreignKey: 'condo_id', as: 'condo' });

// Conversation <-> User via ConversationParticipant (N:N)
Conversation.belongsToMany(User, { through: ConversationParticipant, foreignKey: 'conversation_id', as: 'participants' });
User.belongsToMany(Conversation, { through: ConversationParticipant, foreignKey: 'user_id', as: 'conversations' });

// Conversation → Messages (1:N)
Conversation.hasMany(Message, { foreignKey: 'conversation_id', as: 'messages', onDelete: 'CASCADE' });
Message.belongsTo(Conversation, { foreignKey: 'conversation_id', as: 'conversation' });

// User → Messages (1:N)
User.hasMany(Message, { foreignKey: 'sender_id', as: 'sentMessages' });
Message.belongsTo(User, { foreignKey: 'sender_id', as: 'sender' });

// User → Notifications (1:N)
User.hasMany(Notification, { foreignKey: 'user_id', as: 'notifications', onDelete: 'CASCADE' });
Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// User → PasswordResetTokens (1:N)
User.hasMany(PasswordResetToken, { foreignKey: 'user_id', as: 'resetTokens', onDelete: 'CASCADE' });
PasswordResetToken.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

export {
    User,
    ClientProfile,
    CondoProfile,
    ProviderProfile,
    CalendarEvent,
    Transaction,
    ServiceRequest,
    ServiceRequestProfessional,
    PasswordResetToken,
    Conversation,
    ConversationParticipant,
    Message,
    Notification,
    CondoTransaction,
    CondoMeeting,
    CondoDocument,
    CondoAnnouncement,
    CondoVoting,
};
