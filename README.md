# Spend

## DB Roles
### Spend
This is the global role, it creates tables and is the default connection role.

### Spender
This is the user group role. It has role level security applied to user-tables and is granted to all users.

## Console Tricks
Manually had to create a few resources:
- Authorizer for API Gateway, using Cognito Pool
