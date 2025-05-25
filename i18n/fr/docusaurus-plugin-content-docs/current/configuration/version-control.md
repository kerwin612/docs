# Contrôle de Version de Configuration

MCP Gateway fournit une fonctionnalité de contrôle de version de configuration, vous permettant de suivre, gérer et revenir à des versions antérieures des configurations de passerelle. Ce document explique comment utiliser la fonctionnalité de contrôle de version de configuration.

## Aperçu du Contrôle de Version

La fonctionnalité de contrôle de version de configuration vous permet de :

- Suivre les modifications historiques de chaque configuration
- Voir les détails des versions spécifiques de configuration
- Revenir à des versions antérieures de configuration
- Comparer les différences entre les versions

Chaque fois qu'une configuration change (création, mise à jour ou suppression), le système crée automatiquement un nouvel enregistrement de version.

## Informations d'Enregistrement de Version

Chaque enregistrement de version contient les informations suivantes :

- **Numéro de Version** : Entier auto-incrémenté, commençant à 1
- **Heure de Création** : Horodatage de la création de la version
- **Créateur** : Utilisateur qui a effectué l'opération
- **Type d'Opération** : Création, mise à jour, suppression ou retour
- **Contenu de Configuration** : Contenu complet de la configuration pour cette version

## Opérations de Gestion de Version

### Visualisation de l'Historique des Versions

Vous pouvez voir toutes les versions historiques d'une configuration spécifique, triées par numéro de version en ordre décroissant.

### Visualisation de Versions Spécifiques

Vous pouvez voir des informations détaillées sur une version spécifique, y compris le contenu complet de la configuration.

### Retour à une Version Spécifique

S'il y a des problèmes avec la configuration actuelle, vous pouvez revenir à n'importe quelle version antérieure. L'opération de retour crée un nouvel enregistrement de version avec le type d'opération "revert".

## Méthodes de Stockage

Les enregistrements de version sont stockés dans la même base de données que les configurations elles-mêmes, prenant en charge les options de stockage suivantes :

- SQLite3
- PostgreSQL
- MySQL

## Contrôle de Version et Multi-locataire

La fonctionnalité de contrôle de version s'intègre parfaitement à la fonctionnalité multi-locataire :

- Les configurations de chaque locataire ont des historiques de version indépendants
- Les enregistrements de version incluent des informations sur le locataire
- Les opérations de retour préservent les informations sur le locataire

## Meilleures Pratiques

- Confirmer l'état de la version de configuration actuelle avant d'apporter des modifications importantes
- Ajouter des descriptions significatives pour les changements de configuration significatifs
- Nettoyer régulièrement les anciens enregistrements de version pour éviter le gonflement de la base de données
- Avant de revenir en arrière, examiner le contenu de la configuration de la version cible pour s'assurer qu'elle répond aux attentes
