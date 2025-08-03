## 📄 Qhuube – EU VAT OSS Compliance App Documentation

---

### **1. Introduction**

**What is Qhuube?**
Qhuube is a web application designed to streamline **EU VAT OSS (One Stop Shop)** tax reporting for businesses. It allows users to upload transaction data, correct invalid entries, calculate VAT across EU member states, and generate compliant summary reports — all in one place.

**Who is this for?**

* Internal developers
* HR/compliance teams
* Financial operations
* External auditors (read-only access if needed)

---

### **2. Key Features**

* 📁 **Upload** transaction files (CSV or Excel)
* ✏️ **Correction** of invalid or missing VAT-related data
* 💳 **Secure payment via Stripe** for compliance services
* 📊 **Overview & Download** VAT OSS summary report in Excel
* 📧 Email reports with highlights for manual review (if needed)

---

### **3. Tech Stack**

| Component         | Tech Used                            |
| ----------------- | ------------------------------------ |
| **Frontend**      | Next.js, Tailwind CSS, Framer Motion |
| **Backend**       | FastAPI (Python), Pandas             |
| **Data Handling** | Excel via `openpyxl`, `pandas`       |
| **Payments**      | Stripe                               |
| **Export Format** | Excel files (.xlsx)                  |

---

### **4. App Workflow**

#### 🔼 Step 1: Upload

* Supported formats: `.xlsx`, `.csv`
* Required fields: Order Date, Country, Net Price, VAT Rate, etc.
* Validations are applied before processing

#### 🛠️ Step 2: Correction

* Invalid or missing data (e.g. VAT number, country mismatch) is flagged
* Users can correct data inline or re-upload

#### 💰 Step 3: Payment

* Users are prompted to pay via **Stripe** before proceeding to report generation
* Stripe handles card payments securely and returns success callback

#### 📥 Step 4: Overview & Download

* Once processing is complete, the user sees a summary of:

  * Net Total
  * VAT Amount
  * Gross Total by country
* Users can download:

  * VAT Report
  * Summary Report
  * (Manual review file if applicable)

---

### **5. Manual Review Handling**

If the system cannot find VAT rules or country info:

* Rows are flagged as `"Not Found"`
* User receives an email with:

  * Excel report (highlighted rows)
  * JSON-style table for flagged entries
* Email is sent from `mailer@xtechon.com`

---

### **6. Security & Compliance**

* Session data stored temporarily (cleared after report is downloaded)
* No permanent storage unless extended via cloud provider (optional)
* Stripe handles all payment security (PCI-compliant)
* Excel reports are generated in-memory and emailed or downloaded directly

---

### **7. Developer Setup**

#### Backend:

```bash
# Install dependencies
pip install fastapi uvicorn pandas openpyxl stripe

# Run server
uvicorn main:app --reload
```

#### Frontend:

```bash
# Install and run frontend
npm install
npm run dev
```

#### Folder Structure:

```
qhuube/
├── backend/
│   ├── main.py
│   ├── routes/
│   └── utils/
├── frontend/
│   ├── pages/
│   ├── components/
│   └── styles/
```

---

### **8. Known Limitations**

* No multi-user sessions yet (per-session memory)
* VAT rules not cached (subject to real-time lookup latency)
* Currently supports EU VAT OSS — IOSS and MOSS support in progress

---

### **9. Contact Info**

For questions, bugs, or access:

* **Tech Team**: [devs@qhuube.com](mailto:devs@qhuube.com)
* **Compliance Help**: [vat-support@qhuube.com](mailto:vat-support@qhuube.com)

