# Konfigurationsversion-Kontrolle

MCP Gateway bietet eine Konfigurationsversion-Kontrollfunktion, mit der Sie Änderungen an Gateway-Konfigurationen verfolgen, verwalten und zurücksetzen können. Dieses Dokument erklärt, wie Sie die Konfigurationsversion-Kontrollfunktion verwenden können.

## Überblick über die Versionskontrolle

Die Konfigurationsversion-Kontrollfunktion ermöglicht es Ihnen:

- Historische Änderungen an jeder Konfiguration zu verfolgen
- Details zu bestimmten Konfigurationsversionen anzuzeigen
- Zu früheren Konfigurationsversionen zurückzukehren
- Unterschiede zwischen Versionen zu vergleichen

Wenn eine Konfiguration geändert wird (Erstellung, Aktualisierung oder Löschung), erstellt das System automatisch einen neuen Versionsdatensatz.

## Versionsdatensatz-Informationen

Jeder Versionsdatensatz enthält die folgenden Informationen:

- **Versionsnummer**: Automatisch inkrementierte Ganzzahl, beginnend bei 1
- **Erstellungszeit**: Zeitstempel der Erstellung der Version
- **Ersteller**: Benutzer, der die Operation durchgeführt hat
- **Operationstyp**: Erstellen, aktualisieren, löschen oder zurücksetzen
- **Konfigurationsinhalt**: Vollständiger Konfigurationsinhalt für diese Version

## Versionsverwaltungsoperationen

### Versionshistorie anzeigen

Sie können alle historischen Versionen einer bestimmten Konfiguration anzeigen, sortiert nach Versionsnummer in absteigender Reihenfolge.

### Bestimmte Versionen anzeigen

Sie können detaillierte Informationen zu einer bestimmten Version anzeigen, einschließlich des vollständigen Konfigurationsinhalts.

### Zurücksetzen auf eine bestimmte Version

Wenn es Probleme mit der aktuellen Konfiguration gibt, können Sie zu einer beliebigen früheren Version zurückkehren. Die Zurücksetzungsoperation erstellt einen neuen Versionsdatensatz mit dem Operationstyp "revert".

## Speichermethoden

Versionsdatensätze werden in derselben Datenbank wie die Konfigurationen selbst gespeichert und unterstützen die folgenden Speicheroptionen:

- SQLite3
- PostgreSQL
- MySQL

## Versionskontrolle und Multi-Tenancy

Die Versionskontrollfunktion integriert sich nahtlos in die Multi-Tenant-Funktionalität:

- Die Konfigurationen jedes Tenants haben unabhängige Versionshistorien
- Versionsdatensätze enthalten Tenant-Informationen
- Zurücksetzungsoperationen bewahren Tenant-Informationen

## Best Practices

- Bestätigen Sie den aktuellen Konfigurationsversion-Status, bevor Sie wichtige Änderungen vornehmen
- Fügen Sie bedeutungsvolle Beschreibungen für signifikante Konfigurationsänderungen hinzu
- Bereinigen Sie regelmäßig alte Versionsdatensätze, um eine Aufblähung der Datenbank zu verhindern
- Überprüfen Sie vor dem Zurücksetzen den Konfigurationsinhalt der Zielversion, um sicherzustellen, dass er den Erwartungen entspricht
