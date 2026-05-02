import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, company, bottleneck, hearAbout } = body;

    if (!name || !email || !bottleneck) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: 'website@number1digitalmarketing.com',
        to: 'hello@number1digitalmarketing.com',
        subject: `New inquiry from ${name} — ${company || 'No company'}`,
        text: [
          `Name: ${name}`,
          `Email: ${email}`,
          `Company: ${company || 'N/A'}`,
          `How they heard about us: ${hearAbout || 'N/A'}`,
          '',
          `Bottleneck:`,
          bottleneck,
        ].join('\n'),
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
