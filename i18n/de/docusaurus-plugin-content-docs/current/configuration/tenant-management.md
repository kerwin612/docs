# Tenant-Management

Die Tenant-Management-Funktion ermöglicht es Ihnen, mehrere Tenants zu erstellen und zu verwalten, wobei jeder Tenant über eigene Gateway-Konfigurationen und Benutzer verfügen kann. Dieses Dokument erklärt, wie Sie die Tenant-Management-Funktionalität verwenden können.

## Tenant-Konzept

Tenant ist ein wichtiges Konzept in MCP Gateway, das zur Implementierung der Multi-Tenant-Isolation verwendet wird. Jeder Tenant kann:

- Eigene Gateway-Konfigurationen haben
- Mit bestimmten Benutzern verknüpft sein
- Eindeutige Präfix-Pfade verwenden, um sicherzustellen, dass keine Routing-Konflikte auftreten

Standardmäßig erstellt das System einen "default"-Tenant.

## Tenant-Konfiguration

In der Gateway-Konfiguration können Sie mit dem Feld `tenant` angeben, zu welchem Tenant die Konfiguration gehört:

```yaml
name: "example-gateway"
tenant: "default"  # Tenant-Namen angeben

routers:
  - server: "example-service"
    prefix: "/api/example"
    # ...weitere Konfigurationen
```

## Tenant-Management-Operationen

### Tenants erstellen

Bei der Erstellung eines neuen Tenants müssen Sie folgende Informationen angeben:

- **Name**: Eindeutiger Identifikator für den Tenant, darf keine vorhandenen Tenant-Namen duplizieren
- **Präfix**: URL-Präfix für den Tenant, wird für die Routing-Isolation verwendet, muss eindeutig sein
- **Beschreibung**: Optionale Beschreibung für den Tenant

Beispielanfrage:

```json
{
  "name": "tenant1",
  "prefix": "/tenant1",
  "description": "Beispiel-Tenant"
}
```

### Tenants aktualisieren

Sie können folgende Tenant-Informationen aktualisieren:

- **Präfix**: Aktualisieren Sie das URL-Präfix des Tenants (Eindeutigkeit muss gewährleistet sein)
- **Beschreibung**: Aktualisieren Sie die Tenant-Beschreibung
- **Status**: Aktivieren oder deaktivieren Sie den Tenant

Beispielanfrage:

```json
{
  "name": "tenant1",
  "prefix": "/new-prefix",
  "description": "Aktualisierte Beschreibung",
  "isActive": true
}
```

### Tenants löschen

Das Löschen eines Tenants entfernt alle mit diesem Tenant verknüpften Konfigurationen. Bitte seien Sie vorsichtig, da dieser Vorgang nicht rückgängig gemacht werden kann.

### Tenants abfragen

Sie können detaillierte Informationen zu einem bestimmten Tenant abfragen oder alle Tenants auflisten.

## Tenant-Benutzer-Zuordnung

Tenants können mit bestimmten Benutzern verknüpft werden, wodurch folgende Funktionen ermöglicht werden:

- Benutzer können nur auf Tenants zugreifen und diese verwalten, mit denen sie verknüpft sind
- Administratoren können Benutzern Zugriffsberechtigungen für mehrere Tenants zuweisen
- Benutzer können in der Gateway-Management-Oberfläche zwischen Tenants wechseln

## Tenant-Selektor

Die Gateway-Management-Oberfläche bietet eine Tenant-Selektor-Funktion, die es Benutzern ermöglicht:

- Alle Tenants anzuzeigen, auf die sie Zugriff haben
- Zwischen Tenants für aktuelle Operationen zu wechseln
- Konfigurationen und Status des aktuellen Tenants anzuzeigen

## Routen-Präfix-Validierung

Um sicherzustellen, dass Routen zwischen verschiedenen Tenants nicht in Konflikt geraten, führt das System eine Präfix-Validierung durch:

- Routen-Präfixe innerhalb desselben Tenants müssen eindeutig sein
- Routen-Präfixe zwischen verschiedenen Tenants sollten Konflikte vermeiden
- Die Validierung wird automatisch beim Erstellen oder Aktualisieren von Routen durchgeführt

## Best Practices

- Erstellen Sie separate Tenants für verschiedene Geschäftsszenarien oder Teams
- Verwenden Sie aussagekräftige Tenant-Namen und Präfixe für eine einfache Identifizierung und Verwaltung
- Überprüfen Sie regelmäßig die Tenant-Berechtigungen, um die Sicherheit zu gewährleisten
- Verwenden Sie verschiedene Tenants für Entwicklungs- und Testumgebungen, um die Isolation aufrechtzuerhalten
