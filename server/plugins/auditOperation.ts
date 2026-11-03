import type { H3Event } from 'h3';
import { AuditAction, AuditCategory } from '~~/shared/enums/Audit';

export default defineNitroPlugin(async (nitroApp) => {
  nitroApp.hooks.hook('afterResponse', async (event: H3Event) => {
    if (bypassAuthForDev(event)) return; // Skip auditing for dev bypass requests
    if (isTestEnv) return; // Skip auditing for test environment
    const route = event.path.replace(/^\/api\/admin/, '');
    const method = event.method;
    const trackPerRoute = [
      // Avatar bases
      {
        pathRegex: /^\/commissions\/bases$/,
        method: 'POST',
        category: AuditCategory.AvatarBase,
        action: AuditAction.Create,
      },
      {
        pathRegex: /^\/commissions\/bases\/[^/]+$/,
        method: 'PUT',
        category: AuditCategory.AvatarBase,
        action: AuditAction.Update,
      },
      {
        pathRegex: /^\/commissions\/bases\/[^/]+$/,
        method: 'DELETE',
        category: AuditCategory.AvatarBase,
        action: AuditAction.Delete,
      },
      // Commissions
      {
        pathRegex: /^\/commissions$/,
        method: 'POST',
        category: AuditCategory.Commission,
        action: AuditAction.Create,
      },
      {
        pathRegex: /^\/commissions\/[^/]+$/,
        method: 'PUT',
        category: AuditCategory.Commission,
        action: AuditAction.Update,
      },
      {
        pathRegex: /^\/commissions\/[^/]+$/,
        method: 'DELETE',
        category: AuditCategory.Commission,
        action: AuditAction.Delete,
      },
      // Customer
      {
        pathRegex: /^\/customers$/,
        method: 'POST',
        category: AuditCategory.Customer,
        action: AuditAction.Create,
      },
      {
        pathRegex: /^\/customers\/[^/]+$/,
        method: 'PUT',
        category: AuditCategory.Customer,
        action: AuditAction.Update,
      },
      {
        pathRegex: /^\/customers\/[^/]+$/,
        method: 'DELETE',
        category: AuditCategory.Customer,
        action: AuditAction.Delete,
      },
      // Billing transactions
      {
        pathRegex: /^\/commissions\/[^/]+\/billing$/,
        method: 'POST',
        category: AuditCategory.BillingTransaction,
        action: AuditAction.Create,
      },
      {
        pathRegex: /^\/commissions\/[^/]+\/billing\/[^/]+$/,
        method: 'PATCH',
        category: AuditCategory.BillingTransaction,
        action: AuditAction.Update,
      },
      {
        pathRegex: /^\/commissions\/[^/]+\/billing\/[^/]+$/,
        method: 'DELETE',
        category: AuditCategory.BillingTransaction,
        action: AuditAction.Delete,
      },
      // Global config
      {
        pathRegex: /^\/config\/[^/]+$/,
        method: 'POST',
        category: AuditCategory.GlobalConfig,
        action: AuditAction.Update,
      },
    ];
    // Handle audit logging when conditions are met (route and method)
    const requestMatch = trackPerRoute.find((routeConfig) => {
      return routeConfig.pathRegex.test(route) && routeConfig.method === method;
    });

    if (!requestMatch) return; // No matching route for auditing

    logger
      .withTag('auditOperation')
      .info(`Auditing operation for: ${method} ${event.path}`);
    await auditOperation(event, {
      category: requestMatch.category,
      action: requestMatch.action,
      details: event.context.audit,
    });
  });
});
