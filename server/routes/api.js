import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { runQuery, getQuery, allQuery } from '../db.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'nexamed_secret_jwt_key_2026';

// Middleware for auth
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Authorization token required' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// --- AUTH & USER PROFILE ---
router.post('/auth/register', async (req, res) => {
  try {
    const { name, email, phone, password, bloodGroup, allergies, medicalHistory, emergencyContacts } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existing = await getQuery(`SELECT id FROM users WHERE email = ?`, [email]);
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    const hash = await bcrypt.hash(password, 10);
    const userRes = await runQuery(
      `INSERT INTO users (name, email, phone, password_hash) VALUES (?, ?, ?, ?)`,
      [name, email, phone || '', hash]
    );
    const userId = userRes.lastID;

    // Profile
    await runQuery(
      `INSERT INTO user_profiles (user_id, blood_group) VALUES (?, ?)`,
      [userId, bloodGroup || 'O+']
    );

    // Allergies
    if (Array.isArray(allergies)) {
      for (const a of allergies) {
        if (a.allergen) {
          await runQuery(
            `INSERT INTO user_allergies (user_id, allergen, severity, reaction) VALUES (?, ?, ?, ?)`,
            [userId, a.allergen, a.severity || 'moderate', a.reaction || '']
          );
        }
      }
    }

    // Medical History
    if (Array.isArray(medicalHistory)) {
      for (const mh of medicalHistory) {
        if (mh.condition) {
          await runQuery(
            `INSERT INTO medical_history (user_id, condition_name, diagnosed_year, notes) VALUES (?, ?, ?, ?)`,
            [userId, mh.condition, mh.year || 2023, mh.notes || '']
          );
        }
      }
    }

    // Emergency Contacts
    if (Array.isArray(emergencyContacts)) {
      for (const ec of emergencyContacts) {
        if (ec.name && ec.phone) {
          await runQuery(
            `INSERT INTO emergency_contacts (user_id, name, phone, relationship, priority) VALUES (?, ?, ?, ?, ?)`,
            [userId, ec.name, ec.phone, ec.relationship || 'Relative', 1]
          );
        }
      }
    }

    const token = jwt.sign({ id: userId, email, name, role: 'patient' }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: userId, name, email, phone, role: 'patient' } });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await getQuery(`SELECT * FROM users WHERE email = ?`, [email]);
    if (!user) return res.status(400).json({ error: 'Invalid email or password' });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(400).json({ error: 'Invalid email or password' });

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

router.get('/user/profile', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await getQuery(`SELECT id, name, email, phone, role, created_at FROM users WHERE id = ?`, [userId]);
    const profile = await getQuery(`SELECT * FROM user_profiles WHERE user_id = ?`, [userId]);
    const allergies = await allQuery(`SELECT * FROM user_allergies WHERE user_id = ?`, [userId]);
    const history = await allQuery(`SELECT * FROM medical_history WHERE user_id = ?`, [userId]);
    const contacts = await allQuery(`SELECT * FROM emergency_contacts WHERE user_id = ? ORDER BY priority ASC`, [userId]);
    const reports = await allQuery(`SELECT * FROM medical_reports WHERE user_id = ? ORDER BY report_date DESC`, [userId]);

    res.json({ user, profile, allergies, history, contacts, reports });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

router.post('/user/profile', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { phone, blood_group, weight_kg, height_cm, allergies, history, contacts } = req.body;

    if (phone) await runQuery(`UPDATE users SET phone = ? WHERE id = ?`, [phone, userId]);
    if (blood_group || weight_kg || height_cm) {
      await runQuery(
        `INSERT INTO user_profiles (user_id, blood_group, weight_kg, height_cm) VALUES (?, ?, ?, ?)
         ON CONFLICT(user_id) DO UPDATE SET blood_group=excluded.blood_group, weight_kg=excluded.weight_kg, height_cm=excluded.height_cm`,
        [userId, blood_group, weight_kg, height_cm]
      );
    }

    if (Array.isArray(allergies)) {
      await runQuery(`DELETE FROM user_allergies WHERE user_id = ?`, [userId]);
      for (const a of allergies) {
        if (a.allergen) {
          await runQuery(`INSERT INTO user_allergies (user_id, allergen, severity, reaction) VALUES (?, ?, ?, ?)`, [userId, a.allergen, a.severity || 'moderate', a.reaction || '']);
        }
      }
    }

    if (Array.isArray(contacts)) {
      await runQuery(`DELETE FROM emergency_contacts WHERE user_id = ?`, [userId]);
      for (const c of contacts) {
        if (c.name && c.phone) {
          await runQuery(`INSERT INTO emergency_contacts (user_id, name, phone, relationship, priority) VALUES (?, ?, ?, ?, ?)`, [userId, c.name, c.phone, c.relationship || 'Relative', c.priority || 1]);
        }
      }
    }

    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// --- MODULE 1: PHARMA ENCYCLOPEDIA ---
router.get('/medicines', async (req, res) => {
  try {
    const { q, category } = req.query;
    let sql = `SELECT m.*, GROUP_CONCAT(c.chemical_name || ' (' || c.strength || ')', ' + ') as composition_summary
               FROM medicines m
               LEFT JOIN compositions c ON m.id = c.medicine_id`;
    const params = [];
    const conditions = [];

    if (q) {
      const cleanQ = q.toLowerCase().replace(/[^a-z0-9]/g, '');
      conditions.push(`(LOWER(REPLACE(REPLACE(m.name, '-', ''), ' ', '')) LIKE ? OR LOWER(m.generic_name) LIKE ? OR LOWER(m.category) LIKE ? OR LOWER(c.chemical_name) LIKE ?)`);
      const searchParam = `%${q}%`;
      params.push(`%${cleanQ}%`, searchParam, searchParam, searchParam);
    }

    if (category) {
      conditions.push(`m.category = ?`);
      params.push(category);
    }

    if (conditions.length > 0) {
      sql += ` WHERE ` + conditions.join(' AND ');
    }

    sql += ` GROUP BY m.id ORDER BY m.name ASC`;
    const medicines = await allQuery(sql, params);
    res.json(medicines);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to search medicines' });
  }
});

router.get('/medicines/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const medicine = await getQuery(`SELECT * FROM medicines WHERE id = ?`, [id]);
    if (!medicine) return res.status(404).json({ error: 'Medicine not found' });

    const compositions = await allQuery(`SELECT * FROM compositions WHERE medicine_id = ?`, [id]);
    const sideEffects = await allQuery(`SELECT * FROM side_effects WHERE medicine_id = ?`, [id]);
    
    // Substitutes with generic savings
    const substitutes = await allQuery(
      `SELECT s.*, m.name as substitute_name, m.generic_name, m.manufacturer, m.mrp as substitute_mrp, m.pack_size
       FROM substitutes s
       JOIN medicines m ON s.substitute_id = m.id
       WHERE s.medicine_id = ?`,
      [id]
    );

    res.json({ medicine, compositions, sideEffects, substitutes });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch medicine details' });
  }
});

// --- MODULE 2: DISEASE ENCYCLOPEDIA ---
router.get('/diseases', async (req, res) => {
  try {
    const { q, category } = req.query;
    let sql = `SELECT * FROM diseases`;
    const params = [];
    const conditions = [];

    if (q) {
      conditions.push(`(LOWER(name) LIKE ? OR LOWER(overview) LIKE ? OR LOWER(category) LIKE ?)`);
      const p = `%${q}%`;
      params.push(p, p, p);
    }

    if (category) {
      conditions.push(`category = ?`);
      params.push(category);
    }

    if (conditions.length > 0) sql += ` WHERE ` + conditions.join(' AND ');
    sql += ` ORDER BY name ASC`;

    const diseases = await allQuery(sql, params);
    res.json(diseases);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch diseases' });
  }
});

router.get('/diseases/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const disease = await getQuery(`SELECT * FROM diseases WHERE id = ?`, [id]);
    if (!disease) return res.status(404).json({ error: 'Disease not found' });

    const symptoms = await allQuery(
      `SELECT s.* FROM symptoms s
       JOIN disease_symptoms ds ON s.id = ds.symptom_id
       WHERE ds.disease_id = ?`,
      [id]
    );

    const diet = await allQuery(`SELECT * FROM disease_diet WHERE disease_id = ?`, [id]);
    const precautions = await allQuery(`SELECT * FROM disease_precautions WHERE disease_id = ? ORDER BY priority ASC`, [id]);
    const linkedMedicines = await allQuery(
      `SELECT dm.usage_note, m.* FROM disease_medicines dm
       JOIN medicines m ON dm.medicine_id = m.id
       WHERE dm.disease_id = ?`,
      [id]
    );

    res.json({ disease, symptoms, diet, precautions, linkedMedicines });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch disease details' });
  }
});

