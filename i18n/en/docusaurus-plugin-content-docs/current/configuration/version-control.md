# Configuration Version Control

MCP Gateway provides configuration version control functionality, allowing you to track, manage, and roll back changes to gateway configurations. This document explains how to use the configuration version control feature.

## Version Control Overview

The configuration version control feature allows you to:

- Track historical changes to each configuration
- View details of specific configuration versions
- Roll back to previous configuration versions
- Compare differences between versions

Whenever a configuration changes (creation, update, or deletion), the system automatically creates a new version record.

## Version Record Information

Each version record contains the following information:

- **Version Number**: Auto-incrementing integer, starting from 1
- **Creation Time**: Timestamp when the version was created
- **Creator**: User who performed the operation
- **Operation Type**: Create, update, delete, or revert
- **Configuration Content**: Complete configuration content for that version

## Version Management Operations

### Viewing Version History

You can view all historical versions of a specific configuration, sorted by version number in descending order.

### Viewing Specific Versions

You can view detailed information about a specific version, including the complete configuration content.

### Rolling Back to a Specific Version

If there are issues with the current configuration, you can roll back to any previous version. The rollback operation creates a new version record with the operation type "revert".

## Storage Methods

Version records are stored in the same database as the configurations themselves, supporting the following storage options:

- SQLite3
- PostgreSQL
- MySQL

## Version Control and Multi-tenancy

The version control feature integrates seamlessly with the multi-tenant functionality:

- Each tenant's configurations have independent version histories
- Version records include tenant information
- Rollback operations preserve tenant information

## Best Practices

- Confirm the current configuration version status before making important changes
- Add meaningful descriptions for significant configuration changes
- Regularly clean up old version records to prevent database bloat
- Before rolling back, review the target version's configuration content to ensure it meets expectations
