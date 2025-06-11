# Guía de Configuración del Entorno de Desarrollo Local

Este documento describe cómo configurar e iniciar un entorno de desarrollo completo de MCP Gateway localmente, incluyendo todos los componentes de servicio necesarios.

## Prerrequisitos

Antes de comenzar, asegúrate de que tu sistema tenga instalado el siguiente software:

- Git
- Go 1.24.1 o superior
- Node.js v20.18.0 o superior
- npm

## Descripción General de la Arquitectura del Proyecto

El proyecto MCP Gateway consiste en los siguientes componentes principales:

1. **apiserver** - Proporciona gestión de configuración, interfaz de usuario y otros servicios API
2. **mcp-gateway** - Servicio de puerta de enlace principal, maneja la conversión del protocolo MCP
3. **mock-server** - Simula el servicio de usuario para pruebas de desarrollo
4. **web** - Frontend de la interfaz de administración

## Iniciando el Entorno de Desarrollo

### 1. Clonar el Proyecto

Visita el [repositorio de código de MCP Gateway](https://github.com/amoylab/unla), haz clic en el botón `Fork` para bifurcar el proyecto a tu cuenta de GitHub.

### 2. Clonar Localmente

Clona tu repositorio bifurcado localmente:

```bash
git clone https://github.com/tu-nombre-de-usuario-github/mcp-gateway.git
```

### 3. Inicializar Dependencias del Entorno

Ingresa al directorio del proyecto:
```bash
cd mcp-gateway
```

Instala las dependencias:

```bash
go mod tidy
cd web
npm i
```

### 4. Iniciar el Entorno de Desarrollo

```bash
cp .env.example .env
cd web
cp .env.example .env
```

**Nota**: Puedes iniciar el desarrollo con la configuración predeterminada sin modificar nada, pero también puedes modificar los archivos de configuración para satisfacer tus necesidades de entorno o desarrollo, como cambiar Disk, DB, etc.

**Nota**: Es posible que necesites 4 ventanas de terminal para ejecutar todos los servicios. Este enfoque de ejecutar múltiples servicios en la máquina host facilita el reinicio y la depuración durante el desarrollo.

#### 4.1 Iniciar mcp-gateway

```bash
go run cmd/gateway/main.go
```

mcp-gateway se iniciará en `http://localhost:5235` por defecto, manejando solicitudes de protocolo MCP.

#### 4.2 Iniciar apiserver 

```bash
go run cmd/apiserver/main.go
```

apiserver se iniciará en `http://localhost:5234` por defecto.

#### 4.3 Iniciar mock-server

```bash
go run cmd/mock-server/main.go
```

mock-server se iniciará en `http://localhost:5235` por defecto.

#### 4.4 Iniciar el frontend web

```bash
npm run dev
```

El frontend web se iniciará en `http://localhost:5236` por defecto.

Ahora puedes acceder a la interfaz de administración en tu navegador en http://localhost:5236. El nombre de usuario y la contraseña predeterminados se determinan por tus variables de entorno (en el archivo .env del directorio raíz), específicamente `SUPER_ADMIN_USERNAME` y `SUPER_ADMIN_PASSWORD`. Después de iniciar sesión, puedes cambiar el nombre de usuario y la contraseña en la interfaz de administración.

## Problemas Comunes

### Configuración de Variables de Entorno

Algunos servicios pueden requerir variables de entorno específicas para funcionar correctamente. Puedes crear un archivo `.env` o configurar estas variables antes de iniciar el comando:

```bash
# Ejemplo
export OPENAI_API_KEY="tu_clave_api"
export OPENAI_MODEL="gpt-4o-mini"
export APISERVER_JWT_SECRET_KEY="tu_clave_secreta"
```

## Próximos Pasos

Después de iniciar exitosamente el entorno de desarrollo local, puedes:

- Revisar la [Documentación de Arquitectura](./architecture) para entender los componentes del sistema en profundidad
- Leer la [Guía de Configuración](../configuration/gateways) para aprender cómo configurar la puerta de enlace 

## Flujo de Trabajo para Contribuir Código

Antes de comenzar a desarrollar nuevas características o corregir errores, siga estos pasos para configurar su entorno de desarrollo:

1. Clone su repositorio fork localmente:
```bash
git clone https://github.com/your-github-username/mcp-gateway.git
```

2. Agregue el repositorio upstream:
```bash
git remote add upstream git@github.com:amoylab/unla.git
```

3. Sincronice con el código upstream:
```bash
git pull upstream main
```

4. Envíe las actualizaciones a su repositorio fork (opcional):
```bash
git push origin main
```

5. Cree una nueva rama de características:
```bash
git switch -c feat/your-feature-name
```

6. Después del desarrollo, envíe su rama al repositorio fork:
```bash
git push origin feat/your-feature-name
```

7. Cree un Pull Request en GitHub para fusionar su rama en la rama main del repositorio principal.

**Consejos**:
- Convención de nombres de ramas: use el prefijo `feat/` para nuevas características, `fix/` para correcciones de errores
- Asegúrese de que su código pase todas las pruebas antes de enviar un PR
- Mantenga su repositorio fork sincronizado con el repositorio upstream para evitar conflictos de código 