// --- MODULE 3: SYMPTOM CHECKER ---
router.get('/symptoms', async (req, res) => {
  try {
    const symptoms = await allQuery(`SELECT * FROM symptoms ORDER BY body_region ASC, name ASC`);
    const grouped = symptoms.reduce((acc, sym) => {
      acc[sym.body_region] = acc[sym.body_region] || [];
      acc[sym.body_region].push(sym);
      return acc;
    }, {});
    res.json(grouped);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch symptoms' });
  }
});

router.post('/symptom-checker/analyze', async (req, res) => {
  try {
    let { symptomIds = [], customText = '' } = req.body;

    if (!Array.isArray(symptomIds)) symptomIds = [];

    // Parse custom text against database symptoms
    const allSymptomsInDb = await allQuery(`SELECT id, name FROM symptoms`);
    if (customText && customText.trim().length > 0) {
      const lowerText = customText.toLowerCase();
      allSymptomsInDb.forEach((s) => {
        const symNameLower = s.name.toLowerCase();
        if (lowerText.includes(symNameLower) || symNameLower.split(' ').some(w => w.length > 3 && lowerText.includes(w))) {
          if (!symptomIds.includes(s.id)) symptomIds.push(s.id);
        }
      });
    }

    if (symptomIds.length < 2 && (!customText || customText.trim().length < 5)) {
      return res.status(400).json({ error: 'Please select symptoms or describe your health condition in detail.' });
    }

    const allDiseases = await allQuery(`SELECT * FROM diseases`);
    const results = [];

    for (const d of allDiseases) {
      const dSymptoms = await allQuery(`SELECT symptom_id FROM disease_symptoms WHERE disease_id = ?`, [d.id]);
      const diseaseSymIds = dSymptoms.map(x => x.symptom_id);
      
      if (diseaseSymIds.length === 0) continue;

      const matchedCount = symptomIds.filter(id => diseaseSymIds.includes(Number(id))).length;
      let scoreBonus = 0;

      // Check overview & symptoms for custom text keyword matches
      if (customText) {
        const textLower = customText.toLowerCase();
        if (d.name.toLowerCase().split(' ').some(w => w.length > 3 && textLower.includes(w))) scoreBonus += 25;
        if (d.overview.toLowerCase().split(' ').some(w => w.length > 4 && textLower.includes(w))) scoreBonus += 15;
      }

      if (matchedCount > 0 || scoreBonus > 0) {
        const baseScore = Math.round((matchedCount / Math.max(symptomIds.length, diseaseSymIds.length || 1)) * 100);
        const confidenceScore = Math.min(Math.max(baseScore + scoreBonus, 30), 98);

        let matchLevel = 'Low';
        if (confidenceScore >= 60) matchLevel = 'High';
        else if (confidenceScore >= 35) matchLevel = 'Medium';

        let doctorSpecialty = 'General Physician';
        if (d.category.includes('Endocrine')) doctorSpecialty = 'Endocrinologist';
        else if (d.category.includes('Cardiovascular')) doctorSpecialty = 'Cardiologist / Heart Specialist';
        else if (d.category.includes('Gastrointestinal')) doctorSpecialty = 'Gastroenterologist';
        else if (d.category.includes('Respiratory')) doctorSpecialty = 'Pulmonologist';
        else if (d.category.includes('Infectious')) doctorSpecialty = 'Infectious Disease Specialist';

        results.push({
          disease: d,
          matchedCount,
          totalDiseaseSymptoms: diseaseSymIds.length,
          confidenceScore,
          matchLevel,
          doctorSpecialty
        });
      }
    }

    results.sort((a, b) => b.confidenceScore - a.confidenceScore);
    res.json({ results: results.slice(0, 5), parsedSymptomCount: symptomIds.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to analyze symptoms' });
  }
});

// --- MODULE 4: OCR MEDICINE MATCHING ---
router.post('/ocr/match', async (req, res) => {
  try {
    const { extractedText } = req.body;
    if (!extractedText) return res.status(400).json({ error: 'No text provided for matching' });

    const cleanText = extractedText.toLowerCase().replace(/[^a-z0-9\s]/g, '');
    const lines = cleanText.split('\n').map(l => l.trim()).filter(l => l.length > 2);

    const medicines = await allQuery(`SELECT id, name, generic_name, category, mrp FROM medicines`);
    
    // Levenshtein fuzzy string distance helper
    const levenshtein = (a, b) => {
      const matrix = Array.from({ length: b.length + 1 }, (_, i) => [i]);
      for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
      for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
          if (b.charAt(i - 1) === a.charAt(j - 1)) matrix[i][j] = matrix[i - 1][j - 1];
          else matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
        }
      }
      return matrix[b.length][a.length];
    };

    let bestMatch = null;
    let highestConfidence = 0;

    for (const med of medicines) {
      const medNameClean = med.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      const genericClean = (med.generic_name || '').toLowerCase().replace(/[^a-z0-9]/g, '');

      for (const line of lines) {
        const lineClean = line.replace(/[^a-z0-9]/g, '');
        if (lineClean.includes(medNameClean) || medNameClean.includes(lineClean)) {
          const confidence = 95;
          if (confidence > highestConfidence) {
            highestConfidence = confidence;
            bestMatch = med;
          }
        } else {
          const dist = levenshtein(medNameClean, lineClean);
          const maxLen = Math.max(medNameClean.length, lineClean.length);
          const score = Math.round((1 - dist / maxLen) * 100);
          if (score > highestConfidence && score >= 50) {
            highestConfidence = score;
            bestMatch = med;
          }
        }
      }
    }

    res.json({
      match: bestMatch,
      confidence: highestConfidence,
      extractedSnippet: lines.slice(0, 3).join(' | ')
    });
  } catch (err) {
    res.status(500).json({ error: 'OCR Matching failed' });
  }
});

