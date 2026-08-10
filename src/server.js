import 'dotenv/config';   // 🔥 MUST be FIRST

import app from './app.js';
import './config/db.js';

const PORT = process.env.PORT || 5000;

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET must be configured before Raksha Fit can start');
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
