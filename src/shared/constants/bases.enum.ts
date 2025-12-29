// --- ENUMS ---

export enum ROLE {
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
  USER = 'user',
}

export enum MEMBERSHIP_STATUS {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
}

export enum SESSION_STATUS {
  SCHEDULED = 'scheduled',
  OPEN = 'open',
  LOCKED = 'locked',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum PLAYER_STATUS {
  REGISTERED = 'registered',
  WAITLIST = 'waitlist',
  CANCELLED = 'cancelled',
}

export enum CHECK_IN_STATUS {
  PENDING = 'pending',
  CHECKED_IN = 'checked_in',
  NO_SHOW = 'no_show',
}

export enum PAYMENT_TYPE {
  MEMBERSHIP_FEE = 'membership_fee',
  SESSION_FEE = 'session_fee',
}

export enum PAYMENT_METHOD {
  CASH = 'cash',
  TRANSFER = 'transfer',
  GATEWAY = 'gateway',
}

export enum SESSION_PAYMENT_STATUS {
  PAID = 'paid',
  UNPAID = 'unpaid',
  REFUNDED = 'refunded',
}

export enum PAYMENT_STATUS {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export enum NOTI_TYPE {
  MEMBERSHIP_EXPIRY = 'membership_expiry',
  SESSION_REMINDER = 'session_reminder',
  PROMOTION = 'promotion',
}

export enum STATUS_USER_CLUB {
  OWNER = 'owner',
  PENDING = 'pending',
  ACTIVE = 'active',
  BANNED = 'banned',
}

export enum TEAM {
  A = 'a',
  B = 'b',
}