// --- MODULE 5: MEDICAL STORE LOCATOR ---
router.get('/stores', async (req, res) => {
  try {
    const { city, lat, lng } = req.query;
    let sql = `SELECT * FROM medical_stores`;
    const params = [];

    if (city) {
      sql += ` WHERE LOWER(city) LIKE ?`;
      params.push(`%${city.toLowerCase()}%`);
    }

    const stores = await allQuery(sql, params);

    // Distance calculation (Haversine formula)
    const userLat = parseFloat(lat) || 17.4325; // Default Hyderabad if not given
    const userLng = parseFloat(lng) || 78.4071;

    const toRad = x => (x * Math.PI) / 180;
    const storesWithDist = stores.map(store => {
      const dLat = toRad(store.latitude - userLat);
      const dLng = toRad(store.longitude - userLng);
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(toRad(userLat)) * Math.cos(toRad(store.latitude)) *
                Math.sin(dLng / 2) * Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distanceKm = (6371 * c).toFixed(1);

      return { ...store, distanceKm: parseFloat(distanceKm) };
    });

    storesWithDist.sort((a, b) => a.distanceKm - b.distanceKm);
    res.json(storesWithDist);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch medical stores' });
  }
});

// --- MODULE 6: BLOOD BANK LOCATOR ---
router.get('/blood-banks', async (req, res) => {
  try {
    const { bloodGroup, city, lat, lng } = req.query;
    let sql = `SELECT bb.*, bs.units_available, bs.last_updated
               FROM blood_banks bb
               JOIN blood_stock bs ON bb.id = bs.blood_bank_id`;
    const params = [];
    const conditions = [];

    if (bloodGroup) {
      conditions.push(`bs.blood_group = ?`);
      params.push(bloodGroup);
    }
    if (city) {
      conditions.push(`LOWER(bb.city) LIKE ?`);
      params.push(`%${city.toLowerCase()}%`);
    }

    if (conditions.length > 0) sql += ` WHERE ` + conditions.join(' AND ');

    const banks = await allQuery(sql, params);

    const userLat = parseFloat(lat) || 17.4184;
    const userLng = parseFloat(lng) || 78.4385;

    const toRad = x => (x * Math.PI) / 180;
    const banksWithDist = banks.map(b => {
      const dLat = toRad(b.latitude - userLat);
      const dLng = toRad(b.longitude - userLng);
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(toRad(userLat)) * Math.cos(toRad(b.latitude)) *
                Math.sin(dLng / 2) * Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distanceKm = (6371 * c).toFixed(1);
      return { ...b, distanceKm: parseFloat(distanceKm) };
    });

    banksWithDist.sort((a, b) => a.distanceKm - b.distanceKm);
    res.json(banksWithDist);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch blood banks' });
  }
});

