# Share System

Systém pro sdílení souborů s automatickým mazáním, QR kódy a administračním panelem.

## Popis

Share System je webová aplikace postavená na Node.js a Express, která umožňuje uživatelům nahrávat soubory a sdílet je pomocí unikátních klíčů. Systém automaticky maže soubory po 1 hodině a obsahuje pokročilé funkce jako generování QR kódů, náhled souborů a administrační panel.

## Funkce

- 📤 **Nahrávání souborů** - Jednoduché nahrávání souborů přes webové rozhraní
- 🔑 **Bezpečné sdílení** - Každý soubor má unikátní klíč pro přístup
- 📱 **QR kódy** - Automatické generování QR kódů pro snadné sdílení
- 👁️ **Náhled souborů** - Podpora náhledu textových souborů a PDF (volitelné)
- ⚙️ **Administrační panel** - Správa funkcí a nastavení systému
- 🗑️ **Automatické mazání** - Soubory se automaticky mažou po 1 hodině
- 🚩 **Feature flags** - Zapínání/vypínání funkcí přes administrační panel

## Požadavky

- Node.js (doporučeno v14 nebo vyšší)
- npm nebo yarn

## Instalace

1. Naklonujte repozitář:

```bash
git clone https://github.com/J-Henry00/share-system.git
cd share-system
```

2. Nainstalujte závislosti:

```bash
npm install
```

3. Vytvořte soubor `.env` v kořenovém adresáři:

```env
PORT=3000
NODE_ENV=dev
X_SHARE_SYSTEM_ADMIN=your_admin_username
X_SHARE_SYSTEM_PASSWORD=your_admin_password
```

4. Spusťte aplikaci:

```bash
npm start
```

Pro vývoj s automatickým restartováním:

```bash
npm run dev
```

## Konfigurace

### Environment proměnné

- `PORT` - Port, na kterém běží server (výchozí: 3000)
- `NODE_ENV` - Režim prostředí (`dev` nebo `production`)
- `X_SHARE_SYSTEM_ADMIN` - Uživatelské jméno pro administrační panel
- `X_SHARE_SYSTEM_PASSWORD` - Heslo pro administrační panel

### Feature Flags

Systém podporuje feature flags, které lze spravovat přes administrační panel na `/admin`. Příklady:

- `killUpload` - Zablokuje nahrávání souborů
- `PDFPreview` - Povolí náhled PDF souborů

## Použití

### Nahrání souboru

1. Otevřete hlavní stránku aplikace
2. Vyberte soubor a klikněte na "Upload"
3. Po nahrání obdržíte odkaz a QR kód pro sdílení

### Sdílení souboru

- Použijte poskytnutý odkaz s klíčem
- Nebo naskenujte QR kód
- Přístup k souboru: `/view?key=YOUR_KEY`
- Stažení souboru: `/download/FILENAME?key=YOUR_KEY`

### Administrační panel

1. Přejděte na `/admin`
2. Přihlaste se pomocí přihlašovacích údajů z `.env`
3. Spravujte feature flags a nastavení systému

## API Endpointy

- `GET /` - Hlavní stránka
- `POST /upload` - Nahrání souboru
- `GET /view?key=KEY` - Zobrazení souboru
- `GET /file/:fileName?key=KEY` - Přístup k souboru
- `GET /download/:fileName?key=KEY` - Stažení souboru
- `GET /generate-qr-code?key=KEY` - Generování QR kódu
- `GET /admin` - Administrační panel (přihlášení)
- `POST /admin` - Přihlášení do administračního panelu
- `POST /admin/save` - Uložení nastavení

## Struktura projektu

```
share-system/
├── features/          # Feature flags systém
├── functions/         # Pomocné funkce
├── public/            # Statické soubory (CSS, JS, obrázky)
├── scripts/           # Utility skripty
├── tests/             # Testy
├── uploads/           # Nahrané soubory
├── views/             # EJS šablony
├── ecosystem.config.js # PM2 konfigurace
├── files.json         # Metadata nahraných souborů
└── index.js           # Hlavní soubor aplikace
```

## Automatické mazání souborů

Systém automaticky maže soubory starší než 1 hodinu pomocí cron jobu, který běží každých 20 minut.

## Skripty

- `npm start` - Spustí aplikaci
- `npm run dev` - Spustí aplikaci v režimu vývoje s nodemon
- `npm run wipeUploads` - Smaže všechny nahrané soubory

## Deployment

Pro produkční nasazení můžete použít PM2:

```bash
pm2 start ecosystem.config.js
```

## Bezpečnost

- Každý soubor je chráněn unikátním klíčem
- Administrační panel vyžaduje autentizaci
- Soubory se automaticky mažou po 1 hodině
- Feature flag `killUpload` umožňuje dočasně zablokovat nahrávání

## Licence

MIT

## Autor

J-Henry00

## Podpora

Pro hlášení problémů použijte [GitHub Issues](https://github.com/J-Henry00/share-system/issues).
