import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, 'nexamed.db');

const verboseSqlite = sqlite3.verbose();
const db = new verboseSqlite.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to SQLite database:', err.message);
  } else {
    console.log('Connected to Nexamed SQLite database at', dbPath);
  }
});

export const runQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};

export const getQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

export const allQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export const initTables = async () => {
  const schema = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'patient',
      is_verified INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS user_profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE,
      date_of_birth TEXT,
      gender TEXT,
      blood_group TEXT,
      weight_kg REAL,
      height_cm REAL,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS user_allergies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      allergen TEXT NOT NULL,
      severity TEXT DEFAULT 'moderate',
      reaction TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS medical_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      condition_name TEXT NOT NULL,
      diagnosed_year INTEGER,
      is_current INTEGER DEFAULT 1,
      notes TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS emergency_contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      relationship TEXT,
      priority INTEGER DEFAULT 1,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS medical_reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      lab_name TEXT,
      doctor_name TEXT,
      report_date TEXT,
      status TEXT DEFAULT 'Normal',
      summary TEXT,
      test_results TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS medicines (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      generic_name TEXT,
      manufacturer TEXT,
      mrp REAL,
      pack_size TEXT,
      category TEXT,
      prescription_required INTEGER DEFAULT 0,
      is_discontinued INTEGER DEFAULT 0,
      description TEXT,
      image_url TEXT
    );

    CREATE TABLE IF NOT EXISTS compositions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      medicine_id INTEGER,
      chemical_name TEXT NOT NULL,
      strength TEXT,
      FOREIGN KEY(medicine_id) REFERENCES medicines(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS side_effects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      medicine_id INTEGER,
      effect TEXT NOT NULL,
      severity TEXT DEFAULT 'mild',
      FOREIGN KEY(medicine_id) REFERENCES medicines(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS substitutes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      medicine_id INTEGER,
      substitute_id INTEGER,
      saving_amount REAL DEFAULT 0,
      saving_percentage REAL DEFAULT 0,
      FOREIGN KEY(medicine_id) REFERENCES medicines(id) ON DELETE CASCADE,
      FOREIGN KEY(substitute_id) REFERENCES medicines(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS diseases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      icd_code TEXT,
      overview TEXT,
      definition TEXT,
      causes TEXT,
      diagnosis TEXT,
      treatment TEXT,
      emergency_signs TEXT,
      category TEXT
    );

    CREATE TABLE IF NOT EXISTS symptoms (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT,
      body_region TEXT NOT NULL,
      description TEXT
    );

    CREATE TABLE IF NOT EXISTS disease_symptoms (
      disease_id INTEGER,
      symptom_id INTEGER,
      PRIMARY KEY(disease_id, symptom_id),
      FOREIGN KEY(disease_id) REFERENCES diseases(id) ON DELETE CASCADE,
      FOREIGN KEY(symptom_id) REFERENCES symptoms(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS disease_diet (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      disease_id INTEGER,
      diet_item TEXT NOT NULL,
      type TEXT NOT NULL, -- 'recommended' or 'avoid'
      FOREIGN KEY(disease_id) REFERENCES diseases(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS disease_precautions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      disease_id INTEGER,
      precaution TEXT NOT NULL,
      priority INTEGER DEFAULT 1,
      FOREIGN KEY(disease_id) REFERENCES diseases(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS disease_medicines (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      disease_id INTEGER,
      medicine_id INTEGER,
      usage_note TEXT,
      FOREIGN KEY(disease_id) REFERENCES diseases(id) ON DELETE CASCADE,
      FOREIGN KEY(medicine_id) REFERENCES medicines(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS medical_stores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      address TEXT,
      city TEXT,
      state TEXT,
      phone TEXT,
      latitude REAL,
      longitude REAL,
      open_time TEXT,
      close_time TEXT,
      is_open_24h INTEGER DEFAULT 0,
      google_place_id TEXT
    );

    CREATE TABLE IF NOT EXISTS store_inventory (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      store_id INTEGER,
      medicine_id INTEGER,
      in_stock INTEGER DEFAULT 1,
      quantity INTEGER DEFAULT 50,
      price_at_store REAL,
      FOREIGN KEY(store_id) REFERENCES medical_stores(id) ON DELETE CASCADE,
      FOREIGN KEY(medicine_id) REFERENCES medicines(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS blood_banks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      address TEXT,
      city TEXT,
      state TEXT,
      pincode TEXT,
      phone TEXT,
      email TEXT,
      latitude REAL,
      longitude REAL,
      license_number TEXT,
      government_run INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS blood_stock (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      blood_bank_id INTEGER,
      blood_group TEXT NOT NULL,
      units_available INTEGER DEFAULT 0,
      last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(blood_bank_id) REFERENCES blood_banks(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS organ_banks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      address TEXT,
      city TEXT,
      state TEXT,
      phone TEXT,
      notto_registered INTEGER DEFAULT 1,
      notto_id TEXT,
      latitude REAL,
      longitude REAL,
      website TEXT
    );

    CREATE TABLE IF NOT EXISTS sos_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      triggered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      latitude REAL,
      longitude REAL,
      sms_sent INTEGER DEFAULT 1,
      contacts_notified TEXT,
      nearest_hospital_called INTEGER DEFAULT 1,
      resolved_at DATETIME,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS health_tips (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tip_text TEXT NOT NULL,
      category TEXT,
      is_active INTEGER DEFAULT 1
    );
  `;

  return new Promise((resolve, reject) => {
    db.exec(schema, (err) => {
      if (err) {
        console.error('Error initializing tables:', err);
        reject(err);
      } else {
        console.log('Database tables initialized successfully.');
        resolve();
      }
    });
  });
};

export default db;
