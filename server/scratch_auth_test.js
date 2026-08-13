import bcrypt from 'bcryptjs';
import { getQuery } from './db.js';

async function test() {
  const u = await getQuery("SELECT * FROM users WHERE email = 'demo@nexamed.com'");
  console.log('User found:', u ? u.email : 'NOT FOUND');
  if (u) {
    const match = await bcrypt.compare('password123', u.password_hash);
    console.log('Password password123 match:', match);
  }
  process.exit(0);
}
test();
