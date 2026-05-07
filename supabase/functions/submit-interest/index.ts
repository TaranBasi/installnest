import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function respond(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  })
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })
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
