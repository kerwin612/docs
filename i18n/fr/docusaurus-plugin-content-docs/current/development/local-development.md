# Guide de Configuration de l'Environnement de Développement Local

Ce document décrit comment configurer et démarrer un environnement de développement complet pour MCP Gateway localement, incluant tous les composants de service nécessaires.

## Prérequis

Avant de commencer, assurez-vous que votre système dispose des logiciels suivants installés :

- Git
- Go 1.24.1 ou supérieur
- Node.js v20.18.0 ou supérieur
- npm

## Aperçu de l'Architecture du Projet

Le projet MCP Gateway est composé des composants principaux suivants :

1. **apiserver** - Fournit la gestion de configuration, l'interface utilisateur et d'autres services API
2. **mcp-gateway** - Service de passerelle principal, gère la conversion du protocole MCP
3. **mock-server** - Simule un service utilisateur pour les tests de développement
4. **web** - Frontend de l'interface de gestion

## Démarrage de l'Environnement de Développement

### 1. Cloner le Projet

Visitez le [dépôt de code MCP Gateway](https://github.com/amoylab/unla), cliquez sur le bouton `Fork` pour forker le projet dans votre compte GitHub.

### 2. Cloner en Local

Clonez votre dépôt forké localement :

```bash
git clone https://github.com/votre-nom-utilisateur-github/mcp-gateway.git
```

### 3. Initialiser les Dépendances de l'Environnement

Entrez dans le répertoire du projet :
```bash
cd unla
```

Installez les dépendances :

```bash
go mod tidy
cd web
npm i
```

### 4. Démarrer l'Environnement de Développement

```bash
cp .env.example .env
cd web
cp .env.example .env
```

**Remarque** : Vous pouvez commencer le développement avec la configuration par défaut sans rien modifier, mais vous pouvez également modifier les fichiers de configuration pour répondre à vos besoins d'environnement ou de développement, comme changer Disk, DB, etc.

**Remarque** : Vous pourriez avoir besoin de 4 fenêtres de terminal pour exécuter tous les services. Cette approche d'exécution de plusieurs services sur la machine hôte facilite le redémarrage et le débogage pendant le développement.

#### 4.1 Démarrer mcp-gateway

```bash
go run cmd/gateway/main.go
```

mcp-gateway démarrera sur `http://localhost:5235` par défaut, traitant les requêtes du protocole MCP.

#### 4.2 Démarrer apiserver 

```bash
go run cmd/apiserver/main.go
```

apiserver démarrera sur `http://localhost:5234` par défaut.

#### 4.3 Démarrer mock-server

```bash
go run cmd/mock-server/main.go
```

mock-server démarrera sur `http://localhost:5235` par défaut.

#### 4.4 Démarrer le frontend web

```bash
npm run dev
```

Le frontend web démarrera sur `http://localhost:5236` par défaut.

Vous pouvez maintenant accéder à l'interface de gestion dans votre navigateur à http://localhost:5236. Le nom d'utilisateur et le mot de passe par défaut sont déterminés par vos variables d'environnement (dans le fichier .env du répertoire racine), spécifiquement `SUPER_ADMIN_USERNAME` et `SUPER_ADMIN_PASSWORD`. Après vous être connecté, vous pouvez changer le nom d'utilisateur et le mot de passe dans l'interface de gestion.

## Problèmes Courants

### Paramètres des Variables d'Environnement

Certains services peuvent nécessiter des variables d'environnement spécifiques pour fonctionner correctement. Vous pouvez créer un fichier `.env` ou définir ces variables avant de démarrer la commande :

```bash
# Exemple
export OPENAI_API_KEY="votre_clé_api"
export OPENAI_MODEL="gpt-4o-mini"
export APISERVER_JWT_SECRET_KEY="votre_clé_secrète"
```

## Prochaines Étapes

Après avoir réussi à démarrer l'environnement de développement local, vous pouvez :

- Consulter la [Documentation d'Architecture](./architecture) pour comprendre les composants du système en profondeur
- Lire le [Guide de Configuration](../configuration/gateways) pour apprendre comment configurer la passerelle 

## Flux de Travail pour Contribuer au Code

Avant de commencer à développer de nouvelles fonctionnalités ou à corriger des bugs, suivez ces étapes pour configurer votre environnement de développement :

1. Clonez votre dépôt fork localement :
```bash
git clone https://github.com/your-github-username/unla.git
```

2. Ajoutez le dépôt upstream :
```bash
git remote add upstream git@github.com:amoylab/unla.git
```

3. Synchronisez avec le code upstream :
```bash
git pull upstream main
```

4. Poussez les mises à jour vers votre dépôt fork (optionnel) :
```bash
git push origin main
```

5. Créez une nouvelle branche de fonctionnalité :
```bash
git switch -c feat/your-feature-name
```

6. Après le développement, poussez votre branche vers le dépôt fork :
```bash
git push origin feat/your-feature-name
```

7. Créez une Pull Request sur GitHub pour fusionner votre branche dans la branche main du dépôt principal.

**Conseils** :
- Convention de nommage des branches : utilisez le préfixe `feat/` pour les nouvelles fonctionnalités, `fix/` pour les corrections de bugs
- Assurez-vous que votre code passe tous les tests avant de soumettre une PR
- Gardez votre dépôt fork synchronisé avec le dépôt upstream pour éviter les conflits de code 