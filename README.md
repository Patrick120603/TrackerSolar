# Sistem inteligent de urmărire solară cu monitorizare IoT și recuperare hibridă a energiei

### Proiect de Licență - Specializarea Automatică și Informatică Aplicată (AIA)
**Universitatea Politehnica Timișoara**  
**Facultatea de Automatică și Calculatoare**

* **Candidat:** Flavius-Patrick HAMAT  
* **Coordonator științific:** Conf.dr.ing. Cristian VASAR  
* **Repository Git:**(https://gitlab.upt.ro/flavius.hamat/tracker-solar) 

---

## Descriere Proiect

Acest proiect reprezintă un sistem inteligent de orientare solară pe două axe (azimut și elevație), echipat cu un subsistem hibrid de **cogenerare termoelectrică (bazat pe generatoare termoelectrice TEG prin efect Seebeck)**. Proiectul integrează componente hardware electronice (bazate pe microcontrolerul **Arduino Uno R4 WiFi**) cu o infrastructură cloud/web modernă formată din backend în **Node.js (Express)** și panou de monitorizare/control dezvoltat în **React (Vite)**.

Sistemul implementează **trei moduri distincte de control**:
1. **Modul Astronomic (Mod 1):** Orientarea automată pe baza calculelor matematice de determinare a poziției soarelui (azimut/elevație) raportate la coordonatele geografice prestabilite (Timișoara, România: Latitudine 45.7922° N, Longitudine 21.2447° E) și ora sincronizată prin servere NTP.
2. **Modul Automat LDR (Mod 2):** Urmărirea maximului de intensitate luminoasă pe baza comparării în timp real a datelor provenite de la 4 senzori fotorezistivi (LDR) montați într-o structură cruciformă proiectată 3D.
3. **Modul Manual (Mod 3):** Permite operatorului uman preluarea completă a controlului mecanic al servomotoarelor direct din interfața web prin butoane direcționale (stânga, dreapta, sus, jos).

---

##  Arhitectura Sistemului

Sistemul este împărțit în trei niveluri structurale principale:

```mermaid
graph TD
    subgraph "Nivel Hardware (Arduino Uno R4 WiFi)"
        LDR[Senzori LDR x4] -->|Semnal Analogic| Arduino[Arduino Uno R4]
        Dallas[Senzori Temp DS18B20] -->|OneWire| Arduino
        INA[Senzor INA219] -->|I2C| Arduino
        Arduino -->|PWM| Servos[Servomotoare MG90S Bază/Sus]
        Arduino -->|I2C| LCD[Ecran LCD 16x2]
        Arduino -->|Afișare| LEDMatrix[Matrice LED Integrată]
    end

    subgraph "Nivel Server (Node.js & Express)"
        Arduino <-->|HTTP Requests GET / JSON Response| Express[Server Express]
        Express <-->|Mongoose ODM| Mongo[MongoDB Atlas Cloud]
    end

    subgraph "Nivel Client (React & Vite)"
        AdminPanel[Panou Admin / React] <-->|Rest API / JWT| Express
    end
```

### 1. Nivelul Hardware (Fizic / Nod IoT)
* **Arduino Uno R4 WiFi:** Unitatea centrală de calcul local cu procesor Renesas RA4M1 (ARM Cortex-M4 la 48 MHz) și modul Wi-Fi ESP32-S3 încorporat.
* **Servomotoare MG90S (Metal Gear):** Două actuatoare controlate prin semnale PWM, destinate modificării poziției unghiulare a trackerului pe axele orizontală (bază: 0° - 180°) și verticală (elevare: 15° - 120°).
* **Senzori fotorezistivi (LDR):** Citirea analogică a nivelului de lumină incident pe cele 4 cadrane (Sus-Stânga, Sus-Dreapta, Jos-Stânga, Jos-Dreapta) pentru urmărirea automată a luminozității.
* **Adafruit INA219:** Senzor digital de precizie de curent și tensiune, conectat prin magistrala I2C, utilizat pentru monitorizarea performanțelor de cogenerare termoelectrică și producție fotovoltaică în timp real.
* **Senzori Dallas DS18B20:** Senzori digitali pe magistrala OneWire utilizați pentru monitorizarea temperaturilor panoului solar și a radiatorului asociat generatorului Seebeck.
* **Ecran LCD 16x2 (I2C):** Afișarea locală a stării conexiunii la rețeaua WiFi, modul de operare curent și datele telemetrice imediate.
* **Matricea de LED-uri (8x12):** Afișează pictograme interactive (soare/lună) corespunzătoare modului de zi/noapte dictat de unghiul de elevație solară.

### 2. Nivelul de Server (Backend)
* Construit în **Node.js** cu framework-ul **Express.js**.
* Salvează fluxul continuu de telemetrie de la Arduino direct în baza de date NoSQL cloud **MongoDB Atlas** în mod asincron, evitând blocajele de rețea.
* Gestionează controlul hardware prin intermediul **variabilelor globale partajate în memorie**, transmițând rapid noile comenzi venite de pe site direct în corpul răspunsului JSON trimis către plăcuța Arduino.
* Securizează accesul operatorilor și administratorilor folosind mecanisme de criptare a parolelor (**bcrypt**) și tokenuri web securizate (**JWT**).

### 3. Nivelul Utilizator (Interfața Frontend)
* Aplicație web de tip Single Page Application realizată în **React** utilizând constructorul rapid de proiecte **Vite** și stilizată cu **Tailwind CSS**.
* **Dashboard interactiv:** Diagrame grafice în timp real pentru tensiune, curent, putere și temperatură, indicatoare de mod de rulare și o tabelă structurată pentru istoricul telemetriei primite.
* **Panou de control manual:** Butoane interactive (săgeți) pentru orientarea fină a servomotoarelor de la distanță și un selector dinamic pentru schimbarea modului sistemului.

---

##  Structura de Fișiere a Proiectului

```text
├── admin/                     # Panoul de Administrare (React + Vite)
│   ├── src/
│   │   ├── assets/            # Fișiere media și resurse statice (imagini, icoane)
│   │   ├── components/        # Elemente reutilizabile de interfață (Navbar, Sidebar)
│   │   ├── context/           # Managementul stării globale a aplicației (autentificare, control hardware)
│   │   ├── pages/             # Paginile vizibile ale panoului web:
│   │   │   ├── Login.jsx            # Autentificare securizată operator/admin
│   │   │   └── Admin/
│   │   │       ├── ConfigurarePanou.jsx # Configurare detalii tehnice tracker
│   │   │       ├── ControlMotoare.jsx   # Control manual unghiuri + schimbare mod
│   │   │       ├── Dashboard.jsx        # Diagrame grafice în timp real ale telemetriei
│   │   │       └── IstoricTelemetrie.jsx # Tabel cu înregistrări istorice
│   │   ├── App.jsx            # Structura generală de rute frontend
│   │   ├── index.css          # Design-ul global Tailwind CSS
│   │   └── main.jsx           # Punctul de intrare în aplicația React
│   ├── package.json           # Dependențele și scripturile de pornire React
│   └── vite.config.js         # Configurația build-ului Vite
│
├── arduino/                   # Firmware-ul C++ al microcontrolerului
│   └── TrackerSolar/
│       └── TrackerSolar.ino   # Sketch-ul principal pentru Arduino Uno R4 WiFi
│
├── backend/                   # Serverul API (Node.js & Express)
│   ├── config/                # Inițializările serviciilor externe:
│   │   ├── cloudinary.js      # Integrare serviciu cloud media (dacă se dorește profil)
│   │   └── mongodb.js         # Rutină conexiune cu baza de date MongoDB Atlas
│   ├── controllers/           # Logica operațională a rutelor de API:
│   │   ├── adminController.js # Rute autentificare admin principal
│   │   ├── operatorController.js # Înregistrare, profile și comutare comenzi hardware
│   │   └── telemetrieController.js # Salvare telemetrie de la robot și listare istoric
│   ├── middlewares/           # Verificatoare intermediare de acces:
│   │   ├── authAdmin.js       # Validare token JWT de administrator
│   │   └── authUser.js        # Validare token JWT de operator
│   ├── models/                # Structurile schematice de date (Mongoose/MongoDB):
│   │   ├── telemetrieModel.js # Definire câmpuri unghiuri, tensiune, curent, mod și timp
│   │   └── userModel.js       # Definire schemă conturi operatori
│   ├── routes/                # Rutele API expuse de server:
│   │   ├── adminRoute.js      # Rutări proces login administrator
│   │   ├── operatorRoute.js   # Rutări profil și control motoare
│   │   └── telemetrieRoute.js # Rutări recepție date robot și listă interfață
│   ├── .env                   # Variabilele secrete de mediu (MongoDB URI, JWT, parole)
│   ├── server.js              # Fișierul de pornire al serverului backend Express
│   └── package.json           # Scripturile și dependințele necesare Node.js
│
├── frontend/                  # Folder adițional de rezervă pentru interfața client
└── README.md                  # Manualul curent de utilizare, instalare și arhitectură
```

---

##  Instrucțiuni de Instalare, Compilare și Lansare

###  Pasul 1: Configurarea și Încărcarea Firmware-ului pe Arduino

1. **Instalare Arduino IDE:** Descărcați și instalați ultima versiune de Arduino IDE.
2. **Adăugare Plăcuță în IDE:** 
   * Accesați *Tools -> Board -> Boards Manager*.
   * Căutați **Arduino UNO R4 Boards** și instalați pachetul oficial de suport.
3. **Instalare Biblioteci Necesare:** Mergi la *Tools -> Manage Libraries* și instalați următoarele biblioteci:
   * `WiFiS3` *(inclusă nativ cu pachetul plăcuței)*
   * `NTPClient` de la *Fabrice Weinberg*
   * `Servo` *(inclusă nativ)*
   * `LiquidCrystal_I2C` de la *Frank de Brabander*
   * `OneWire` de la *Paul Stoffregen*
   * `DallasTemperature` de la *Miles Burton*
   * `Adafruit INA219` de la *Adafruit*
   * `SolarCalculator` de la *JP*
   * `ArduinoJson` de la *Benoit Blanchon*
4. **Configurare Date Conexiune:** Deschideți fișierul [TrackerSolar.ino](file:///c:/Users/patih/OneDrive/Desktop/-Licenta-%20%20%20%20TrackerSolar/arduino/TrackerSolar/TrackerSolar.ino) și modificați linia 17, 18 și 21 cu credențialele dvs. locale de Wi-Fi și IP-ul calculatorului pe care rulează backend-ul:
   ```cpp
   char ssid[] = "Numele_Retelei_Tale_WiFi"; 
   char pass[] = "Parola_Retelei_Tale_WiFi"; 
   char server[] = "192.168.X.X"; // Adresa IP locală a calculatorului dvs. (aflați prin `ipconfig` în terminal)
   int port = 4000;
   ```
5. **Compilare și Încărcare:** Conectați plăcuța Arduino UNO R4 WiFi la computer prin cablul USB, selectați portul serial corespunzător și apăsați butonul **Upload** (săgeata spre dreapta din Arduino IDE).

---

###  Pasul 2: Configurarea și Lansarea Serverului Backend

1. **Instalare Node.js:** Asigurați-vă că aveți instalat **Node.js** (recomandat versiunea LTS) pe computer.
2. **Instalare Dependențe:** Deschideți un terminal în folderul `backend/` și rulați:
   ```bash
   cd backend
   npm install
   ```
3. **Configurare Fișier de Mediu (.env):** În folderul `backend/`, creați sau editați fișierul `.env` cu următoarele chei securizate:
   ```env
   MONGODB_URI = "mongodb+srv://utilizator:parola@cluster0.xxxxx.mongodb.net/nume_baza_date"
   ADMIN_EMAIL = "emailul_tau@admin.com"
   ADMIN_PASSWORD = "parola_ta_secreta"
   JWT_SECRET = "cheie_secreta_generica_jwt"
   PORT = 4000
   ```
4. **Lansarea Serverului:** Rulați comanda următoare pentru pornirea în modul de dezvoltare:
   ```bash
   npm run dev
   ```
   Serverul va porni pe portul `4000` și va stabili conexiunea securizată cu MongoDB Atlas. Veți vedea mesajul:
   `Server Tracker Solar a pornit pe portul: 4000`  
   `Database conectata` *(dacă link-ul din URI este valid)*

---

###  Pasul 3: Lansarea Interfeței de Administrare (React)

1. **Instalare Dependențe:** Deschideți un terminal nou în folderul `admin/` și rulați:
   ```bash
   cd admin
   npm install
   ```
2. **Configurare Adresă Server (.env):** Asigurați-vă că fișierul `admin/.env` conține adresa corectă a backend-ului dumneavoastră:
   ```env
   VITE_BACKEND_URL='http://192.168.X.X:4000' # Folosește adresa IP locală sau localhost
   ```
3. **Lansare Aplicație React:** Rulați comanda de rulare locală:
   ```bash
   npm run dev
   ```
4. **Accesare Interfață:** Deschideți browserul web la adresa afișată în consolă (de regulă `http://localhost:5173`).
5. **Autentificare:** Introduceți emailul și parola setate în `.env`-ul de la backend la Pasul 2 (ex: `emailul_tau@admin.com` / `parola_ta_secreta`) pentru a obține controlul manual complet și vizualizarea grafică.

---

##  Moduri de Funcționare Detaliate

### Modul Astronomic (Mod 1)
Firmware-ul extrage ora serverului NTP (sau ora curentă preluată ca răspuns la sincronizarea cu backend-ul) și determină cu precizie minutul, ora și ziua din an. Folosind biblioteca `SolarCalculator`, sistemul determină unghiul geometric ideal de azimut și elevație solară corespunzător longitudinii și latitudinii Timișoarei. Servomotoarele se orientează pe baza acestor unghiuri calculate teoretic, indiferent de prezența norilor.

### Modul Automat LDR (Mod 2 - Implicit)
Cele 4 fotorezistențe înregistrează continuu valorile de intensitate luminoasă de pe cer. Microcontrolerul calculează medii diferențiale:
* **Diferența Orizontală (Azimut):** Se compară intensitatea dintre partea stângă (LDR SS + LDR SJ) și partea dreaptă (LDR DS + LDR DJ). Dacă diferența depășește o anumită toleranță, servomotorul de bază se rotește spre zona mai luminoasă.
* **Diferența Verticală (Elevație):** Se compară intensitatea dintre partea de sus (LDR SS + LDR DS) și partea de jos (LDR SJ + LDR DJ). Servomotorul de elevație se rotește pe verticală pentru eliminarea erorii geometrice.

### Modul Manual (Mod 3)
În momentul comutării în modul manual de pe site, Arduino primește instrucțiunea `setMod: 3` de la server și blochează controlul automat (LDR sau Astronomic). Plăcuța va asculta exclusiv valorile de unghi transmise prin API (`setH` și `setV`) de la săgețile orientative din browser, asigurând depanarea sau securizarea manuală a poziției fizice.
