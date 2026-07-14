import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// We must use the service role key to bypass RLS since webhooks run on the backend without user context
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    // Gumroad sends payloads as application/x-www-form-urlencoded
    const formData = await request.formData();
    
    // Extract the user_id that we passed dynamically in the query parameter
    // Gumroad exposes custom fields passed in the URL inside the form payload.
    // If passed as ?user_id=123, it usually comes through directly or under custom fields.
    const userId = formData.get('user_id');

    if (!userId || typeof userId !== 'string') {
      console.error('Webhook missing user_id');
      return NextResponse.json({ error: 'Missing user_id in payload' }, { status: 400 });
    }

    // Update the user's profile in Supabase to grant pro access
    const { error } = await supabaseAdmin
      .from('profiles')
      .update({ is_pro: true })
      .eq('id', userId);

    if (error) {
      console.error('Supabase update failed:', error);
      return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
    }
    
    console.log(`Successfully upgraded user ${userId} to Pro via Gumroad.`);

    // Return 200 OK so Gumroad knows the ping succeeded
    return NextResponse.json({ message: 'Webhook received successfully' }, { status: 200 });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
