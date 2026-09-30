const express = require('express');
const path = require('path');
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'cambiar123';
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY || '';
const ROOT = __dirname;
const FALLBACK_FILE = path.join(ROOT, 'data', 'content.json');

app.use(express.json({ limit: '25mb' }));
app.use(express.static(ROOT));

function getSupabase() {
  if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) return null;
  return createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
}

function readFallback() {
  try {
    return JSON.parse(fs.readFileSync(FALLBACK_FILE, 'utf8'));
  } catch {
    return {};
  }
}

app.get('/api/health', async (req, res) => {
  const supabase = getSupabase();
  if (!supabase) {
    return res.json({ ok: true, database: false, message: 'Faltan variables de Supabase.' });
  }
  const { data, error } = await supabase
    .from('site_content')
    .select('id, updated_at')
    .eq('id', 1)
    .single();

  if (error) return res.status(500).json({ ok:false, database:false, error:error.message });
  res.json({ ok:true, database:true, updated_at:data.updated_at });
});

app.get('/api/content', async (req, res) => {
  res.set('Cache-Control', 'no-store');
  const supabase = getSupabase();
  if (!supabase) return res.json(readFallback());

  const { data, error } = await supabase
    .from('site_content')
    .select('content')
    .eq('id', 1)
    .single();

  if (error || !data) return res.json(readFallback());
  res.json(data.content || readFallback());
});

app.post('/api/content', async (req, res) => {
  if ((req.get('x-admin-password') || '') !== ADMIN_PASSWORD) {
    return res.status(401).json({ error:'Contraseña incorrecta.' });
  }

  const supabase = getSupabase();
  if (!supabase) {
    return res.status(503).json({
      error:'Supabase no está configurado. Revisa SUPABASE_URL y SUPABASE_SECRET_KEY en Render.'
    });
  }

  const { error } = await supabase
    .from('site_content')
    .upsert(
      { id:1, content:req.body, updated_at:new Date().toISOString() },
      { onConflict:'id' }
    );

  if (error) {
    return res.status(500).json({ error:'No se pudo guardar en Supabase: ' + error.message });
  }

  res.json({ ok:true, persisted:true });
});

// Explicit pages
app.get('/admin.html', (req, res) => {
  res.sendFile(path.join(ROOT, 'admin.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(ROOT, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`JOSEPAN listo en puerto ${PORT}`);
  console.log(`Sirviendo archivos desde: ${ROOT}`);
});
