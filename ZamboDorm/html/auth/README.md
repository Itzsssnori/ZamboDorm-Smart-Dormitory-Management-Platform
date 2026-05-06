# Authentication Pages

User authentication and account creation pages for ZamboDorm system access.

## File Overview

### Sign In
- **signin-page.html** - User login interface with role-based demo accounts
  - Features: Email/password authentication, role selection (Tenant/Landlord/Admin), demo account shortcuts
  - Implementation: DRY + BEM CSS with responsive design
  - Includes loading states, error handling, and password visibility toggle

### Registration
- **register-account.html** - New user account creation form
  - Features: Form validation, password strength requirements, role selection
  - Includes terms acceptance and email verification

## Demo Accounts

For testing purposes, the following demo accounts are available on the sign-in page:

- **Tenant** - Standard resident account
- **Landlord** - Property owner/manager account
- **Admin** - System administrator account

## Security Notes

- All passwords are securely transmitted via HTTPS (production)
- Session tokens are stored securely
- Rate limiting on login attempts (implementation TBD)
- Account lockout after failed attempts (implementation TBD)

## Related Resources

- Sign-in CSS: `../css/pages/signin-page.css`
- Sign-in JavaScript: `../js/pages/signin-page.js`
- Registration CSS: `../css/pages/register.css`
- Registration JavaScript: `../js/pages/register.js`
- User management: `../js/core/user-manager.js`
