# Linglet App - Production Deployment (Linux)

## Voraussetzungen

- Node.js 18+ und npm
- PostgreSQL 16
- Git (optional)

## 1. Server-Vorbereitung

```bash
# System aktualisieren
sudo apt update && sudo apt upgrade -y

# Node.js installieren (via NodeSource)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# PostgreSQL installieren
sudo apt install -y postgresql postgresql-contrib

# PostgreSQL starten
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

## 2. Datenbank einrichten

```bash
# PostgreSQL-User und Datenbank erstellen
sudo -u postgres psql

# In psql:
CREATE DATABASE linglet;
CREATE USER lingletuser WITH ENCRYPTED PASSWORD 'IhrSicheresPasswort';
GRANT ALL PRIVILEGES ON DATABASE linglet TO lingletuser;
\q
```

## 3. Anwendung deployen

```bash
# Projektverzeichnis erstellen
mkdir -p /var/www/linglet-app
cd /var/www/linglet-app

# Code hochladen (z.B. via Git oder SCP)
# git clone <repository-url> .
# oder: scp -r /lokaler/pfad/* user@server:/var/www/linglet-app/

# Dependencies installieren
npm ci --production=false

# .env Datei erstellen
nano .env
```

### .env Datei (Production):

```env
DATABASE_URL="postgresql://lingletuser:IhrSicheresPasswort@localhost:5432/linglet?schema=public"
AUTH_SECRET="GENERIEREN_SIE_EIN_STARKES_RANDOM_SECRET_HIER"
NEXT_PUBLIC_APP_URL="https://ihre-domain.de"
NODE_ENV="production"
```

**Wichtig**: Generieren Sie ein starkes AUTH_SECRET:
```bash
openssl rand -base64 32
```

## 4. Datenbank migrieren und seeden

```bash
# Prisma Client generieren
npm run prisma:generate

# Migrations ausführen
npm run prisma:migrate

# Admin-User + alle Kapitel seeden (EMPFOHLEN)
npm run db:seed:production:complete

# ODER nur Admin-User erstellen (ohne Kapitel)
npm run db:seed:production

# ODER nur Kapitel seeden (ohne Admin-User)
npm run db:seed:chapters
```

**Admin-Login:**
- Email: `admin@hendrik-beier.de`
- Passwort: `12092025`

⚠️ **Ändern Sie das Passwort sofort nach dem ersten Login!**

**Geseedete Inhalte (bei complete):**
- 1 Admin-User
- 8 Kapitel (4 DE→PT, 4 PT→DE)
- 40 Unterkapitel
- 400 Vokabeln mit Beispielsätzen

## 5. Build & Start

```bash
# Production Build erstellen
npm run build

# Anwendung starten
npm start
```

Die Anwendung läuft auf `http://localhost:3000`

## 5a. Health Check (Nach Deployment)

Nach dem Deployment können Sie überprüfen, ob alles korrekt funktioniert:

```bash
npm run health:check
```

Dieser Test prüft:
- ✓ Umgebungsvariablen
- ✓ Datenbankverbindung
- ✓ Datenbank-Schema
- ✓ Admin-User
- ✓ Anwendungsverfügbarkeit

Bei Fehlern werden klare Hinweise zur Behebung angezeigt.

## 6. Reverse Proxy mit Nginx (empfohlen)

```bash
# Nginx installieren
sudo apt install -y nginx

# Nginx-Konfiguration erstellen
sudo nano /etc/nginx/sites-available/linglet-app
```

### Nginx-Konfiguration:

```nginx
server {
    listen 80;
    server_name ihre-domain.de;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Aktivieren und starten
sudo ln -s /etc/nginx/sites-available/linglet-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 7. SSL mit Let's Encrypt (empfohlen)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d ihre-domain.de
```

## 8. Process Manager (PM2)

```bash
# PM2 global installieren
sudo npm install -g pm2

# App mit PM2 starten
pm2 start npm --name "linglet-app" -- start

# PM2 beim Systemstart aktivieren
pm2 startup
pm2 save
```

### Nützliche PM2-Befehle:

```bash
pm2 status           # Status anzeigen
pm2 logs linglet-app   # Logs anzeigen
pm2 restart linglet-app # App neu starten
pm2 stop linglet-app   # App stoppen
```

## 9. Wartung

### Backup der Datenbank:

```bash
# Backup erstellen
sudo -u postgres pg_dump linglet > linglet_backup_$(date +%Y%m%d).sql

# Restore
sudo -u postgres psql linglet < linglet_backup_YYYYMMDD.sql
```

### Updates deployen:

```bash
cd /var/www/linglet-app
git pull  # oder neuen Code hochladen
npm ci --production=false
npm run build
pm2 restart linglet-app
```

## Troubleshooting

- **Port 3000 bereits belegt**: Ändern Sie den Port in der Startkommando
- **Datenbank-Verbindungsfehler**: Prüfen Sie DATABASE_URL in .env
- **Build-Fehler**: Stellen Sie sicher, dass alle Dependencies installiert sind
- **Logs prüfen**: `pm2 logs linglet-app` oder `journalctl -u linglet-app`

## Support

Bei Problemen prüfen Sie:
1. Logs: `pm2 logs linglet-app`
2. Nginx-Logs: `/var/log/nginx/error.log`
3. PostgreSQL-Logs: `/var/log/postgresql/postgresql-16-main.log`
