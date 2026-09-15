import { Resend } from 'resend';

interface ApplicationNotification {
  applicationId: string;
  jobTitle: string;
  name: string;
  email: string;
  phone: string;
  coverLetter?: string | null;
  cvFilename?: string | null;
}

/** Applicant-supplied text goes into an HTML email, so it must be escaped. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildHtml(
  application: ApplicationNotification,
  adminUrl: string,
): string {
  const rows: Array<[string, string]> = [
    ['Role', application.jobTitle],
    ['Name', application.name],
    ['Email', application.email],
    ['Phone', application.phone],
    ['CV', application.cvFilename ?? 'Not attached'],
  ];

  const tableRows = rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:8px 16px 8px 0;color:#4A5568;font-size:14px;vertical-align:top;white-space:nowrap;">${escapeHtml(label)}</td>
          <td style="padding:8px 0;color:#1A1A1A;font-size:14px;font-weight:600;">${escapeHtml(value)}</td>
        </tr>`,
    )
    .join('');

  const coverLetter = application.coverLetter?.trim()
    ? `<div style="margin-top:24px;">
         <p style="margin:0 0 8px;color:#4A5568;font-size:14px;">Why they want the job</p>
         <div style="padding:16px;background:#F7F7F7;border-radius:6px;color:#1A1A1A;font-size:14px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(application.coverLetter)}</div>
       </div>`
    : '';

  return `<!doctype html>
<html>
  <body style="margin:0;padding:24px;background:#F7F7F7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:8px;padding:32px;">
      <p style="margin:0 0 4px;color:#FF6B35;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">New application</p>
      <h1 style="margin:0 0 24px;color:#1A1A1A;font-size:22px;">${escapeHtml(application.jobTitle)}</h1>
      <table style="width:100%;border-collapse:collapse;">${tableRows}</table>
      ${coverLetter}
      <a href="${adminUrl}" style="display:inline-block;margin-top:28px;padding:12px 24px;background:#FF6B35;color:#1A1A1A;font-size:14px;font-weight:700;text-decoration:none;border-radius:6px;">Open in admin</a>
      <p style="margin:24px 0 0;color:#4A5568;font-size:12px;line-height:1.6;">
        The CV is downloadable from the admin panel. Attachments are not included
        in this email so the file stays behind the login.
      </p>
    </div>
  </body>
</html>`;
}

function buildText(
  application: ApplicationNotification,
  adminUrl: string,
): string {
  return [
    `New application: ${application.jobTitle}`,
    '',
    `Name:  ${application.name}`,
    `Email: ${application.email}`,
    `Phone: ${application.phone}`,
    `CV:    ${application.cvFilename ?? 'Not attached'}`,
    '',
    application.coverLetter?.trim()
      ? `Why they want the job:\n${application.coverLetter}`
      : '',
    '',
    `Open in admin: ${adminUrl}`,
  ]
    .filter((line) => line !== undefined)
    .join('\n');
}

/**
 * Notifies the careers inbox. Called after the application row is committed, so
 * a mail failure is logged and swallowed rather than losing the application.
 * Returns whether the mail actually went out.
 */
export async function sendApplicationNotification(
  application: ApplicationNotification,
): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CAREERS_NOTIFY_EMAIL;
  const from = process.env.CAREERS_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    console.warn(
      '[careers-email] RESEND_API_KEY, CAREERS_NOTIFY_EMAIL or CAREERS_FROM_EMAIL is unset; skipping notification.',
    );
    return false;
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3001';
  const adminUrl = `${baseUrl}/admin/careers/applications/${application.applicationId}`;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: application.email,
      subject: `New application — ${application.jobTitle} — ${application.name}`,
      html: buildHtml(application, adminUrl),
      text: buildText(application, adminUrl),
    });

    if (error) {
      console.error('[careers-email] Resend rejected the message:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('[careers-email] Failed to send notification:', err);
    return false;
  }
}
