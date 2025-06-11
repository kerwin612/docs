# Local Development Environment Setup Guide

This document describes how to set up and start a complete MCP Gateway development environment locally, including all necessary service components.

## Prerequisites

Before starting, make sure your system has the following software installed:

- Git
- Go 1.24.1 or higher
- Node.js v20.18.0 or higher
- npm

## Project Architecture Overview

The MCP Gateway project consists of the following core components:

1. **apiserver** - Provides configuration management, user interface, and other API services
2. **mcp-gateway** - Core gateway service, handles MCP protocol conversion
3. **mock-server** - Simulates user service for development testing
4. **web** - Management interface frontend

## Starting the Development Environment

### 1. Clone the Project

Visit the [MCP Gateway code repository](https://github.com/amoylab/unla), click the `Fork` button to fork the project to your GitHub account.

### 2. Clone to Local

Clone your forked repository locally:

```bash
git clone https://github.com/your-github-username/mcp-gateway.git
```

### 3. Initialize Environment Dependencies

Enter the project directory:
```bash
cd mcp-gateway
```

Install dependencies:

```bash
go mod tidy
cd web
npm i
```

### 4. Start the Development Environment

```bash
cp .env.example .env
cd web
cp .env.example .env
```

**Note**: You can start development with the default configuration without modifying anything, but you can also modify the configuration files to meet your environment or development needs, such as switching Disk, DB, etc.

**Note**: You may need 4 terminal windows to run all services. This approach of running multiple services on the host machine makes it easy to restart and debug during development.

#### 4.1 Start mcp-gateway

```bash
go run cmd/gateway/main.go
```

mcp-gateway will start on `http://localhost:5235` by default, handling MCP protocol requests.

#### 4.2 Start apiserver 

```bash
go run cmd/apiserver/main.go
```

apiserver will start on `http://localhost:5234` by default.

#### 4.3 Start mock-server

```bash
go run cmd/mock-server/main.go
```

mock-server will start on `http://localhost:5235` by default.

#### 4.4 Start web frontend

```bash
npm run dev
```

The web frontend will start on `http://localhost:5236` by default.

You can now access the management interface in your browser at http://localhost:5236. The default username and password are determined by your environment variables (in the root directory's .env file), specifically `SUPER_ADMIN_USERNAME` and `SUPER_ADMIN_PASSWORD`. After logging in, you can change the username and password in the management interface.

## Common Issues

### Environment Variable Settings

Some services may require specific environment variables to work properly. You can create a `.env` file or set these variables before starting the command:

```bash
# Example
export OPENAI_API_KEY="your_api_key"
export OPENAI_MODEL="gpt-4o-mini"
export APISERVER_JWT_SECRET_KEY="your_secret_key"
```

## Next Steps

After successfully starting the local development environment, you can:

- Check the [Architecture Documentation](./architecture) to understand system components in depth
- Read the [Configuration Guide](../configuration/gateways) to learn how to configure the gateway 

## Contributing Code Workflow

Before starting to develop new features or fix bugs, please follow these steps to set up your development environment:

1. Clone your fork repository locally:
```bash
git clone https://github.com/your-github-username/mcp-gateway.git
```

2. Add upstream repository:
```bash
git remote add upstream git@github.com:amoylab/unla.git
```

3. Sync with upstream code:
```bash
git pull upstream main
```

4. Push updates to your fork repository (optional):
```bash
git push origin main
```

5. Create a new feature branch:
```bash
git switch -c feat/your-feature-name
```

6. After development, push your branch to the fork repository:
```bash
git push origin feat/your-feature-name
```

7. Create a Pull Request on GitHub to merge your branch into the main repository's main branch.

**Tips**:
- Branch naming convention: use `feat/` prefix for new features, `fix/` prefix for bug fixes
- Make sure your code passes all tests before submitting a PR
- Keep your fork repository in sync with the upstream repository to avoid code conflicts 