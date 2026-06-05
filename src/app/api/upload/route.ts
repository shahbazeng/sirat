import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('file') as File;
  
  const { data, error } = await supabase.storage
    .from('posts')
    .upload(`${Date.now()}_${file.name}`, file);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const url = `${process.env.SUPABASE_URL}/storage/v1/object/public/posts/${data.path}`;
  return NextResponse.json({ url });
}