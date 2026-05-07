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
  const isInstaller = type === 'installer'

  const subject = isInstaller
    ? 'Welcome to the InstallNest installer network'
    : "You're on the list — InstallNest"

  const html = isInstaller
    ? `<div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:40px 24px;color:#0f172a">
        <h1 style="font-size:22px;font-weight:700;margin:0 0 16px">Welcome aboard${business_name ? `, ${business_name}` : ''}!</h1>
        <p style="font-size:15px;line-height:1.7;color:#475569;margin:0 0 16px">
          Thanks for registering your interest in joining the InstallNest installer network.
        </p>
        <p style="font-size:15px;line-height:1.7;color:#475569;margin:0 0 16px">
          We're building a platform that connects verified EV charger installers with homeowners across the UK.
          We'll be in touch soon with everything you need to start receiving pre-qualified leads in your area.
        </p>
        <p style="font-size:15px;line-height:1.7;color:#475569;margin:0 0 32px">
          Visit <a href="https://installnest.com" style="color:#2350F5">installnest.com</a> to learn more.
        </p>
        <p style="font-size:13px;color:#94a3b8;margin:0">The InstallNest Team &middot; installnest.com</p>
      </div>`
    : `<div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:40px 24px;color:#0f172a">
        <h1 style="font-size:22px;font-weight:700;margin:0 0 16px">You're on the list!</h1>
        <p style="font-size:15px;line-height:1.7;color:#475569;margin:0 0 16px">
          Thanks for registering your interest in InstallNest. We'll let you know as soon as we have
          verified installers available in your area${postcode ? ` (${postcode.toUpperCase()})` : ''}.
        </p>
        <p style="font-size:15px;line-height:1.7;color:#475569;margin:0 0 16px">
          InstallNest connects homeowners with approved, vetted EV charger installers — giving you
          free, competing quotes so you always get the best deal.
        </p>
        <p style="font-size:15px;line-height:1.7;color:#475569;margin:0 0 32px">
          Visit <a href="https://installnest.com" style="color:#2350F5">installnest.com</a> to learn more.
        </p>
        <p style="font-size:13px;color:#94a3b8;margin:0">The InstallNest Team &middot; installnest.com</p>
      </div>`

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
