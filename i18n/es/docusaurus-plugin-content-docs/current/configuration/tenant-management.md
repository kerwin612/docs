# Gestión de Inquilinos

La funcionalidad de gestión de inquilinos le permite crear y administrar múltiples inquilinos, cada uno con sus propias configuraciones de gateway y usuarios. Este documento explica cómo utilizar la funcionalidad de gestión de inquilinos.

## Concepto de Inquilino

El inquilino es un concepto importante en MCP Gateway, utilizado para implementar el aislamiento multi-inquilino. Cada inquilino puede:

- Tener sus propias configuraciones de gateway
- Estar asociado con usuarios específicos
- Utilizar rutas de prefijo únicas para garantizar que no haya conflictos de enrutamiento

Por defecto, el sistema crea un inquilino "default".

## Configuración de Inquilino

En la configuración del gateway, puede especificar a qué inquilino pertenece la configuración utilizando el campo `tenant`:

```yaml
name: "example-gateway"
tenant: "default"  # Especificar nombre del inquilino

routers:
  - server: "example-service"
    prefix: "/api/example"
    # ...otras configuraciones
```

## Operaciones de Gestión de Inquilinos

### Creación de Inquilinos

Al crear un nuevo inquilino, debe proporcionar la siguiente información:

- **Nombre**: Identificador único para el inquilino, no puede duplicar nombres de inquilinos existentes
- **Prefijo**: Prefijo URL para el inquilino, utilizado para el aislamiento de enrutamiento, debe ser único
- **Descripción**: Descripción opcional para el inquilino

Ejemplo de solicitud:

```json
{
  "name": "tenant1",
  "prefix": "/tenant1",
  "description": "Inquilino de ejemplo"
}
```

### Actualización de Inquilinos

Puede actualizar la siguiente información del inquilino:

- **Prefijo**: Actualizar el prefijo URL del inquilino (debe asegurar la unicidad)
- **Descripción**: Actualizar la descripción del inquilino
- **Estado**: Habilitar o deshabilitar el inquilino

Ejemplo de solicitud:

```json
{
  "name": "tenant1",
  "prefix": "/new-prefix",
  "description": "Descripción actualizada",
  "isActive": true
}
```

### Eliminación de Inquilinos

Eliminar un inquilino eliminará todas las configuraciones asociadas con ese inquilino. Por favor, tenga precaución, ya que esta operación es irreversible.

### Consulta de Inquilinos

Puede consultar información detallada sobre un inquilino específico o listar todos los inquilinos.

## Asociación Inquilino-Usuario

Los inquilinos pueden asociarse con usuarios específicos, habilitando las siguientes características:

- Los usuarios solo pueden acceder y gestionar los inquilinos con los que están asociados
- Los administradores pueden asignar permisos de acceso a múltiples inquilinos a los usuarios
- Los usuarios pueden cambiar entre inquilinos en la interfaz de gestión del gateway

## Selector de Inquilino

La interfaz de gestión del gateway proporciona una funcionalidad de selector de inquilino, permitiendo a los usuarios:

- Ver todos los inquilinos a los que tienen permiso para acceder
- Cambiar entre inquilinos para las operaciones actuales
- Ver configuraciones y estado del inquilino actual

## Validación de Prefijo de Ruta

Para garantizar que las rutas no entren en conflicto entre diferentes inquilinos, el sistema realiza validación de prefijos:

- Los prefijos de ruta dentro del mismo inquilino deben ser únicos
- Los prefijos de ruta entre diferentes inquilinos deben evitar conflictos
- La validación se realiza automáticamente al crear o actualizar rutas

## Mejores Prácticas

- Crear inquilinos separados para diferentes escenarios de negocio o equipos
- Utilizar nombres y prefijos de inquilino significativos para facilitar la identificación y gestión
- Revisar regularmente los permisos de inquilino para garantizar la seguridad
- Utilizar diferentes inquilinos para entornos de desarrollo y prueba para mantener el aislamiento
