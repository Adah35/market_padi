import 'reflect-metadata';
import { AppDataSource } from './config/datasource';
import { app } from './app';

const PORT = parseInt(process.env.PORT ?? '3000', 10);

async function main(): Promise<void> {
  await AppDataSource.initialize();
  console.log('[db] connected');

  app.listen(PORT, () => {
    console.log(`[server] listening on port ${PORT}`);
  });
}

main().catch((err) => {
  console.error('[startup] fatal error:', err);
  process.exit(1);
});
