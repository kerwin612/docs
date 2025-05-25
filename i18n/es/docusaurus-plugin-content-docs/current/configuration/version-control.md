# Control de Versiones de Configuración

MCP Gateway proporciona funcionalidad de control de versiones de configuración, permitiéndole rastrear, gestionar y revertir cambios en las configuraciones del gateway. Este documento explica cómo utilizar la funcionalidad de control de versiones de configuración.

## Visión General del Control de Versiones

La funcionalidad de control de versiones de configuración le permite:

- Rastrear cambios históricos en cada configuración
- Ver detalles de versiones específicas de configuración
- Revertir a versiones anteriores de configuración
- Comparar diferencias entre versiones

Cada vez que una configuración cambia (creación, actualización o eliminación), el sistema crea automáticamente un nuevo registro de versión.

## Información del Registro de Versión

Cada registro de versión contiene la siguiente información:

- **Número de Versión**: Entero auto-incrementado, comenzando desde 1
- **Tiempo de Creación**: Marca de tiempo cuando se creó la versión
- **Creador**: Usuario que realizó la operación
- **Tipo de Operación**: Crear, actualizar, eliminar o revertir
- **Contenido de Configuración**: Contenido completo de configuración para esa versión

## Operaciones de Gestión de Versiones

### Visualización del Historial de Versiones

Puede ver todas las versiones históricas de una configuración específica, ordenadas por número de versión en orden descendente.

### Visualización de Versiones Específicas

Puede ver información detallada sobre una versión específica, incluyendo el contenido completo de la configuración.

### Revertir a una Versión Específica

Si hay problemas con la configuración actual, puede revertir a cualquier versión anterior. La operación de reversión crea un nuevo registro de versión con el tipo de operación "revert".

## Métodos de Almacenamiento

Los registros de versión se almacenan en la misma base de datos que las configuraciones mismas, soportando las siguientes opciones de almacenamiento:

- SQLite3
- PostgreSQL
- MySQL

## Control de Versiones y Multi-inquilino

La funcionalidad de control de versiones se integra perfectamente con la funcionalidad multi-inquilino:

- Las configuraciones de cada inquilino tienen historiales de versión independientes
- Los registros de versión incluyen información del inquilino
- Las operaciones de reversión preservan la información del inquilino

## Mejores Prácticas

- Confirmar el estado de la versión de configuración actual antes de realizar cambios importantes
- Añadir descripciones significativas para cambios de configuración significativos
- Limpiar regularmente registros de versión antiguos para prevenir el crecimiento excesivo de la base de datos
- Antes de revertir, revisar el contenido de configuración de la versión objetivo para asegurar que cumple con las expectativas
