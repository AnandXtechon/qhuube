# Qhuube - EU VAT OSS Compliance Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/Version-1.0.0-brightgreen.svg)]()
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

<div align="center">
  <img src="public/qhuube-logo.png" alt="Qhuube Logo" width="200"/>
  
  **Streamline your EU VAT OSS tax reporting** with Qhuube - the all-in-one solution for businesses to handle VAT calculations, data validation, and compliant reporting across all EU member states.
</div>

## 🌟 Key Features

| Feature | Description |
|---------|-------------|
| **📁 Smart File Processing** | Drag-and-drop interface supporting CSV/Excel files with automatic format detection |
| **🔍 Real-time Validation** | Instant feedback on data quality with detailed error reporting |
| **✏️ Inline Data Correction** | Edit data directly in the interface or re-upload corrected files |
| **💳 Secure Payment Processing** | PCI-compliant payments powered by Stripe |
| **📊 Comprehensive Reporting** | Generate detailed VAT reports with country breakdowns and summaries |
| **📧 Automated Notifications** | Email alerts for manual review cases and report readiness |
| **🔒 GDPR Compliance** | In-memory processing with no permanent data storage |

## 🚀 Quick Start

### Prerequisites
- Node.js v16+ (LTS recommended)
- Python 3.8+
- [Stripe](https://stripe.com) account for payment processing
- Modern web browser (Chrome, Firefox, Safari, or Edge)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/qhuube.git
   cd qhuube
   ```

2. **Set up the backend**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Set up the frontend**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Configure environment variables**
   Create a `.env` file in both `backend` and `frontend` directories with the required variables (see [Configuration](#-configuration) section).

5. **Start the development servers**
   ```bash
   # In the backend directory
   uvicorn main:app --reload
   
   # In a new terminal, in the frontend directory
   npm run dev
   ```

## 🏗️ Project Structure

```
qhuube/
├── backend/                     # Backend server
│   ├── main.py                 # FastAPI application entry point
│   ├── config/                 # Configuration files
│   ├── models/                 # Database models
│   ├── routes/                 # API endpoints
│   │   ├── upload.py           # File upload handling
│   │   ├── payment.py          # Stripe integration
│   │   └── reports.py          # Report generation
│   └── utils/                  # Utility functions
│       ├── validator.py        # Data validation logic
│       ├── vat_calculator.py   # VAT calculation engine
│       └── mailer.py           # Email notifications
│
├── frontend/                   # Frontend application
│   ├── public/                 # Static files
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Page components
│   │   ├── styles/             # Global styles
│   │   └── utils/              # Helper functions
│   └── package.json            # Frontend dependencies
│
├── docs/                      # Documentation
└── tests/                     # Test suites
```

## 🔄 Workflow

### 1. Upload
- **Supported Formats**: .xlsx, .csv (max 10MB)
- **Required Fields**:
  - Order Date (YYYY-MM-DD)
  - Country (2-letter ISO code)
  - Net Price (numeric)
  - VAT Rate (percentage)
  - VAT Number (optional)
- **Validation**: Real-time format and data quality checks

### 2. Data Correction
- **Inline Editing**: Fix errors directly in the interface
- **Bulk Actions**: Apply corrections to multiple rows
- **Validation Rules**: Automatic checks for:
  - VAT number format
  - Country-VAT rate consistency
  - Required field completeness

### 3. Payment & Processing
- Secure checkout via Stripe
- Multiple payment methods supported
- Instant payment verification

### 4. Report Generation
- **VAT Report**: Detailed transaction-level data
- **Summary Report**: Aggregated view by country
- **Audit Trail**: Complete processing history
- **Export Formats**: Excel (.xlsx)

## ⚙️ Configuration

### Backend (.env)
```env
# Server Configuration
APP_ENV=development
HOST=0.0.0.0
PORT=8000
DEBUG=True

# Database (if applicable)
DATABASE_URL=sqlite:///./qhuube.db

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# Email (for notifications)
SMTP_SERVER=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASSWORD=your_email_password
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

## 🧪 Testing

Run the test suite:

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd ../frontend
npm test
```

## 🚀 Deployment

### Production
1. Set `APP_ENV=production` in your backend `.env`
2. Configure a production database (PostgreSQL recommended)
3. Set up a reverse proxy (Nginx/Apache)
4. Use a process manager (PM2, Gunicorn with Uvicorn workers)

### Docker
```bash
docker-compose up --build
```

## 🔒 Security & Compliance

- **Data Protection**: All processing done in-memory
- **GDPR Compliance**: No permanent storage of sensitive data
- **PCI DSS**: Payment processing via Stripe (Level 1 compliant)
- **Encryption**: TLS 1.2+ for all data in transit
- **Audit Logs**: 30-day retention for compliance

## 📚 Documentation

For detailed documentation, please visit our [documentation site](https://docs.qhuube.com).

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, please contact:
- **Technical Support**: support@qhuube.com
- **Sales & Billing**: sales@qhuube.com
- **Security Issues**: security@qhuube.com

---


