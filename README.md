# CertiVerify — Cloud Digital Certificate Verification Authority

CertiVerify is an enterprise-grade digital certificate generation, management, and cryptographic verification system powered by **Spring Boot 3**, **PostgreSQL / H2**, **AWS S3 / Local Storage**, **OpenPDF**, **ZXing QR Engine**, and a modular, component-driven **React 19 + Vite** frontend with a pinkish-blue aesthetic.

---

## 🚀 Live Services

- **Frontend Portal**: [http://localhost:5173](http://localhost:5173)
- **Backend REST API**: [http://localhost:8090/api](http://localhost:8090/api)
- **H2 Database Console**: [http://localhost:8090/h2-console](http://localhost:8090/h2-console) (JDBC URL: `jdbc:h2:file:./data/certiverify_db`)

---

## 🏗️ Clean Modular Frontend Architecture

The frontend is organized cleanly into dedicated, reusable layers:

```
frontend/src/
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx                  # Top navigation with brand logo & route indicators
│   │   └── Footer.jsx                  # Architecture credentials & cloud badges
│   ├── verification/
│   │   ├── VerifySearch.jsx            # Search bar with QR scan trigger & quick sample pills
│   │   ├── VerificationResultCard.jsx  # Detailed verification status, SHA-256 hash & action links
│   │   ├── QrScannerModal.jsx          # Drag-and-drop QR image upload & live camera video scanner
│   │   ├── CertificatePreviewModal.jsx # Visual landscape certificate preview
│   │   └── BadgeEmbedModal.jsx         # Copyable HTML & Markdown dynamic SVG badge snippets
│   ├── admin/
│   │   ├── AdminLogin.jsx              # Admin authentication with 1-click demo fill
│   │   ├── AdminDashboard.jsx          # 5 KPI cards, search, status filter & paginated data table
│   │   ├── IssueCertificateModal.jsx   # Form modal to issue credentials (with custom or auto IDs)
│   │   ├── BulkUploadModal.jsx         # Batch CSV issuance with downloadable sample template
│   │   └── RevokeModal.jsx             # Revocation confirmation with custom audit reason
│   └── home/
│       ├── StatsCounters.jsx           # Live public KPI statistics
│       └── FeaturesSection.jsx         # 4-pillar trust architecture (QR, SHA-256, OpenPDF, S3)
├── context/
│   └── AuthContext.jsx                 # React Context for admin JWT authentication
├── pages/
│   ├── HomePage.jsx                    # Public verification landing view
│   └── AdminPage.jsx                   # Protected admin management view
├── services/
│   └── api.js                          # Centralized REST API client
└── App.jsx                             # Clean application root coordinator
```

---

## 🔑 Default Administrator Credentials

| Field | Value |
|---|---|
| **Username** | `admin` |
| **Password** | `admin123` |
| **Email** | `admin@certiverify.com` |
| **Role** | `ROLE_ADMIN` |

*(You can also click the **"Quick Fill Demo Credentials"** button on the Admin Sign-In page).*

---

## 🧪 Pre-Seeded Demo Credentials for Testing

| Certificate ID | Recipient Name | Status | Course Title | Test Highlights |
|---|---|---|---|---|
| `CV-2026-CLOUD01` | Sarah Jenkins | **VERIFIED** | AWS Certified Solutions Architect | Active verified status, Confetti explosion, SHA-256 fingerprint, PDF & audit report download |
| `CV-2026-AI8899` | Alexander Zhao | **VERIFIED** | Deep Learning & Agentic Systems | First Class Distinction credential |
| `CV-2025-REVOKED9` | Marcus Vance | **REVOKED** | Executive Cybersecurity Leadership | Displays warning banner & revocation reason |
| `CV-2024-EXP404` | Elena Rostova | **EXPIRED** | Agile Scrum Master Professional | Expired credential check |

---

## 🛠️ How to Run & Test

### Backend
```bash
cd backend
mvn test               # Runs all 4 JUnit unit tests (100% pass)
mvn spring-boot:run    # Starts backend on http://localhost:8090
```

### Frontend
```bash
cd frontend
npm run build          # Builds production bundle
npm run dev            # Starts Vite dev server on http://localhost:5173
```
