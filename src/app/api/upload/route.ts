import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // Environment variables ko function ke andar access karein
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: "Configuration missing" }, { status: 500 });
  }

  // Supabase client ko yahan initialize karein
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
        return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }
  
    const { data, error } = await supabase.storage
      .from('posts')
      .upload(`${Date.now()}_${file.name}`, file);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const url = `${supabaseUrl}/storage/v1/object/public/posts/${data.path}`;
    return NextResponse.json({ url });
    
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}