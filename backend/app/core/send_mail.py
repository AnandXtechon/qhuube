from typing import Dict, List
import aiosmtplib
from email.message import EmailMessage
from app.core.helper import generate_manual_review_summary


async def send_manual_vat_email(to_email: str, user_email: str, attachment: bytes, manual_review_rows: List[Dict]):

    summary_text = generate_manual_review_summary(manual_review_rows)
    msg = EmailMessage()
    msg["Subject"] = "Manual VAT Processing Required"
    msg["From"] = "mailer@xtechon.com"
    msg["To"] = to_email

    msg.set_content(
        f"""
        Some rows from a VAT submission could not be processed automatically.

        User Email: {user_email}

        Please review the attached Excel file which contains:
        - Enriched VAT Report
        - Manual Review Rows
        - Summary by Country

        {summary_text}
        """
    )

    msg.add_attachment(
        attachment,
        maintype="application",
        subtype="vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        filename="manual_vat_review.xlsx",
    )

    await aiosmtplib.send(
        msg,
        hostname="smtp.hostinger.com",
        port=587,
        username="mailer@xtechon.com",
        password="IndiaIntern@2025",
        start_tls=True,
    )
