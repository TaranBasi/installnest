import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'content-type, authorization',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

function respond(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  })
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })

  // ── Admin: GET /submit-interest → return all leads ──────────────────────
  if (req.method === 'GET') {
    const token = (req.headers.get('Authorization') ?? '').replace('Bearer ', '').trim()
    if (!token || token !== Deno.env.get('ADMIN_TOKEN')) {
      return respond({ error: 'Unauthorized' }, 401)
    }
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )
    const { data, error } = await supabase
      .from('leads')
      .select('id, type, email, postcode, nationwide, business_name, created_at')
      .order('created_at', { ascending: false })
    if (error) return respond({ error: 'Database error' }, 500)
    return respond({ leads: data })
  }

  if (req.method !== 'POST') return respond({ error: 'Method not allowed' }, 405)

  const body = await req.json().catch(() => null)
  if (!body || !body.email || !body.type) return respond({ error: 'Missing required fields' }, 400)

  const { type, email, postcode, nationwide, business_name } = body

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  )

  // Check for duplicate email (case-insensitive)
  const { data: existing } = await supabase
    .from('leads')
    .select('id')
    .ilike('email', email.trim())
    .maybeSingle()

  if (existing) return respond({ duplicate: true }, 409)

  // Insert the new lead
  const { error: dbErr } = await supabase.from('leads').insert({
    type,
    email: email.toLowerCase().trim(),
    postcode: nationwide ? null : (postcode?.toUpperCase().trim() || null),
    nationwide: !!nationwide,
    business_name: business_name?.trim() || null,
  })

  if (dbErr) {
    console.error('DB insert error:', dbErr)
    return respond({ error: 'Database error' }, 500)
  }

  // Notify the InstallNest team of the new signup
  const notifyHtml = `<!DOCTYPE html>
  <html lang="en">
  <head><meta charset="UTF-8" /></head>
  <body style="margin:0;padding:0;background:#F1F1F3;font-family:'Inter',Arial,sans-serif">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#F1F1F3;padding:32px 16px">
      <tr><td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08)">
          <tr><td style="background:${type === 'installer' ? '#06B6D4' : '#2350F5'};padding:20px 28px">
            <p style="margin:0;color:#fff;font-size:13px;font-weight:600;letter-spacing:.06em;text-transform:uppercase">
              New ${type === 'installer' ? 'Installer' : 'Customer'} Signup
            </p>
          </td></tr>
          <tr><td style="padding:24px 28px">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr><td style="padding:6px 0;font-size:14px;color:#64748b;width:120px">Email</td>
                  <td style="padding:6px 0;font-size:14px;color:#0f172a;font-weight:600">${email.toLowerCase().trim()}</td></tr>
              ${postcode ? `<tr><td style="padding:6px 0;font-size:14px;color:#64748b">Postcode</td>
                  <td style="padding:6px 0;font-size:14px;color:#0f172a;font-weight:600">${nationwide ? 'Nationwide' : postcode.toUpperCase().trim()}</td></tr>` : ''}
              ${business_name ? `<tr><td style="padding:6px 0;font-size:14px;color:#64748b">Business</td>
                  <td style="padding:6px 0;font-size:14px;color:#0f172a;font-weight:600">${business_name.trim()}</td></tr>` : ''}
              <tr><td style="padding:6px 0;font-size:14px;color:#64748b">Time</td>
                  <td style="padding:6px 0;font-size:14px;color:#0f172a;font-weight:600">${new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' })}</td></tr>
            </table>
          </td></tr>
          <tr><td style="background:#F8FAFC;padding:16px 28px;border-top:1px solid #e2e8f0;text-align:center">
            <a href="https://installnest.com/admin.html"
               style="font-size:13px;color:#2350F5;text-decoration:none;font-weight:600">View all signups →</a>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body></html>`

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')!}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'InstallNest Signups <noreply@installnest.com>',
      to: 'taranbasi1@gmail.com',
      subject: `New ${type === 'installer' ? 'installer' : 'customer'} signup — ${email.toLowerCase().trim()}`,
      html: notifyHtml,
    }),
  }).catch(err => console.error('Notify email error:', err))

  // Build the thank-you email
  const subject = 'Thanks for your interest in InstallNest'

  const html = `<!DOCTYPE html>
  <html lang="en">
  <head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
  <body style="margin:0;padding:0;background:#F1F1F3;font-family:'Inter',Arial,sans-serif">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#F1F1F3;padding:40px 16px">
      <tr><td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08)">

          <!-- Header -->
          <tr>
            <td style="background:#2350F5;padding:28px 32px;text-align:center">
              <img src="https://installnest.com/brand_assets/InstallNest%20Logo1.png"
                   alt="InstallNest"
                   style="height:38px;width:auto;display:block;margin:0 auto" />
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 32px 28px">
              <h1 style="font-size:22px;font-weight:700;color:#0f172a;margin:0 0 16px;letter-spacing:-0.02em;font-family:'Inter',Arial,sans-serif">
                Thanks for your interest!
              </h1>
              <p style="font-size:15px;line-height:1.75;color:#475569;margin:0 0 16px;font-family:'Inter',Arial,sans-serif">
                We really appreciate you taking the time to register your interest in InstallNest.
                We're working hard behind the scenes to get everything ready.
              </p>
              <p style="font-size:15px;line-height:1.75;color:#475569;margin:0 0 28px;font-family:'Inter',Arial,sans-serif">
                We'll be in touch as soon as we go live — you'll be among the first to know.
              </p>
              <a href="https://installnest.com"
                 style="display:inline-block;background:#2350F5;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;padding:12px 24px;border-radius:8px;font-family:'Inter',Arial,sans-serif">
                Visit InstallNest →
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#F1F1F3;padding:20px 32px;border-top:1px solid #e2e8f0;text-align:center">
              <p style="font-size:13px;color:#94a3b8;margin:0;font-family:'Inter',Arial,sans-serif">
                The InstallNest Team &middot;
                <a href="https://installnest.com" style="color:#2350F5;text-decoration:none">installnest.com</a>
              </p>
            </td>
          </tr>

        </table>
      </td></tr>
    </table>
  </body>
  </html>`

  // Send via Resend — log failure but don't block the response (lead is already saved)
  const emailRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')!}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'InstallNest <noreply@installnest.com>',
      to: email.toLowerCase().trim(),
      subject,
      html,
    }),
  })

  if (!emailRes.ok) console.error('Resend error:', await emailRes.text())

  return respond({ success: true })
})
