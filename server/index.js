import 'dotenv/config';

const configured = Boolean(
  (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL) &&
  (process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY)
);
const { app } = configured ? await import('./supabaseApp.js') : await import('./app.js');

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Sneakers API (${configured ? 'Supabase' : 'local demo'}) running on http://localhost:${port}`));