// --- MODULE 7: ORGAN BANK DIRECTORY ---
router.get('/organ-banks', async (req, res) => {
  try {
    const { type, city } = req.query;
    let sql = `SELECT * FROM organ_banks`;
    const params = [];
    const conditions = [];

    if (type) {
      conditions.push(`type = ?`);
      params.push(type);
    }
    if (city) {
      conditions.push(`LOWER(city) LIKE ?`);
      params.push(`%${city.toLowerCase()}%`);
    }

    if (conditions.length > 0) sql += ` WHERE ` + conditions.join(' AND ');
    sql += ` ORDER BY name ASC`;

    const organBanks = await allQuery(sql, params);
    res.json(organBanks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch organ banks' });
  }
});

// --- MODULE 8: EMERGENCY SOS ---
router.post('/sos/trigger', async (req, res) => {
  try {
    const { lat, lng, userId } = req.body;
    const userLat = lat || 17.4325;
    const userLng = lng || 78.4071;

    let contacts = [];
    if (userId) {
      contacts = await allQuery(`SELECT * FROM emergency_contacts WHERE user_id = ?`, [userId]);
    }

    const contactsNotified = contacts.map(c => `${c.name} (${c.phone})`).join(', ') || 'National Ambulance 108 Dispatch';
    const mapsLink = `https://maps.google.com/?q=${userLat},${userLng}`;

    const sosRes = await runQuery(
      `INSERT INTO sos_events (user_id, latitude, longitude, contacts_notified) VALUES (?, ?, ?, ?)`,
      [userId || null, userLat, userLng, contactsNotified]
    );

    res.json({
      sosId: sosRes.lastID,
      message: '🚨 EMERGENCY SOS ACTIVATED! Location broadcasted.',
      locationUrl: mapsLink,
      ambulanceNumber: '108',
      contactsNotified,
      contacts
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to trigger SOS' });
  }
});

router.post('/sos/resolve', async (req, res) => {
  try {
    const { sosId } = req.body;
    if (sosId) {
      await runQuery(`UPDATE sos_events SET resolved_at = CURRENT_TIMESTAMP WHERE id = ?`, [sosId]);
    }
    res.json({ message: 'Emergency marked as safe & resolved.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to resolve SOS' });
  }
});

// --- MODULE 9: HEALTH NEWS & DAILY TIPS ---
router.get('/news', async (req, res) => {
  try {
    const news = [
      {
        id: 1,
        title: 'WHO Issues Global Health Alert on Seasonal Influenza & Vector Mosquito Prevention',
        summary: 'World Health Organization emphasizes vector control measures and timely vaccination for vulnerable age demographics. Additional surveillance measures activated across 82 countries.',
        source: 'WHO Official',
        category: 'Global Alert',
        date: '2026-08-05',
        url: 'https://www.who.int',
        urgent: true
      },
      {
        id: 2,
        title: 'MoHFW India Expands e-RaktKosh Live Blood Availability Portal Nationwide',
        summary: 'Ministry of Health and Family Welfare integrates over 2,800 licensed blood centers to provide real-time stock transparency. New mobile app released for donor tracking.',
        source: 'MoHFW GOI',
        category: 'Blood Donation',
        date: '2026-08-04',
        url: 'https://eraktkosh.mohfw.gov.in',
        urgent: false
      },
      {
        id: 3,
        title: 'Jan Aushadhi Generic Medicine Savings Initiative Crosses Milestone',
        summary: 'Over 1,800 essential drug formulations now available at 50% to 80% discounted rates. Government opens 2,000 new Pradhan Mantri Bhartiya Janaushadhi Kendras across Tier-2 & Tier-3 cities.',
        source: 'Press Information Bureau',
        category: 'Pharma Policy',
        date: '2026-08-02',
        url: 'https://pib.gov.in',
        urgent: false
      },
      {
        id: 4,
        title: 'NOTTO Organ Donation Registry Registers 1 Lakh Voluntary Pledges in 2026',
        summary: 'National Organ and Tissue Transplant Organisation reports a 40% increase in voluntary pledges compared to 2025. Cornea, kidney, and liver donations lead the national pledge drive.',
        source: 'NOTTO GOI',
        category: 'Organ Donation',
        date: '2026-08-01',
        url: 'https://notto.mohfw.gov.in',
        urgent: false
      },
      {
        id: 5,
        title: 'ICMR Publishes Updated Clinical Guidelines for Type-2 Diabetes Management in India',
        summary: 'Indian Council of Medical Research revises HbA1c target thresholds and Metformin dosing protocols for Indian adult populations with comorbid hypertension.',
        source: 'ICMR',
        category: 'Clinical Guidelines',
        date: '2026-07-30',
        url: 'https://icmr.gov.in',
        urgent: false
      },
      {
        id: 6,
        title: 'Dengue Fever Surge Reported Across AP & Telangana — Hospitals on High Alert',
        summary: 'State health departments activate ward-level dengue response cells after reported cases double in two weeks. NS1 antigen testing kits distributed to all PHCs.',
        source: 'AP Health Dept',
        category: 'Outbreak Alert',
        date: '2026-07-28',
        url: 'https://health.ap.gov.in',
        urgent: true
      },
      {
        id: 7,
        title: 'Ayushman Bharat PM-JAY Scheme Expands Coverage to Senior Citizens Above 70',
        summary: 'Union Cabinet approves extension of PM-JAY health insurance to all senior citizens aged 70 and above, covering ₹5 lakh annual hospitalization without income test.',
        source: 'MoHFW GOI',
        category: 'Insurance Policy',
        date: '2026-07-25',
        url: 'https://pmjay.gov.in',
        urgent: false
      },
      {
        id: 8,
        title: 'WHO Recommends Revised Dosage Protocol for Artemisinin-Based Malaria Combination Therapies',
        summary: 'Following multi-country clinical trial data, WHO updates global guidance on ACT dosing to combat emerging drug-resistant Plasmodium falciparum strains in Southeast Asia.',
        source: 'WHO Official',
        category: 'Global Alert',
        date: '2026-07-22',
        url: 'https://www.who.int/malaria',
        urgent: true
      },
      {
        id: 9,
        title: 'National Mental Health Programme Adds Digital Tele-MANAS Counselling Layer',
        summary: 'Govt launches round-the-clock tele-mental health helpline with AI-assisted triaging, connecting patients to licensed psychiatrists and counselors free of cost.',
        source: 'NIMHANS / MoHFW',
        category: 'Mental Health',
        date: '2026-07-18',
        url: 'https://nimhans.ac.in',
        urgent: false
      },
      {
        id: 10,
        title: 'India Approved First Indigenous mRNA Vaccine Platform — Gennova BioPharma',
        summary: 'CDSCO grants market authorization to Gennova\'s GEMCOVAC-19 mRNA platform, marking India\'s first domestically developed mRNA vaccine against SARS-CoV-2 variants.',
        source: 'CDSCO India',
        category: 'Vaccines',
        date: '2026-07-15',
        url: 'https://cdsco.gov.in',
        urgent: false
      },
      {
        id: 11,
        title: 'AIIMS Delhi Launches Free AI-Based Diabetic Retinopathy Screening Programme',
        summary: 'All India Institute of Medical Sciences deploys validated deep-learning algorithm for early diabetic retinopathy detection at primary health care level across 5 states.',
        source: 'AIIMS Delhi',
        category: 'Digital Health',
        date: '2026-07-10',
        url: 'https://aiims.edu',
        urgent: false
      },
      {
        id: 12,
        title: 'Antibiotic Resistance Crisis: ICMR Restricts Sale of Carbapenem-Class Drugs',
        summary: 'ICMR places Meropenem, Imipenem, and Colistin under Schedule H1 with mandatory infectious disease specialist prescription to combat carbapenem-resistant Enterobacteriaceae (CRE).',
        source: 'ICMR',
        category: 'Antimicrobial',
        date: '2026-07-07',
        url: 'https://icmr.gov.in/amr',
        urgent: true
      }
    ];

    const tips = await allQuery(`SELECT * FROM health_tips WHERE is_active = 1`);
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    const dailyTip = tips.length > 0 ? tips[dayOfYear % tips.length] : { tip_text: 'Stay hydrated and active.', category: 'Wellness' };

    res.json({ news, dailyTip });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch news feed' });
  }
});

export default router;
