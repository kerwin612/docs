# Tenant Management

The tenant management feature allows you to create and manage multiple tenants, each with their own gateway configurations and users. This document explains how to use the tenant management functionality.

## Tenant Concept

Tenant is an important concept in MCP Gateway, used to implement multi-tenant isolation. Each tenant can:

- Have its own gateway configurations
- Be associated with specific users
- Use unique prefix paths to ensure no routing conflicts

By default, the system creates a "default" tenant.

## Tenant Configuration

In gateway configuration, you can specify which tenant the configuration belongs to using the `tenant` field:

```yaml
name: "example-gateway"
tenant: "default"  # Specify tenant name

routers:
  - server: "example-service"
    prefix: "/api/example"
    # ...other configurations
```

## Tenant Management Operations

### Creating Tenants

When creating a new tenant, you need to provide the following information:

- **Name**: Unique identifier for the tenant, cannot duplicate existing tenant names
- **Prefix**: URL prefix for the tenant, used for routing isolation, must be unique
- **Description**: Optional description for the tenant

Example request:

```json
{
  "name": "tenant1",
  "prefix": "/tenant1",
  "description": "Example tenant"
}
```

### Updating Tenants

You can update the following tenant information:

- **Prefix**: Update the tenant's URL prefix (must ensure uniqueness)
- **Description**: Update the tenant description
- **Status**: Enable or disable the tenant

Example request:

```json
{
  "name": "tenant1",
  "prefix": "/new-prefix",
  "description": "Updated description",
  "isActive": true
}
```

### Deleting Tenants

Deleting a tenant will remove all configurations associated with that tenant. Please use caution, as this operation is irreversible.

### Querying Tenants

You can query detailed information about a specific tenant or list all tenants.

## Tenant-User Association

Tenants can be associated with specific users, enabling the following features:

- Users can only access and manage tenants they are associated with
- Administrators can assign multiple tenant access permissions to users
- Users can switch between tenants in the gateway management interface

## Tenant Selector

The gateway management interface provides a tenant selector feature, allowing users to:

- View all tenants they have permission to access
- Switch between tenants for current operations
- View configurations and status of the current tenant

## Route Prefix Validation

To ensure routes don't conflict between different tenants, the system performs prefix validation:

- Route prefixes within the same tenant must be unique
- Route prefixes between different tenants should avoid conflicts
- Validation is automatically performed when creating or updating routes

## Best Practices

- Create separate tenants for different business scenarios or teams
- Use meaningful tenant names and prefixes for easy identification and management
- Regularly review tenant permissions to ensure security
- Use different tenants for development and testing environments to maintain isolation
