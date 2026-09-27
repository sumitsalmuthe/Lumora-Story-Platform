const nodemailer = require("nodemailer");

// ======================================
// SMTP Configuration
// ======================================

const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT || 587);
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const smtpFrom =
  process.env.SMTP_FROM || smtpUser;

// ======================================
// Validate SMTP Configuration
// ======================================

if (
  !smtpHost ||
  !smtpUser ||
  !smtpPass
) {
  console.warn(
    "⚠️ SMTP configuration is incomplete."
  );
}

// ======================================
// Nodemailer Transporter
// ======================================

const transporter =
  nodemailer.createTransport({
    host: smtpHost,

    port: smtpPort,

    secure:
      smtpPort === 465,

    auth: {
      user: smtpUser,
      pass: smtpPass,
    },

    pool: true,

    maxConnections: 5,

    maxMessages: 100,

    connectionTimeout: 15000,

    greetingTimeout: 15000,

    socketTimeout: 20000,
  });

// ======================================
// Verify SMTP Connection
// ======================================

const verifySMTP = async () => {
  try {
    await transporter.verify();

    console.log(
      "✅ SMTP Server Connected"
    );

    return true;
  } catch (error) {
    console.error(
      "❌ SMTP Connection Failed:",
      error.message
    );

    return false;
  }
};

// ======================================
// Send Email
// ======================================

const sendEmail = async ({
  to,
  subject,
  html,
  text,
}) => {
  if (!to) {
    throw new Error(
      "Recipient email address is required"
    );
  }

  const recipient =
    String(to)
      .trim()
      .toLowerCase();

  if (!recipient) {
    throw new Error(
      "Recipient email address is invalid"
    );
  }

  try {
    console.log(
      `📧 Sending email to: ${recipient}`
    );

    const info =
      await transporter.sendMail({
        from: smtpFrom,

        to: recipient,

        subject,

        text,

        html,
      });

    console.log(
      `✅ Email sent to: ${recipient}`
    );

    console.log(
      `📨 Message ID: ${info.messageId}`
    );

    console.log(
      `📬 Accepted: ${
        info.accepted?.join(", ") ||
        "none"
      }`
    );

    console.log(
      `📭 Rejected: ${
        info.rejected?.join(", ") ||
        "none"
      }`
    );

    if (
      info.rejected &&
      info.rejected.includes(recipient)
    ) {
      throw new Error(
        `SMTP rejected recipient: ${recipient}`
      );
    }

    return info;
  } catch (error) {
    console.error(
      `❌ Email sending failed for ${recipient}:`,
      error
    );

    throw error;
  }
};

// ======================================
// Email Verification
// ======================================

const sendEmailVerificationEmail =
  async ({
    to,
    username,
    verificationUrl,
  }) => {
    const safeUsername =
      username || "there";

    const subject =
      "Verify your Lumora email address";

    const text = `
Hello ${safeUsername},

Welcome to Lumora!

Please verify your email address by opening the link below:

${verificationUrl}

This verification link will expire in 15 minutes.

If you did not create a Lumora account, you can safely ignore this email.

Lumora
Read • Write • Inspire
`;

    const html = `
<!DOCTYPE html>

<html lang="en">

<head>
  <meta charset="UTF-8" />

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />

  <title>
    Verify your Lumora email
  </title>
</head>

<body
  style="
    margin:0;
    padding:0;
    background:#f7f7f7;
    font-family:Arial,Helvetica,sans-serif;
    color:#171717;
  "
>

  <div
    style="
      max-width:600px;
      margin:40px auto;
      background:#ffffff;
      border-radius:16px;
      padding:40px;
      box-sizing:border-box;
    "
  >

    <h1
      style="
        margin:0 0 30px;
        color:#ff6048;
        font-size:32px;
      "
    >
      Lumora
    </h1>

    <h2
      style="
        margin:0 0 20px;
        font-size:28px;
      "
    >
      Verify your email
    </h2>

    <p
      style="
        font-size:16px;
        line-height:1.7;
        margin:0 0 18px;
      "
    >
      Hello ${safeUsername},
    </p>

    <p
      style="
        font-size:16px;
        line-height:1.7;
        margin:0 0 28px;
      "
    >
      Welcome to Lumora!
      Please verify your email address
      to complete your account setup.
    </p>

    <a
      href="${verificationUrl}"
      target="_blank"
      rel="noopener noreferrer"
      style="
        display:inline-block;
        background:#ff6048;
        color:#ffffff;
        text-decoration:none;
        font-weight:700;
        font-size:16px;
        padding:15px 24px;
        border-radius:10px;
      "
    >
      Verify Email Address
    </a>

    <p
      style="
        margin:32px 0 10px;
        font-size:15px;
        line-height:1.7;
      "
    >
      This verification link will expire
      in <strong>15 minutes</strong>.
    </p>

    <p
      style="
        margin:0;
        font-size:15px;
        line-height:1.7;
      "
    >
      If you did not create a Lumora
      account, you can safely ignore
      this email.
    </p>

    <hr
      style="
        border:none;
        border-top:1px solid #eeeeee;
        margin:32px 0;
      "
    />

    <p
      style="
        margin:0;
        font-size:13px;
        color:#777777;
      "
    >
      Lumora<br />
      Read • Write • Inspire
    </p>

  </div>

</body>

</html>
`;

    return sendEmail({
      to,
      subject,
      text,
      html,
    });
  };

// ======================================
// Export
// ======================================

module.exports = {
  transporter,
  verifySMTP,
  sendEmail,
  sendEmailVerificationEmail,
};