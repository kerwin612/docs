# Einrichtungsleitfaden für lokale Entwicklungsumgebung

Dieses Dokument beschreibt, wie Sie eine vollständige MCP Gateway-Entwicklungsumgebung lokal einrichten und starten können, einschließlich aller erforderlichen Servicekomponenten.

## Voraussetzungen

Bevor Sie beginnen, stellen Sie sicher, dass Ihr System die folgende Software installiert hat:

- Git
- Go 1.24.1 oder höher
- Node.js v20.18.0 oder höher
- npm

## Überblick über die Projektarchitektur

Das MCP Gateway-Projekt besteht aus den folgenden Kernkomponenten:

1. **apiserver** - Bietet Konfigurationsmanagement, Benutzeroberfläche und andere API-Dienste
2. **mcp-gateway** - Kern-Gateway-Dienst, behandelt MCP-Protokollkonvertierung
3. **mock-server** - Simuliert Benutzerdienst für Entwicklungstests
4. **web** - Management-Interface-Frontend

## Starten der Entwicklungsumgebung

### 1. Projekt klonen

Besuchen Sie das [MCP Gateway-Code-Repository](https://github.com/amoylab/unla), klicken Sie auf den `Fork`-Button, um das Projekt in Ihr GitHub-Konto zu forken.

### 2. Lokal klonen

Klonen Sie Ihr geforktes Repository lokal:

```bash
git clone https://github.com/ihr-github-benutzername/mcp-gateway.git
```

### 3. Umgebungsabhängigkeiten initialisieren

Wechseln Sie in das Projektverzeichnis:
```bash
cd unla
```

Installieren Sie die Abhängigkeiten:

```bash
go mod tidy
cd web
npm i
```

### 4. Entwicklungsumgebung starten

```bash
cp .env.example .env
cd web
cp .env.example .env
```

**Hinweis**: Sie können die Entwicklung mit der Standardkonfiguration ohne Änderungen starten, aber Sie können auch die Konfigurationsdateien anpassen, um Ihre Umgebungs- oder Entwicklungsanforderungen zu erfüllen, wie z.B. Wechsel von Disk, DB usw.

**Hinweis**: Sie benötigen möglicherweise 4 Terminalfenster, um alle Dienste auszuführen. Dieser Ansatz, mehrere Dienste auf dem Host-Rechner auszuführen, erleichtert das Neustarten und Debuggen während der Entwicklung.

#### 4.1 mcp-gateway starten

```bash
go run cmd/gateway/main.go
```

mcp-gateway wird standardmäßig unter `http://localhost:5235` gestartet und bearbeitet MCP-Protokollanfragen.

#### 4.2 apiserver starten 

```bash
go run cmd/apiserver/main.go
```

apiserver wird standardmäßig unter `http://localhost:5234` gestartet.

#### 4.3 mock-server starten

```bash
go run cmd/mock-server/main.go
```

mock-server wird standardmäßig unter `http://localhost:5235` gestartet.

#### 4.4 Web-Frontend starten

```bash
npm run dev
```

Das Web-Frontend wird standardmäßig unter `http://localhost:5236` gestartet.

Sie können jetzt auf die Verwaltungsoberfläche in Ihrem Browser unter http://localhost:5236 zugreifen. Der Standardbenutzername und das Standardpasswort werden durch Ihre Umgebungsvariablen (in der .env-Datei im Stammverzeichnis) bestimmt, insbesondere `SUPER_ADMIN_USERNAME` und `SUPER_ADMIN_PASSWORD`. Nach der Anmeldung können Sie den Benutzernamen und das Passwort in der Verwaltungsoberfläche ändern.

## Häufige Probleme

### Umgebungsvariablen-Einstellungen

Einige Dienste benötigen möglicherweise spezifische Umgebungsvariablen, um ordnungsgemäß zu funktionieren. Sie können eine `.env`-Datei erstellen oder diese Variablen vor dem Start des Befehls festlegen:

```bash
# Beispiel
export OPENAI_API_KEY="ihr_api_schlüssel"
export OPENAI_MODEL="gpt-4o-mini"
export APISERVER_JWT_SECRET_KEY="ihr_geheimer_schlüssel"
```

## Nächste Schritte

Nach dem erfolgreichen Start der lokalen Entwicklungsumgebung können Sie:

- Die [Architekturdokumentation](./architecture) überprüfen, um die Systemkomponenten im Detail zu verstehen
- Den [Konfigurationsleitfaden](../configuration/gateways) lesen, um zu erfahren, wie Sie das Gateway konfigurieren 

## Workflow für Code-Beiträge

Bevor Sie mit der Entwicklung neuer Funktionen oder der Fehlerbehebung beginnen, folgen Sie bitte diesen Schritten, um Ihre Entwicklungsumgebung einzurichten:

1. Klonen Sie Ihr Fork-Repository lokal:
```bash
git clone https://github.com/your-github-username/unla.git
```

2. Fügen Sie das Upstream-Repository hinzu:
```bash
git remote add upstream git@github.com:amoylab/unla.git
```

3. Synchronisieren Sie mit dem Upstream-Code:
```bash
git pull upstream main
```

4. Pushen Sie Updates zu Ihrem Fork-Repository (optional):
```bash
git push origin main
```

5. Erstellen Sie einen neuen Feature-Branch:
```bash
git switch -c feat/your-feature-name
```

6. Nach der Entwicklung, pushen Sie Ihren Branch zum Fork-Repository:
```bash
git push origin feat/your-feature-name
```

7. Erstellen Sie einen Pull Request auf GitHub, um Ihren Branch in den main-Branch des Hauptrepositories zu mergen.

**Tipps**:
- Branch-Namenskonvention: Verwenden Sie das Präfix `feat/` für neue Funktionen, `fix/` für Fehlerbehebungen
- Stellen Sie sicher, dass Ihr Code alle Tests besteht, bevor Sie einen PR einreichen
- Halten Sie Ihr Fork-Repository mit dem Upstream-Repository synchron, um Code-Konflikte zu vermeiden 