# SISTEM MONITORING JARINGAN DAN VISUALISASI TOPOLOGI INTERAKTIF (UBJ-NMS)
### Berbasis Web Menggunakan Protokol ICMP dan SNMP pada Infrastruktur Kampus Universitas Banten Jaya

[![Laravel 11](https://img.shields.io/badge/Laravel-11.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com)
[![React 19](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16.x-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Go 1.22+](https://img.shields.io/badge/Golang-1.22+-00ADD8?style=for-the-badge&logo=go&logoColor=white)](https://go.dev)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com)

---

## 1. Abstrak & Deskripsi Proyek

Penelitian skripsi ini merancang dan mengimplementasikan **Sistem Monitoring Jaringan dan Visualisasi Topologi Interaktif (Network Monitoring System / NMS)** untuk mengawasi seluruh infrastruktur jaringan backbone, router border, switch distribusi, access point, dan server di lingkungan kampus **Universitas Banten Jaya (UBJ)**.

Sistem dibangun menggunakan pendekatan **Dual-Engine Architecture**:
1. **High-Performance Polling Daemon (Golang)**: Menggunakan model *goroutine worker pool* untuk melakukan pengecekan ketersediaan (availability) via protokol **ICMP Echo (Ping)** dan pengukuran telemetri beban perangkat (CPU, RAM, Uptime, Bandwidth Interface) via protokol **SNMP (Simple Network Management Protocol v2c/v3)** secara konkuren dan non-blocking.
2. **Central Management & NOC Web Platform (Laravel 11 + Inertia.js + React 19 + TypeScript)**: Mengelola otorisasi berbasis peran (RBAC), deduplikasi insiden alert, penyimpanan metrik time-series ke **PostgreSQL 16**, serta menyajikan antarmuka *Network Operations Center* (NOC) bernuansa gelap (*dark theme*) dengan kanvas topologi interaktif berbasis **React Flow** dan streaming sinkronisasi data langsung via **Laravel Reverb WebSocket**.

---

## 2. Arsitektur Sistem (Dual-Engine)

```mermaid
graph TD
    subgraph Kampus UBJ Network Infrastructure
        R1[Border Router Mikrotik CCR]
        SW1[Core Switch Cisco Catalyst]
        AP1[Access Point Unifi / Ruijie]
        SRV1[Server SIAKAD & E-Learning]
    end

    subgraph Monitoring Engine Daemon (Golang)
        WP[Goroutine Worker Pool]
        ICMP[ICMP Echo Pinger]
        SNMP[SNMP v2c/v3 Poller]
        HTTP_C[REST API Ingestion Client]
    end

    subgraph Backend & Realtime Layer (Laravel 11)
        API[Ingestion API Controller]
        AS[Alert Evaluation Service]
        PG[(PostgreSQL 16 Database)]
        REV[Laravel Reverb WebSocket Server]
    end

    subgraph Frontend NOC Dashboard (Inertia + React 19)
        NOC[NOC Dashboard & Charts]
        TOPO[Interactive Topology Canvas - React Flow]
        ALERTS[Incident Management & Alerts]
        REP[SLA Reports & CSV Export]
    end

    WP -->|ICMP Echo Request| R1 & SW1 & AP1 & SRV1
    WP -->|SNMP Get/Walk| R1 & SW1 & AP1 & SRV1
    R1 & SW1 & AP1 & SRV1 -->|Ping & SNMP Response| WP
    WP --> ICMP & SNMP
    ICMP & SNMP --> HTTP_C
    HTTP_C -->|Bearer Token Ingest| API
    API --> AS
    API --> PG
    AS -->|Trigger / Auto-Resolve| PG
    AS -->|Broadcast Event| REV
    REV -->|WebSocket Push ws://8080| NOC & TOPO & ALERTS
```

---

## 3. Fitur Utama

- **Real-Time NOC Dashboard**:
  - Metrik agregat ketersediaan jaringan (SLA %), perangkat online/offline, insiden aktif.
  - Grafik tren 24 jam latensi, packet loss, dan beban rata-rata CPU berbasis Recharts.
  - Quick device cards dengan status indikator real-time.
- **Kanvas Topologi Jaringan Interaktif**:
  - Diagram jaringan dinamis berbasis **React Flow**.
  - Drag-and-drop node perangkat dengan penyimpanan koordinat otomatis ke database (`pos_x`, `pos_y`).
  - Representasi visual kabel/link dengan penanda kecepatan port (1G, 10G, dsb.) dan status jalur (garis putus merah jika perangkat down).
  - Fitur *Auto-Hierarchical Layout* (Firewall &rarr; Router &rarr; Switch &rarr; AP/Server).
- **Polling Daemon Berkecepatan Tinggi (Golang)**:
  - Eksekusi ratusan target secara konkuren melalui *bounded worker pool*.
  - Kalkulasi RTT latensi (min/avg/max/jitter) dan packet loss.
  - SNMP v2c dan v3 (USM SHA/AES) untuk membaca `sysDescr`, `sysUptime`, `hrProcessorLoad`, `hrStorage`, dan `ifTable` (in/out octets).
- **Alert Engine & Deduplikasi Insiden**:
  - Ambang batas (*threshold*) latensi, packet loss, CPU, dan memori dapat dikonfigurasi melalui panel pengaturan.
  - Mencegah spam duplikasi alert; eskalasi keparahan (WARNING &rarr; CRITICAL).
  - Resolusi otomatis (*auto-resolve*) saat metrik perangkat kembali normal.
  - Riwayat audit penanganan insiden (*acknowledgement* & resolusi dengan catatan operator).
- **Laporan SLA & Ekspor CSV**:
  - Rekap ketersediaan jaringan berdasarkan rentang hari (7, 14, 30, 90 hari).
  - Ekspor log metrik lengkap ke format CSV untuk lampiran skripsi atau arsip institusi.
- **Audit Trail & Keamanan**:
  - Otorisasi berbasis peran: `super_admin`, `admin`, `operator`, `viewer`.
  - Enkripsi kredensial SNMP Community & Passphrase pada level database (Laravel Encrypter).
  - Seluruh aksi pengguna dicatat ke tabel `audit_logs`.

---

## 4. Struktur Database & Model Data

Sistem menggunakan database relasional **PostgreSQL 16**:

| Nama Tabel | Deskripsi |
| :--- | :--- |
| `users` | Akun pengguna sistem dengan peran (RBAC) |
| `devices` | Master perangkat jaringan (IP, tipe, SNMP profile, status, koordinat kanvas) |
| `network_interfaces` | Data antarmuka fisik/logikal perangkat (MAC, status, MTU, speed) |
| `interface_metrics` | Metrik throughput interface (In/Out octets, error, discard) |
| `monitoring_results` | Log berkala time-series ICMP & SNMP (latensi, packet loss, CPU, RAM) |
| `topology_edges` | Relasi interkoneksi link antar port perangkat |
| `alerts` | Tabel tiket insiden aktif dan terselesaikan |
| `alert_histories` | Rekam jejak status alert (TRIGGERED, ACKNOWLEDGED, RESOLVED) |
| `settings` | Konfigurasi sistem dinamis (threshold, interval, polling batch) |
| `audit_logs` | Catatan aktivitas operasional administrator/operator |

---

## 5. Panduan Instalasi & Deployment

### Prasyarat Sistem
- **OS**: Linux (Ubuntu 22.04/24.04 LTS / Debian 12 direkomendasikan)
- **PHP**: Versi 8.3+ (ekstensi: `pdo_pgsql`, `pcntl`, `bcmath`, `curl`, `zip`)
- **Composer**: Versi 2.x
- **Node.js**: Versi 20.x LTS + NPM
- **PostgreSQL**: Versi 16.x
- **Golang**: Versi 1.22+ (untuk monitoring engine)
- **Paket Jaringan**: `iputils-ping`, `net-snmp-tools`

---

### Metode 1: Instalasi Manual (Local / Bare Metal)

#### 1. Clone Repository & Konfigurasi Lingkungan
```bash
git clone https://github.com/riyadhi-firman/skripsi.git /var/www/NMS
cd /var/www/NMS
cp .env.example .env
```

Sesuaikan kredensial PostgreSQL dan konfigurasi Reverb pada `.env`:
```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=ubj_monitoring
DB_USERNAME=ubj_user
DB_PASSWORD=ubj_password

BROADCAST_CONNECTION=reverb
REVERB_APP_ID=174649
REVERB_APP_KEY=f53ne5mejghqmjthwhfq
REVERB_APP_SECRET=iq1occ9rimn7bpbtfiwv
REVERB_HOST="0.0.0.0"
REVERB_PORT=8080

MONITORING_API_URL=http://127.0.0.1:8000
MONITORING_API_TOKEN=ubj_nms_engine_secret_token_2026
```

#### 2. Install Dependensi & Migrasi Database
```bash
# Dependensi PHP
composer install --no-interaction --prefer-dist --optimize-autoloader

# Generate App Key & Migrasi DB beserta Sample Seeder
php artisan key:generate
php artisan migrate:fresh --seed

# Dependensi Frontend & Build Aset
npm install
npm run build
```

#### 3. Kompilasi Golang Monitoring Engine
```bash
cd /var/www/NMS/monitoring-engine
go build -o ubj-nms-engine main.go
```

#### 4. Menjalankan Layanan (Development Mode)
Jalankan 4 proses berikut (dapat menggunakan tmux atau terminal terpisah):

1. **Laravel HTTP Server**:
   ```bash
   php artisan serve --port=8000
   ```
2. **Laravel Reverb WebSocket Server**:
   ```bash
   php artisan reverb:start --port=8080
   ```
3. **Queue Worker (Background Job)**:
   ```bash
   php artisan queue:work
   ```
4. **Golang Monitoring Engine Daemon**:
   ```bash
   cd /var/www/NMS/monitoring-engine
   ./ubj-nms-engine
   ```

---

### Metode 2: Deployment Menggunakan Docker Compose

Sistem telah dilengkapi dengan berkas `docker-compose.yml` multi-container untuk kemudahan deploy:

```bash
docker compose up -d --build
```

Container yang akan berjalan:
1. `ubj_nms_postgres`: PostgreSQL 16 Alpine
2. `ubj_nms_web`: Nginx + PHP 8.3 FPM + Supervisor + Reverb Server
3. `ubj_nms_engine`: Golang Alpine Monitoring Daemon

Akses aplikasi di peramban: `http://localhost:8000`

---

## 6. Kredensial Default Sistem

Setelah menjalankan `php artisan db:seed`, akun berikut siap digunakan:

| Peran (Role) | Email | Password |
| :--- | :--- | :--- |
| **Super Admin** | `admin@ubj.ac.id` | `password` |
| **Operator NOC** | `operator@ubj.ac.id` | `password` |
| **Viewer** | `viewer@ubj.ac.id` | `password` |

---

## 7. Pengujian Sistem (Automated Tests)

Sistem telah dilengkapi dengan pengujian otomatis (*automated testing*):

### Menjalankan Uji Coba Backend (PHPUnit / Pest):
```bash
php artisan test
```
*Mencakup: Pengujian Otentikasi, CRUD Manajemen Perangkat, Enkripsi Kredensial SNMP, Evaluasi Alert & Deduplikasi, serta Keamanan Endpoint Ingestion API.*

### Menjalankan Uji Coba Monitoring Engine (Go Unit Tests):
```bash
cd monitoring-engine
go test -v ./...
```
*Mencakup: Uji muat konfigurasi default/kustom, uji eksekusi pinger ICMP loopback, dan validasi penanganan unreachable host.*

---

## 8. Lisensi & Hak Cipta

Dikembangkan oleh **Riyadhi Firman** untuk keperluan penyusunan Skripsi pada Program Studi Teknik Informatika, Fakultas Teknologi Informasi, **Universitas Banten Jaya (UBJ)**.

Hak Cipta (c) 2026 Universitas Banten Jaya. Dilindungi Undang-Undang.
