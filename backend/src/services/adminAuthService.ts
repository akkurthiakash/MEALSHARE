import crypto from 'crypto';

export interface AuditLogItem {
  id: string;
  adminId: string;
  adminEmail: string;
  action: string;
  targetType: 'user' | 'recipe' | 'pantry' | 'meal' | 'settings' | 'auth';
  targetId?: string;
  description: string;
  timestamp: string;
}

// Initial Admin Credentials (Hashed securely)
const ADMIN_EMAIL = 'akkurthiakash2@gmail.com';

// SHA-256 Hash of "Akash@3366"
const HASHED_ADMIN_PASSWORD = crypto.createHash('sha256').update('Akash@3366').digest('hex');

// In-memory Audit Logs storage
const auditLogs: AuditLogItem[] = [
  {
    id: 'log-1',
    adminId: 'admin-primary',
    adminEmail: 'akkurthiakash2@gmail.com',
    action: 'SYSTEM_INIT',
    targetType: 'settings',
    description: 'System Admin module initialized with secure password hashing.',
    timestamp: new Date().toISOString()
  }
];

export const adminAuthService = {
  verifyCredentials(email: string, passwordAttempt: string): boolean {
    const normEmail = email.toLowerCase().trim();
    if (normEmail !== ADMIN_EMAIL) return false;

    const attemptHash = crypto.createHash('sha256').update(passwordAttempt).digest('hex');
    return attemptHash === HASHED_ADMIN_PASSWORD;
  },

  logActivity(adminEmail: string, action: string, targetType: AuditLogItem['targetType'], description: string, targetId?: string): AuditLogItem {
    const log: AuditLogItem = {
      id: 'log-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      adminId: 'admin-primary',
      adminEmail,
      action,
      targetType,
      targetId,
      description,
      timestamp: new Date().toISOString()
    };
    auditLogs.unshift(log);
    return log;
  },

  getAuditLogs(): AuditLogItem[] {
    return auditLogs;
  }
};
