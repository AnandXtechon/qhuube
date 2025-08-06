# Qhuube - EU VAT OSS Compliance App

![Qhuube Logo](public/qhuube-logo.png)

Streamline EU VAT OSS tax reporting with Qhuube - a comprehensive solution for businesses to handle VAT calculations, data validation, and compliant reporting across EU member states.

## 🌟 Features

- **📁 File Upload**: Drag-and-drop interface for CSV/Excel transaction files
- **✏️ Data Correction**: Inline editing for invalid/missing VAT data
- **💳 Secure Payments**: PCI-compliant payment processing via Stripe
- **📊 Report Generation**: One-click Excel exports for VAT summaries and country breakdowns
- **📧 Email Alerts**: Automated notifications for manual review cases
- **🔒 GDPR Compliance**: In-memory processing with no permanent data storage

## 🛠️ Tech Stack

| Component       | Technologies                          |
|-----------------|---------------------------------------|
| **Frontend**    | Next.js, Tailwind CSS, Framer Motion  |
| **Backend**     | FastAPI (Python), Pandas              |
| **Data Handling**| openpyxl, pandas                     |
| **Payments**    | Stripe                                |
| **Export**      | Excel (.xlsx)                         |

## 🚀 Installation

### Prerequisites
- Node.js (v16+)
- Python (v3.8+)
- Stripe account (for payment processing)

### 📁 Project Structure
qhuube/
├── backend/
│   ├── main.py                 # FastAPI application entry point
│   ├── routes/
│   │   ├── upload.py           # File upload handling
│   │   ├── payment.py          # Stripe integration
│   │   └── reports.py          # Report generation
│   ├── utils/
│   │   ├── validator.py        # Data validation logic
│   │   ├── vat_calculator.py   # VAT calculation engine
│   │   └── mailer.py           # Email notifications
│   └── requirements.txt        # Python dependencies
│
├── frontend/
│   ├── pages/
│   │   ├── upload.js           # File upload interface
│   │   ├── correction.js       # Data correction UI
│   │   ├── payment.js          # Stripe checkout
│   │   └── reports.js          # Report dashboard
│   ├── components/
│   │   ├── FileUploader.js     # Drag-and-drop component
│   │   ├── DataTable.js        # Editable data table
│   │   └── ReportViewer.js     # Report preview
│   └── styles/                 # Tailwind CSS styles
│
└── README.md                   # This file

### 🔄 Workflow

## 1. Upload:
Supported formats: .xlsx, .csv
Required fields: Order Date, Country, Net Price, VAT Rate
Real-time validation before processing

## 2. Correction:
Flag invalid entries (VAT number, country mismatch)
Inline editing or re-upload capabilities

## 3. Payment:
Secure checkout via Stripe
Payment confirmation unlocks report generation

## 4. Reports:
VAT summary by country
Downloadable Excel reports:
VAT Report
Summary Report
Manual Review File (if applicable)

## ⚠️ Known Limitations
Session Management: Single-user sessions only (no multi-user support)
VAT Rules: Real-time lookup (no caching) may cause latency
Scope: Currently supports EU VAT OSS only (IOSS/MOSS in development)
File Size: Maximum 10MB per upload

## 🔒 Security & Compliance
Data Handling: All processing done in-memory; files deleted after download
Payments: Fully PCI-compliant via Stripe
GDPR: No permanent data storage unless explicitly configured
Audit Trail: Session logs available for 30 days (admin access)

## 📞 Support
Technical Issues: devs@qhuube.com
VAT Compliance: vat-support@qhuube.com
Documentation: docs.qhuube.com
📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

### Backend Setup
```bash
# Clone repository
git clone https://github.com/your-org/qhuube.git
cd qhuube/backend

# Install dependencies
pip install -r requirements.txt

# Run development server
uvicorn main:app --reload

# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Run development server
npm run dev

