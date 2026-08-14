import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.js';
import { seedDatabase, backfillMedicineImages } from './seed.js';
import { getQuery } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Mount API routes
app.use('/api', apiRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Nexamed Healthcare Backend Running' });
});

const startServer = async () => {
  try {
    // Check if seeded
    try {
      const user = await getQuery(`SELECT id FROM users LIMIT 1`);
      if (!user) {
        console.log('No user data found. Auto-seeding database...');
        await seedDatabase();
      } else {
        console.log('Database already initialized and populated.');
      }
    } catch (e) {
      console.log('Initializing & seeding database...');
      await seedDatabase();
    }

    // Idempotent: keep medicine packet images up to date on existing databases
    await backfillMedicineImages();

    app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`  🏥 NEXAMED HEALTHCARE BACKEND SERVER ONLINE       `);
      console.log(`  Listening on: http://localhost:${PORT}             `);
      console.log(`====================================================`);
    });
  } catch (err) {
    console.error('Server startup failed:', err);
  }
};

startServer();
