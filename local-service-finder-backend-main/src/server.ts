import db from '@src/database/models';
import app from './app';
import { PORT } from './config';
import logger from './utils/logger';
async function startServer() {
  try {
    // Test DB connection
    await db.sequelize.authenticate();
    console.log('Database connected successfully ✅');

    // Sync models (remove force: true in production)
    // await db.sequelize.sync({ alter: true, logging: console.log});

    console.log('Database synced successfully ✅');

    app.listen(PORT, () => {
      logger.info(`🚀 Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error('❌ Failed to start server', error);
    process.exit(1);
  }
}

startServer();
