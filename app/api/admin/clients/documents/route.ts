import { NextRequest, NextResponse } from 'next/server';
import { adminIdentity } from '@/lib/adminAuth';
import { serviceClient } from '@/lib/cards/server';
import { CLIENT_FILES_BUCKET } from '@/lib/clientHub';

const MAX_BYTES = 25 * 1024 * 1024;

// Owner uploads another contract for a client (proposal, statement of work, change order).
// Two steps so large files skip the server: "prepare" returns a one-time upload link,
// the browser uploads straight to storage, then "record" lists the file under the client.
export async function POST(req: NextRequest) {
  const who = await adminIdentity(req);
  if (who instanceof NextResponse) return who;
  if (!who.isOwner) return NextResponse.json({ error: 'Only the owner can upload contracts' }, { status: 403 });

  const db = serviceClient();
  if (!db) return NextResponse.json({ error: 'Server not configured' }, { status: 500 });

  const body = (await req.json().catch(() => ({}))) as {
    action?: 'prepare' | 'record';
    clientId?: string;
    fileName?: string;
    path?: string;
    label?: string;
    contentType?: string;
    size?: number;
  };
  if (!body.clientId) return NextResponse.json({ error: 'Missing client' }, { status: 400 });

  const { data: client } = await db.from('clients').select('id').eq('id', body.clientId).single();
  if (!client) return NextResponse.json({ error: 'Client not found' }, { status: 404 });
  const prefix = `${client.id}/documents/`;

  if (body.action === 'prepare') {
    if (!body.fileName) return NextResponse.json({ error: 'Missing file name' }, { status: 400 });
    if ((body.size ?? 0) > MAX_BYTES) return NextResponse.json({ error: 'Files must be 25 MB or smaller' }, { status: 400 });
    const safeName = body.fileName.replace(/[^\w.\- ]+/g, '').trim().slice(-120) || 'document';
    const path = `${prefix}${Date.now()}-${safeName}`;
    const { data, error } = await db.storage.from(CLIENT_FILES_BUCKET).createSignedUploadUrl(path);
    if (error || !data) {
      console.error('Contract upload link failed:', error);
      return NextResponse.json({ error: 'Couldn’t start the upload' }, { status: 500 });
    }
    return NextResponse.json({ path: data.path, token: data.token });
  }

  if (body.action === 'record') {
    const label = body.label?.trim();
    if (!body.path?.startsWith(prefix) || !label || !body.fileName) {
      return NextResponse.json({ error: 'Missing file details' }, { status: 400 });
    }
    const { error } = await db.from('client_documents').insert({
      client_id: client.id,
      label,
      file_name: body.fileName,
      file_path: body.path,
      content_type: body.contentType ?? '',
      size_bytes: body.size ?? 0,
      uploaded_by: who.email,
    });
    if (error) {
      console.error('Contract record failed:', error);
      return NextResponse.json({ error: 'Uploaded, but couldn’t save it to the client' }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}
