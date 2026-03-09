import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import prisma from './config/db.js';

const PORT = process.env.PORT || 5000;

// For local development
if (process.env.NODE_ENV !== 'production') {
  async function main() {
    try {
      await prisma.$connect();
      console.log('✅ PostgreSQL connected via Prisma');
      app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
      });
    } catch (err) {
      console.error('❌ Database connection error:', err);
      process.exit(1);
    }
  }
  main();
}

// Export for Vercel serverless
export default app;
