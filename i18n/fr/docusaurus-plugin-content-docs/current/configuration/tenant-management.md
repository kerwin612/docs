# Gestion des Locataires

La fonctionnalité de gestion des locataires vous permet de créer et de gérer plusieurs locataires, chacun avec ses propres configurations de passerelle et utilisateurs. Ce document explique comment utiliser la fonctionnalité de gestion des locataires.

## Concept de Locataire

Le locataire est un concept important dans MCP Gateway, utilisé pour mettre en œuvre l'isolation multi-locataires. Chaque locataire peut :

- Avoir ses propres configurations de passerelle
- Être associé à des utilisateurs spécifiques
- Utiliser des chemins de préfixe uniques pour garantir l'absence de conflits de routage

Par défaut, le système crée un locataire "default".

## Configuration du Locataire

Dans la configuration de la passerelle, vous pouvez spécifier à quel locataire appartient la configuration en utilisant le champ `tenant` :

```yaml
name: "example-gateway"
tenant: "default"  # Spécifier le nom du locataire

routers:
  - server: "example-service"
    prefix: "/api/example"
    # ...autres configurations
```

## Opérations de Gestion des Locataires

### Création de Locataires

Lors de la création d'un nouveau locataire, vous devez fournir les informations suivantes :

- **Nom** : Identifiant unique pour le locataire, ne peut pas dupliquer les noms de locataires existants
- **Préfixe** : Préfixe URL pour le locataire, utilisé pour l'isolation du routage, doit être unique
- **Description** : Description optionnelle pour le locataire

Exemple de requête :

```json
{
  "name": "tenant1",
  "prefix": "/tenant1",
  "description": "Locataire exemple"
}
```

### Mise à Jour des Locataires

Vous pouvez mettre à jour les informations suivantes du locataire :

- **Préfixe** : Mettre à jour le préfixe URL du locataire (doit assurer l'unicité)
- **Description** : Mettre à jour la description du locataire
- **Statut** : Activer ou désactiver le locataire

Exemple de requête :

```json
{
  "name": "tenant1",
  "prefix": "/new-prefix",
  "description": "Description mise à jour",
  "isActive": true
}
```

### Suppression de Locataires

La suppression d'un locataire supprimera toutes les configurations associées à ce locataire. Veuillez faire preuve de prudence, car cette opération est irréversible.

### Interrogation des Locataires

Vous pouvez interroger des informations détaillées sur un locataire spécifique ou lister tous les locataires.

## Association Locataire-Utilisateur

Les locataires peuvent être associés à des utilisateurs spécifiques, permettant les fonctionnalités suivantes :

- Les utilisateurs ne peuvent accéder et gérer que les locataires auxquels ils sont associés
- Les administrateurs peuvent attribuer des autorisations d'accès à plusieurs locataires aux utilisateurs
- Les utilisateurs peuvent basculer entre les locataires dans l'interface de gestion de la passerelle

## Sélecteur de Locataire

L'interface de gestion de la passerelle fournit une fonctionnalité de sélecteur de locataire, permettant aux utilisateurs de :

- Voir tous les locataires auxquels ils ont accès
- Basculer entre les locataires pour les opérations courantes
- Voir les configurations et le statut du locataire actuel

## Validation du Préfixe de Route

Pour garantir que les routes ne sont pas en conflit entre différents locataires, le système effectue une validation de préfixe :

- Les préfixes de route au sein d'un même locataire doivent être uniques
- Les préfixes de route entre différents locataires doivent éviter les conflits
- La validation est automatiquement effectuée lors de la création ou de la mise à jour des routes

## Meilleures Pratiques

- Créer des locataires séparés pour différents scénarios d'entreprise ou équipes
- Utiliser des noms et préfixes de locataire significatifs pour une identification et une gestion faciles
- Examiner régulièrement les autorisations des locataires pour assurer la sécurité
- Utiliser différents locataires pour les environnements de développement et de test afin de maintenir l'isolation
