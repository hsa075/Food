import { buildApp } from './app.js';
import { config } from './config.js';
import { connectPrisma, disconnectPrisma } from './plugins/prisma.js';

async function startServer() {
  try {
    await connectPrisma();
    const app = await buildApp();

    await app.listen({
      port: config.port,
      host: config.host,
    });

    console.log(`\n🍛 Uttara API server running at http://${config.host}:${config.port}`);
    console.log(`📡 Healthcheck available at http://${config.host}:${config.port}/health\n`);

    const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM'];
    for (const signal of signals) {
      process.on(signal, async () => {
        console.log(`\nReceived ${signal}, shutting down gracefully...`);
        await app.close();
        await disconnectPrisma();
        process.exit(0);
      });
    }
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
