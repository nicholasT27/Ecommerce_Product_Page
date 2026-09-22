// Vercel sends every /api/* request through the existing Express application.
// Keeping this as a thin adapter means local and deployed API behavior stays aligned.
import { app } from '../server/supabaseApp.js';

export default app;
