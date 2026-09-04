"""Contact-form backend for the portfolio site.

Run locally with:
    uvicorn main:app --reload --port 8000

Without SMTP_HOST/SMTP_USERNAME/SMTP_PASSWORD set (see .env.example), inquiries
are validated and logged to the console but no real email is sent — useful for
local development and testing the frontend end-to-end. Configure those three
env vars (e.g. a Gmail address + App Password) to actually deliver email.
"""

import logging
import os
import smtplib
from email.mime.text import MIMEText

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field

load_dotenv()

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger("portfolio-contact")

app = FastAPI(title="Anbu Portfolio Contact API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:4200",
        "http://127.0.0.1:4200",
    ],
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)

CONTACT_TO_EMAIL = os.environ.get("CONTACT_TO_EMAIL", "anbujas18@gmail.com")
SMTP_HOST = os.environ.get("SMTP_HOST")
SMTP_PORT = int(os.environ.get("SMTP_PORT", "587"))
SMTP_USERNAME = os.environ.get("SMTP_USERNAME")
SMTP_PASSWORD = os.environ.get("SMTP_PASSWORD")
FROM_EMAIL = os.environ.get("FROM_EMAIL") or SMTP_USERNAME or "no-reply@anbu.dev"

SMTP_CONFIGURED = bool(SMTP_HOST and SMTP_USERNAME and SMTP_PASSWORD)


class InquiryRequest(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    email: EmailStr
    message: str = Field(default="", max_length=500)
    projectName: str = Field(min_length=1, max_length=200)


class InquiryResponse(BaseModel):
    success: bool
    message: str


def send_email(subject: str, body: str) -> None:
    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = FROM_EMAIL
    msg["To"] = CONTACT_TO_EMAIL

    with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=10) as server:
        server.starttls()
        server.login(SMTP_USERNAME, SMTP_PASSWORD)
        server.sendmail(FROM_EMAIL, [CONTACT_TO_EMAIL], msg.as_string())


@app.post("/api/send-inquiry", response_model=InquiryResponse)
def send_inquiry(payload: InquiryRequest) -> InquiryResponse:
    subject = f"Portfolio Inquiry: {payload.projectName} from {payload.name}"
    body = (
        f"Name: {payload.name}\n"
        f"Email: {payload.email}\n"
        f"Project: {payload.projectName}\n"
        f"Message: {payload.message or 'No message provided'}"
    )

    logger.info("New portfolio inquiry received:\n%s", body)

    if not SMTP_CONFIGURED:
        logger.warning(
            "SMTP not configured (set SMTP_HOST / SMTP_USERNAME / SMTP_PASSWORD — see .env.example). "
            "Inquiry was logged above but no email was actually sent."
        )
        return InquiryResponse(success=True, message="Email sent successfully")

    try:
        send_email(subject, body)
    except Exception as exc:  # noqa: BLE001 - surface any SMTP failure as a clean 502
        logger.exception("Failed to send inquiry email")
        raise HTTPException(status_code=502, detail="Failed to send email. Please try again later.") from exc

    return InquiryResponse(success=True, message="Email sent successfully")


@app.get("/api/health")
def health() -> dict:
    return {"status": "ok", "smtp_configured": SMTP_CONFIGURED}
