import bcrypt from 'bcryptjs';
import db, { initTables, runQuery, getQuery, allQuery } from './db.js';

export const seedDatabase = async () => {
  console.log('Seeding database...');
  await initTables();

  // Clear existing data for fresh seed
  const tables = [
    'health_tips', 'sos_events', 'organ_banks', 'blood_stock', 'blood_banks',
    'store_inventory', 'medical_stores', 'disease_medicines', 'disease_precautions',
    'disease_diet', 'disease_symptoms', 'symptoms', 'diseases', 'substitutes',
    'side_effects', 'compositions', 'medicines', 'medical_reports', 'emergency_contacts',
    'medical_history', 'user_allergies', 'user_profiles', 'users'
  ];

  for (const t of tables) {
    await runQuery(`DELETE FROM ${t}`);
  }

  // 1. Seed Users & Profiles
  const hashedPw = await bcrypt.hash('password123', 10);
  const userResult = await runQuery(
    `INSERT INTO users (name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?)`,
    ['Rahul Sharma', 'demo@nexamed.com', '+919876543210', hashedPw, 'patient']
  );
  const userId = userResult.lastID;

  await runQuery(
    `INSERT INTO user_profiles (user_id, date_of_birth, gender, blood_group, weight_kg, height_cm) VALUES (?, ?, ?, ?, ?, ?)`,
    [userId, '1995-06-15', 'male', 'O+', 72.5, 175.0]
  );

  // Allergies for Rahul Sharma (Aspirin & Penicillin to demonstrate Allergy Warning Shield)
  await runQuery(
    `INSERT INTO user_allergies (user_id, allergen, severity, reaction) VALUES (?, ?, ?, ?)`,
    [userId, 'Aspirin', 'severe', 'Severe skin rash, bronchospasm, and facial swelling']
  );
  await runQuery(
    `INSERT INTO user_allergies (user_id, allergen, severity, reaction) VALUES (?, ?, ?, ?)`,
    [userId, 'Penicillin', 'moderate', 'Urticaria and severe hives']
  );

  // Medical History
  await runQuery(
    `INSERT INTO medical_history (user_id, condition_name, diagnosed_year, is_current, notes) VALUES (?, ?, ?, ?, ?)`,
    [userId, 'Type 2 Diabetes Mellitus', 2021, 1, 'Managed with Metformin 500mg daily & dietary discipline']
  );

  // Emergency Contacts
  await runQuery(
    `INSERT INTO emergency_contacts (user_id, name, phone, relationship, priority) VALUES (?, ?, ?, ?, ?)`,
    [userId, 'Priya Sharma (Wife)', '+919812345678', 'Spouse', 1]
  );
  await runQuery(
    `INSERT INTO emergency_contacts (user_id, name, phone, relationship, priority) VALUES (?, ?, ?, ?, ?)`,
    [userId, 'Rajesh Sharma (Father)', '+919876500000', 'Parent', 2]
  );

  // Diagnostic Reports & Prescriptions
  await runQuery(
    `INSERT INTO medical_reports (user_id, title, category, lab_name, doctor_name, report_date, status, summary, test_results) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      userId,
      'Complete Blood Count (CBC) Panel',
      'Haematology',
      'Thyrocare Diagnostic Centre, Hyderabad',
      'Dr. Ananya Reddy, MD (Pathology)',
      '2026-07-28',
      'Normal',
      'Hemoglobin and RBC parameters within normal adult reference range. Platelet count healthy at 240,000 /uL.',
      JSON.stringify([
        { parameter: 'Hemoglobin (Hb)', value: '14.8 g/dL', reference: '13.0 - 17.0 g/dL', status: 'Normal' },
        { parameter: 'Total WBC Count', value: '7,200 /uL', reference: '4,000 - 11,000 /uL', status: 'Normal' },
        { parameter: 'Platelet Count', value: '240,000 /uL', reference: '150,000 - 450,000 /uL', status: 'Normal' },
        { parameter: 'Packed Cell Volume (PCV)', value: '44.2 %', reference: '40.0 - 50.0 %', status: 'Normal' }
      ])
    ]
  );

  await runQuery(
    `INSERT INTO medical_reports (user_id, title, category, lab_name, doctor_name, report_date, status, summary, test_results) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      userId,
      'Diabetic Profile & Glycated Hemoglobin (HbA1c)',
      'Endocrinology',
      'Vijaya Diagnostic Centre, Jubilee Hills',
      'Dr. V. K. Murthy, DM (Endocrinology)',
      '2026-07-15',
      'Attention Needed',
      'Fasting plasma glucose slightly elevated at 134 mg/dL. Glycated Hemoglobin (HbA1c) indicates moderate glycemic control at 6.8%. Dietary refinement recommended.',
      JSON.stringify([
        { parameter: 'Fasting Plasma Glucose', value: '134 mg/dL', reference: '70 - 99 mg/dL', status: 'High' },
        { parameter: 'Post Prandial Glucose (2hr)', value: '178 mg/dL', reference: '< 140 mg/dL', status: 'High' },
        { parameter: 'HbA1c (Glycated Hb)', value: '6.8 %', reference: '< 5.7 % (Normal), 5.7 - 6.4 (Pre-diabetic)', status: 'Attention Needed' },
        { parameter: 'Estimated Avg Glucose (eAG)', value: '148 mg/dL', reference: '< 117 mg/dL', status: 'High' }
      ])
    ]
  );

  await runQuery(
    `INSERT INTO medical_reports (user_id, title, category, lab_name, doctor_name, report_date, status, summary, test_results) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      userId,
      '12-Lead Electrocardiogram (ECG) & Lipid Profile',
      'Cardiology',
      'KIMS Hospitals Heart Institute, Secunderabad',
      'Dr. S. R. Rao, DM (Cardiology)',
      '2026-06-20',
      'Normal',
      'Normal sinus rhythm at 72 bpm. Axis normal. No ischemic ST-T changes detected. Total cholesterol at 178 mg/dL.',
      JSON.stringify([
        { parameter: 'Heart Rate (ECG)', value: '72 bpm', reference: '60 - 100 bpm', status: 'Normal' },
        { parameter: 'Total Cholesterol', value: '178 mg/dL', reference: '< 200 mg/dL', status: 'Normal' },
        { parameter: 'Triglycerides', value: '142 mg/dL', reference: '< 150 mg/dL', status: 'Normal' },
        { parameter: 'HDL (Good Cholesterol)', value: '48 mg/dL', reference: '> 40 mg/dL', status: 'Normal' },
        { parameter: 'LDL (Bad Cholesterol)', value: '102 mg/dL', reference: '< 100 mg/dL', status: 'Borderline' }
      ])
    ]
  );

  await runQuery(
    `INSERT INTO medical_reports (user_id, title, category, lab_name, doctor_name, report_date, status, summary, test_results) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      userId,
      'OPD Prescription & Clinical Advisory',
      'General OPD',
      'Apollo Hospitals OPD Clinic',
      'Dr. A. K. Verma, MD (Internal Medicine)',
      '2026-06-01',
      'Normal',
      'Routine OPD follow-up for Type-2 Diabetes management. Advised Metformin 500mg (Glycomet) post-dinner and 45-min daily walking routine.',
      JSON.stringify([
        { parameter: 'Rx Medication #1', value: 'Glycomet 500mg (Metformin)', reference: '1 Tablet Daily After Dinner', status: 'Prescribed' },
        { parameter: 'Rx Medication #2', value: 'Evion 400 (Vitamin E)', reference: '1 Capsule Daily For 30 Days', status: 'Prescribed' },
        { parameter: 'Clinical Advice', value: 'Low Glycemic Index Diet', reference: 'Avoid Sugar & Refined Carbs', status: 'Active' }
      ])
    ]
  );

  // 2. Seed Medicines
  const medsData = [
    {
      name: 'Dolo 650 Tablet',
      generic_name: 'Paracetamol',
      manufacturer: 'Micro Labs Ltd',
      mrp: 34.50,
      pack_size: 'strip of 15 tablets',
      category: 'Analgesic / Antipyretic',
      prescription_required: 0,
      description: 'Widely prescribed antipyretic and pain reliever tablet for fever, headaches, and mild to moderate bodily pain.',
      compositions: [{ chemical: 'Paracetamol', strength: '650mg' }],
      effects: [
        { effect: 'Nausea', severity: 'mild' },
        { effect: 'Allergic Skin Rash (rare)', severity: 'moderate' },
        { effect: 'Hepatotoxicity (on overdose > 4g/day)', severity: 'severe' }
      ]
    },
    {
      name: 'Crocin 650 Advance',
      generic_name: 'Paracetamol',
      manufacturer: 'GSK Consumer Healthcare',
      mrp: 42.00,
      pack_size: 'strip of 15 tablets',
      category: 'Analgesic / Antipyretic',
      prescription_required: 0,
      description: 'Fast acting paracetamol formula for quick relief from acute fever, headache, bodyache, and pain.',
      compositions: [{ chemical: 'Paracetamol', strength: '650mg' }],
      effects: [
        { effect: 'Stomach Upset', severity: 'mild' },
        { effect: 'Dizziness', severity: 'mild' }
      ]
    },
    {
      name: 'Paracip 650 Tablet',
      generic_name: 'Paracetamol (Generic)',
      manufacturer: 'Cipla Ltd',
      mrp: 18.50,
      pack_size: 'strip of 10 tablets',
      category: 'Analgesic / Antipyretic',
      prescription_required: 0,
      description: 'High-quality generic paracetamol tablet by Cipla for fever and bodily discomfort.',
      compositions: [{ chemical: 'Paracetamol', strength: '650mg' }],
      effects: [{ effect: 'Mild Gastric Irritation', severity: 'mild' }]
    },
    {
      name: 'Disprin 325mg Effervescent',
      generic_name: 'Aspirin',
      manufacturer: 'Reckitt Benckiser',
      mrp: 12.00,
      pack_size: 'strip of 10 tablets',
      category: 'NSAID / Antiplatelet',
      prescription_required: 0,
      description: 'Soluble aspirin tablet used for acute headaches, toothaches, and cardiac emergency blood thinning.',
      compositions: [{ chemical: 'Aspirin (Acetylsalicylic Acid)', strength: '325mg' }],
      effects: [
        { effect: 'Heartburn & Acid Reflux', severity: 'mild' },
        { effect: 'Gastric Ulceration / Bleeding', severity: 'severe' }
      ]
    },
    {
      name: 'Pantocid 40 Tablet',
      generic_name: 'Pantoprazole',
      manufacturer: 'Sun Pharmaceutical Industries',
      mrp: 165.00,
      pack_size: 'strip of 15 tablets',
      category: 'Proton Pump Inhibitor (Antacid)',
      prescription_required: 1,
      description: 'Proton pump inhibitor used to treat severe hyperacidity, GERD, and peptic ulcers.',
      compositions: [{ chemical: 'Pantoprazole', strength: '40mg' }],
      effects: [
        { effect: 'Headache', severity: 'mild' },
        { effect: 'Flatulence', severity: 'mild' },
        { effect: 'Diarrhea', severity: 'moderate' }
      ]
    },
    {
      name: 'Pan 40 Tablet',
      generic_name: 'Pantoprazole',
      manufacturer: 'Alkem Laboratories',
      mrp: 155.00,
      pack_size: 'strip of 15 tablets',
      category: 'Proton Pump Inhibitor (Antacid)',
      prescription_required: 1,
      description: 'Pantoprazole tablet providing effective long-lasting suppression of stomach acid secretion.',
      compositions: [{ chemical: 'Pantoprazole', strength: '40mg' }],
      effects: [{ effect: 'Nausea', severity: 'mild' }]
    },
    {
      name: 'Panto-D Capsule',
      generic_name: 'Pantoprazole + Domperidone',
      manufacturer: 'Aristo Pharmaceuticals',
      mrp: 98.00,
      pack_size: 'strip of 10 capsules',
      category: 'Antacid / Antiemetic',
      prescription_required: 1,
      description: 'Combination medication for acidity accompanied by nausea, vomiting, and bloating.',
      compositions: [
        { chemical: 'Pantoprazole', strength: '40mg' },
        { chemical: 'Domperidone', strength: '30mg' }
      ],
      effects: [
        { effect: 'Dry Mouth', severity: 'mild' },
        { effect: 'Drowsiness', severity: 'mild' }
      ]
    },
    {
      name: 'Azithral 500 Tablet',
      generic_name: 'Azithromycin',
      manufacturer: 'Alembic Pharmaceuticals',
      mrp: 119.50,
      pack_size: 'strip of 5 tablets',
      category: 'Macrolide Antibiotic',
      prescription_required: 1,
      description: 'Broad spectrum macrolide antibiotic used for respiratory tract infections, tonsillitis, and typhoid.',
      compositions: [{ chemical: 'Azithromycin', strength: '500mg' }],
      effects: [
        { effect: 'Abdominal Pain', severity: 'moderate' },
        { effect: 'Diarrhea', severity: 'moderate' },
        { effect: 'Nausea', severity: 'mild' }
      ]
    },
    {
      name: 'Azee 500 Tablet',
      generic_name: 'Azithromycin',
      manufacturer: 'Cipla Ltd',
      mrp: 71.00,
      pack_size: 'strip of 5 tablets',
      category: 'Macrolide Antibiotic',
      prescription_required: 1,
      description: 'Generic macrolide antibiotic strip by Cipla targeting bacterial infections.',
      compositions: [{ chemical: 'Azithromycin', strength: '500mg' }],
      effects: [{ effect: 'Stomach Upset', severity: 'mild' }]
    },
    {
      name: 'Glycomet 500 Tablet',
      generic_name: 'Metformin Hydrochloride',
      manufacturer: 'USV Ltd',
      mrp: 24.50,
      pack_size: 'strip of 10 tablets',
      category: 'Antidiabetic (Biguanide)',
      prescription_required: 1,
      description: 'First-line antidiabetic medicine for controlling blood glucose levels in Type 2 Diabetes.',
      compositions: [{ chemical: 'Metformin Hydrochloride', strength: '500mg' }],
      effects: [
        { effect: 'Metallic Taste in Mouth', severity: 'mild' },
        { effect: 'Diarrhea / Loose Stools', severity: 'moderate' }
      ]
    },
    {
      name: 'Metformin 500 Generic',
      generic_name: 'Metformin Hydrochloride',
      manufacturer: 'Jan Aushadhi Kendra / IDPL',
      mrp: 8.50,
      pack_size: 'strip of 10 tablets',
      category: 'Antidiabetic (Biguanide)',
      prescription_required: 1,
      description: 'Government approved affordable generic metformin for diabetes management.',
      compositions: [{ chemical: 'Metformin Hydrochloride', strength: '500mg' }],
      effects: [{ effect: 'Mild GI discomfort', severity: 'mild' }]
    },
    {
      name: 'Combiflam Tablet',
      generic_name: 'Ibuprofen + Paracetamol',
      manufacturer: 'Sanofi India Ltd',
      mrp: 45.00,
      pack_size: 'strip of 20 tablets',
      category: 'NSAID / Analgesic',
      prescription_required: 0,
      description: 'Combination painkiller effective for severe dental pain, joint pain, muscle inflammation, and fever.',
      compositions: [
        { chemical: 'Ibuprofen', strength: '400mg' },
        { chemical: 'Paracetamol', strength: '325mg' }
      ],
      effects: [
        { effect: 'Epigastric Pain', severity: 'moderate' },
        { effect: 'Dizziness', severity: 'mild' }
      ]
    },
    {
      name: 'Telma 40 Tablet',
      generic_name: 'Telmisartan',
      manufacturer: 'Glenmark Pharmaceuticals',
      mrp: 145.00,
      pack_size: 'strip of 15 tablets',
      category: 'Antihypertensive (ARB)',
      prescription_required: 1,
      description: 'Angiotensin receptor blocker used to lower blood pressure and protect kidney function in hypertensive patients.',
      compositions: [{ chemical: 'Telmisartan', strength: '40mg' }],
      effects: [
        { effect: 'Dizziness / Orthostatic Hypotension', severity: 'moderate' },
        { effect: 'Hyperkalemia', severity: 'severe' }
      ]
    },
    {
      name: 'Allegra 120mg Tablet',
      generic_name: 'Fexofenadine',
      manufacturer: 'Sanofi India Ltd',
      mrp: 218.00,
      pack_size: 'strip of 10 tablets',
      category: 'Non-drowsy Antihistamine',
      prescription_required: 0,
      description: 'Non-sedating antihistamine for relief from seasonal allergic rhinitis, sneezing, runny nose, and hives.',
      compositions: [{ chemical: 'Fexofenadine Hydrochloride', strength: '120mg' }],
      effects: [{ effect: 'Headache', severity: 'mild' }, { effect: 'Drowsiness (rare)', severity: 'mild' }]
    },
    {
      name: 'Augmentin 625 DUO Tablet',
      generic_name: 'Amoxicillin + Clavulanic Acid',
      manufacturer: 'GSK Consumer Healthcare',
      mrp: 223.50,
      pack_size: 'strip of 10 tablets',
      category: 'Penicillin Antibiotic',
      prescription_required: 1,
      description: 'Potent beta-lactamase resistant penicillin antibiotic combination for bacterial infections.',
      compositions: [
        { chemical: 'Amoxicillin Trihydrate', strength: '500mg' },
        { chemical: 'Clavulanate Potassium', strength: '125mg' }
      ],
      effects: [
        { effect: 'Diarrhea & Vaginal Candidiasis', severity: 'moderate' },
        { effect: 'Severe Anaphylactic Allergic Reaction (Penicillin sensitivity)', severity: 'severe' }
      ]
    }
  ];

  const medIdMap = {};
  for (const m of medsData) {
    const res = await runQuery(
      `INSERT INTO medicines (name, generic_name, manufacturer, mrp, pack_size, category, prescription_required, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [m.name, m.generic_name, m.manufacturer, m.mrp, m.pack_size, m.category, m.prescription_required, m.description]
    );
    const medId = res.lastID;
    medIdMap[m.name] = medId;

    for (const comp of m.compositions) {
      await runQuery(
        `INSERT INTO compositions (medicine_id, chemical_name, strength) VALUES (?, ?, ?)`,
        [medId, comp.chemical, comp.strength]
      );
    }
    for (const eff of m.effects) {
      await runQuery(
        `INSERT INTO side_effects (medicine_id, effect, severity) VALUES (?, ?, ?)`,
        [medId, eff.effect, eff.severity]
      );
    }
  }

  // 3. Substitutes (Brand vs Generic Savings mapping)
  const substitutePairs = [
    { brand: 'Dolo 650 Tablet', sub: 'Paracip 650 Tablet' },
    { brand: 'Crocin 650 Advance', sub: 'Paracip 650 Tablet' },
    { brand: 'Pantocid 40 Tablet', sub: 'Pan 40 Tablet' },
    { brand: 'Azithral 500 Tablet', sub: 'Azee 500 Tablet' },
    { brand: 'Glycomet 500 Tablet', sub: 'Metformin 500 Generic' }
  ];

  for (const pair of substitutePairs) {
    const brandId = medIdMap[pair.brand];
    const subId = medIdMap[pair.sub];
    if (brandId && subId) {
      const brandObj = medsData.find(x => x.name === pair.brand);
      const subObj = medsData.find(x => x.name === pair.sub);
      const savingAmt = Math.max(0, brandObj.mrp - subObj.mrp);
      const savingPct = Math.round((savingAmt / brandObj.mrp) * 100);

      await runQuery(
        `INSERT INTO substitutes (medicine_id, substitute_id, saving_amount, saving_percentage) VALUES (?, ?, ?, ?)`,
        [brandId, subId, savingAmt, savingPct]
      );
    }
  }

  // 4. Seed Symptoms
  const symptomsList = [
    // Head
    { name: 'High Fever (>101°F)', body_region: 'Head', category: 'General/Systemic' },
    { name: 'Throbbing Headache', body_region: 'Head', category: 'Neurological' },
    { name: 'Dizziness & Lightheadedness', body_region: 'Head', category: 'Neurological' },
    { name: 'Stiff Neck', body_region: 'Head', category: 'Neurological' },
    { name: 'Confusion & Disorientation', body_region: 'Head', category: 'Neurological' },
    { name: 'Sore Throat & Difficulty Swallowing', body_region: 'Head', category: 'ENT' },
    { name: 'Loss of Taste or Smell', body_region: 'Head', category: 'ENT' },

    // Chest
    { name: 'Sharp Chest Pain', body_region: 'Chest', category: 'Cardiovascular' },
    { name: 'Shortness of Breath (Dyspnea)', body_region: 'Chest', category: 'Respiratory' },
    { name: 'Persistent Dry Cough', body_region: 'Chest', category: 'Respiratory' },
    { name: 'Productive Cough with Phlegm', body_region: 'Chest', category: 'Respiratory' },
    { name: 'Wheezing Sound', body_region: 'Chest', category: 'Respiratory' },
    { name: 'Rapid Heartbeat (Palpitations)', body_region: 'Chest', category: 'Cardiovascular' },

    // Abdomen
    { name: 'Nausea & Vomiting', body_region: 'Abdomen', category: 'Gastrointestinal' },
    { name: 'Severe Abdominal Cramps', body_region: 'Abdomen', category: 'Gastrointestinal' },
    { name: 'Loss of Appetite', body_region: 'Abdomen', category: 'Gastrointestinal' },
    { name: 'Watery Diarrhea', body_region: 'Abdomen', category: 'Gastrointestinal' },
    { name: 'Burning Acid Reflux & Heartburn', body_region: 'Abdomen', category: 'Gastrointestinal' },
    { name: 'Abdominal Bloating & Gas', body_region: 'Abdomen', category: 'Gastrointestinal' },

    // Limbs & Joints
    { name: 'Severe Joint & Bone Pain', body_region: 'Limbs', category: 'Musculoskeletal' },
    { name: 'General Muscle Aches (Myalgia)', body_region: 'Limbs', category: 'Musculoskeletal' },
    { name: 'Swelling in Feet or Ankles', body_region: 'Limbs', category: 'Circulatory' },

    // Skin
    { name: 'Skin Rash or Red Spots', body_region: 'Skin', category: 'Dermatological' },
    { name: 'Yellowing Skin / Eyes (Jaundice)', body_region: 'Skin', category: 'Hepatic' },

    // General
    { name: 'Extreme Fatigue & Weakness', body_region: 'General', category: 'Systemic' },
    { name: 'Excessive Thirst (Polydipsia)', body_region: 'General', category: 'Endocrine' },
    { name: 'Frequent Urination (Polyuria)', body_region: 'General', category: 'Endocrine' },
    { name: 'Sudden Chills & Sweats', body_region: 'General', category: 'Systemic' }
  ];

  const symptomIdMap = {};
  for (const s of symptomsList) {
    const res = await runQuery(
      `INSERT INTO symptoms (name, body_region, category) VALUES (?, ?, ?)`,
      [s.name, s.body_region, s.category]
    );
    symptomIdMap[s.name] = res.lastID;
  }

  // 5. Seed Diseases & Mappings
  const diseasesData = [
    {
      name: 'Dengue Fever',
      icd_code: 'A90',
      category: 'Infectious Vector-Borne',
      overview: 'Mosquito-borne viral infection causing severe flu-like illness, high fever, and sudden drop in blood platelet count.',
      definition: 'Dengue is transmitted by female Aedes aegypti mosquitoes. It presents with high fever, retro-orbital pain, severe bone pain, and hemorrhagic tendencies.',
      causes: 'Dengue Virus (DEN-1, DEN-2, DEN-3, DEN-4 serotypes) transmitted through mosquito bites.',
      diagnosis: 'NS1 Antigen Test, Dengue IgM/IgG Antibody ELISA, Complete Blood Count (CBC) monitoring platelet levels.',
      treatment: 'Supportive fluid therapy, oral rehydration salts (ORS), Paracetamol for fever relief. NSAIDs (Aspirin/Ibuprofen) are strictly CONTRAINDICATED due to bleeding risk.',
      emergency_signs: '🚨 Red Flag: Severe abdominal pain, persistent vomiting, mucosal bleeding (gums/nose), sudden drop in blood pressure, or extreme lethargy. Seek immediate hospital admission.',
      symptoms: ['High Fever (>101°F)', 'Throbbing Headache', 'Severe Joint & Bone Pain', 'General Muscle Aches (Myalgia)', 'Nausea & Vomiting', 'Skin Rash or Red Spots', 'Extreme Fatigue & Weakness'],
      diet_recommended: ['Papaya leaf juice extract', 'Coconut water & ORS', 'Pomegranate & fresh fruit juices', 'Soft bland soups'],
      diet_avoid: ['Oily fried foods', 'Caffeinated beverages', 'Dark coloured foods (makes detecting GI bleeding difficult)', 'Spicy curries'],
      precautions: ['Eliminate stagnant water around home', 'Use mosquito repellent (DEET/Picaridin)', 'Wear full-sleeved protective clothing', 'Monitor platelet counts daily'],
      linked_meds: [{ med: 'Dolo 650 Tablet', note: 'For fever management (DO NOT take Ibuprofen/Aspirin)' }]
    },
    {
      name: 'Type 2 Diabetes Mellitus',
      icd_code: 'E11',
      category: 'Endocrine & Metabolic',
      overview: 'Chronic metabolic disorder characterized by high blood glucose due to insulin resistance and progressive beta-cell dysfunction.',
      definition: 'Type 2 Diabetes occurs when the body cells fail to respond effectively to insulin. Over time, elevated blood sugar damages blood vessels, nerves, kidneys, and eyes.',
      causes: 'Combination of genetic susceptibility, sedentary lifestyle, obesity, visceral fat accumulation, and high refined carbohydrate diet.',
      diagnosis: 'Fasting Blood Sugar (FBS >= 126 mg/dL), Postprandial Blood Sugar (PPBS >= 200 mg/dL), HbA1c test (>= 6.5%).',
      treatment: 'Lifestyle modification, regular physical exercise, oral hypoglycemic agents (Metformin), and insulin injection therapy if required.',
      emergency_signs: '🚨 Severe hypoglycemia (blood sugar < 70 mg/dL with sweating, trembling, confusion) or Diabetic Ketoacidosis (fruity breath, deep rapid breathing, coma).',
      symptoms: ['Excessive Thirst (Polydipsia)', 'Frequent Urination (Polyuria)', 'Extreme Fatigue & Weakness', 'Loss of Appetite', 'Swelling in Feet or Ankles'],
      diet_recommended: ['High fiber whole grains (millets, oats, brown rice)', 'Green leafy vegetables & legumes', 'Nuts (walnuts, almonds)', 'Bitter gourd (Karela) & Jamun'],
      diet_avoid: ['Sugary soft drinks & sweets', 'Refined flour (Maida) & white bread', 'Deep fried snacks', 'Excessive fruit juices'],
      precautions: ['Monitor blood sugar levels weekly', 'Inspect feet daily for cuts or sores', 'Maintain 30 mins daily brisk walking', 'Adhere strictly to prescribed medicine dosage'],
      linked_meds: [
        { med: 'Glycomet 500 Tablet', note: 'First-line glucose lowering agent' },
        { med: 'Metformin 500 Generic', note: 'Affordable generic substitute for daily glycemic control' }
      ]
    },
    {
      name: 'Hypertension (High Blood Pressure)',
      icd_code: 'I10',
      category: 'Cardiovascular',
      overview: 'Persistent elevation in systemic arterial blood pressure (Systolic >= 140 mmHg or Diastolic >= 90 mmHg).',
      definition: 'Often referred to as the silent killer because it exhibits few early symptoms while silently damaging arterial walls, heart muscle, and kidney microvasculature.',
      causes: 'High dietary sodium intake, stress, smoking, alcohol abuse, kidney disease, family history, and physical inactivity.',
      diagnosis: 'Repeated digital or manual Blood Pressure (BP) sphygmomanometer checks, ECG, Echocardiogram, Renal Doppler.',
      treatment: 'Low sodium DASH diet, daily antihypertensive medications (ARBs like Telmisartan, ACE inhibitors, Calcium Channel Blockers).',
      emergency_signs: '🚨 Hypertensive Crisis (BP > 180/120 mmHg) accompanied by severe chest pain, shortness of breath, numbness/weakness in arm, or sudden vision loss. CALL 108.',
      symptoms: ['Throbbing Headache', 'Dizziness & Lightheadedness', 'Sharp Chest Pain', 'Rapid Heartbeat (Palpitations)', 'Shortness of Breath (Dyspnea)'],
      diet_recommended: ['DASH diet rich in potassium & magnesium', 'Bananas, spinach, beetroot juice', 'Garlic & flaxseeds', 'Low-fat dairy products'],
      diet_avoid: ['High salt pickles, papads & packaged soups', 'Processed meats', 'Excessive caffeinated drinks', 'Alcohol & tobacco'],
      precautions: ['Limit salt intake to < 5g per day', 'Monitor Blood Pressure twice weekly', 'Practice stress reduction (Yoga/Meditation)', 'Never stop BP medication abruptly'],
      linked_meds: [{ med: 'Telma 40 Tablet', note: 'Telmisartan 40mg daily morning dose' }]
    },
    {
      name: 'Acute Gastritis & Acid Peptic Disease',
      icd_code: 'K29',
      category: 'Gastrointestinal',
      overview: 'Inflammation of the protective mucosal lining of the stomach causing acid reflux, burning sensation, and indigestion.',
      definition: 'Occurs when mucosal barrier is breached by excess hydrochloric acid, H. pylori bacterial infection, or frequent NSAID painkiller use.',
      causes: 'Spicy foods, irregular meal timings, stress, H. pylori infection, excessive alcohol/smoking, frequent Aspirin/Combiflam usage.',
      diagnosis: 'Clinical assessment, Endoscopy (EGD), H. Pylori stool antigen test.',
      treatment: 'Proton Pump Inhibitors (Pantoprazole), Antacids (Gelusil), prokinetics, and dietary regulation.',
      emergency_signs: '🚨 Black tarry stools (melena), vomiting blood or coffee-ground material, severe knife-like upper abdominal pain (indicates peptic ulcer perforation).',
      symptoms: ['Burning Acid Reflux & Heartburn', 'Nausea & Vomiting', 'Abdominal Bloating & Gas', 'Loss of Appetite', 'Severe Abdominal Cramps'],
      diet_recommended: ['Cold milk & coconut water', 'Bananas & oatmeal', 'Curd & buttermilk (probiotics)', 'Boiled vegetables'],
      diet_avoid: ['Raw chillies, spicy masalas', 'Citrus fruits & tomatoes', 'Coffee & carbonated drinks', 'Alcohol & fried foods'],
      precautions: ['Eat small, frequent meals', 'Avoid lying down immediately after eating', 'Discontinue NSAID painkillers', 'Take PPI medicine 30 mins before breakfast'],
      linked_meds: [
        { med: 'Pantocid 40 Tablet', note: 'Take 30 minutes before morning meal' },
        { med: 'Pan 40 Tablet', note: 'Cost-effective PPI option' },
        { med: 'Panto-D Capsule', note: 'If acidity is accompanied by nausea/vomiting' }
      ]
    },
    {
      name: 'Acute Bronchitis & Respiratory Infection',
      icd_code: 'J20',
      category: 'Respiratory',
      overview: 'Inflammation of the bronchial tubes leading to mucus hypersecretion, dry/productive cough, and chest tightness.',
      definition: 'Usually viral in origin (following a common cold), characterized by inflammation of bronchial mucosa and temporary airway hypersensitivity.',
      causes: 'Viral infections (Rhinovirus, Influenza), secondary bacterial infection, air pollution, smoking, allergy triggers.',
      diagnosis: 'Chest Auscultation (rhonchi/wheeze), Chest X-ray to rule out pneumonia, Sputum culture if bacterial.',
      treatment: 'Steam inhalation, warm hydration, bronchodilators, mucolytics, and macrolide antibiotics (Azithromycin) if bacterial.',
      emergency_signs: '🚨 High grade fever with severe breathlessness, bluish discoloration of lips/fingers (cyanosis), or oxygen saturation dropping below 92%.',
      symptoms: ['Persistent Dry Cough', 'Productive Cough with Phlegm', 'Shortness of Breath (Dyspnea)', 'Wheezing Sound', 'Sore Throat & Difficulty Swallowing', 'High Fever (>101°F)'],
      diet_recommended: ['Warm turmeric milk & herbal teas', 'Chicken/Vegetable broth', 'Honey & ginger infusions', 'Vitamin C rich fruits'],
      diet_avoid: ['Refrigerated cold drinks & ice creams', 'Deep fried greasy items', 'Dusty environment exposure'],
      precautions: ['Use steam inhalation twice daily', 'Avoid passive tobacco smoke', 'Rest & drink plenty of warm fluids', 'Complete full course of prescribed antibiotics'],
      linked_meds: [
        { med: 'Azithral 500 Tablet', note: '500mg once daily for 3 to 5 days' },
        { med: 'Allegra 120mg Tablet', note: 'For allergic cough & nasal congestion' }
      ]
    }
  ];

  for (const d of diseasesData) {
    const res = await runQuery(
      `INSERT INTO diseases (name, icd_code, category, overview, definition, causes, diagnosis, treatment, emergency_signs) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [d.name, d.icd_code, d.category, d.overview, d.definition, d.causes, d.diagnosis, d.treatment, d.emergency_signs]
    );
    const diseaseId = res.lastID;

    // Link Symptoms
    for (const symName of d.symptoms) {
      const symId = symptomIdMap[symName];
      if (symId) {
        await runQuery(
          `INSERT INTO disease_symptoms (disease_id, symptom_id) VALUES (?, ?)`,
          [diseaseId, symId]
        );
      }
    }

    // Link Diet
    for (const item of d.diet_recommended) {
      await runQuery(`INSERT INTO disease_diet (disease_id, diet_item, type) VALUES (?, ?, 'recommended')`, [diseaseId, item]);
    }
    for (const item of d.diet_avoid) {
      await runQuery(`INSERT INTO disease_diet (disease_id, diet_item, type) VALUES (?, ?, 'avoid')`, [diseaseId, item]);
    }

    // Link Precautions
    for (let i = 0; i < d.precautions.length; i++) {
      await runQuery(`INSERT INTO disease_precautions (disease_id, precaution, priority) VALUES (?, ?, ?)`, [diseaseId, d.precautions[i], i + 1]);
    }

    // Link Medicines
    for (const lm of d.linked_meds) {
      const mId = medIdMap[lm.med];
      if (mId) {
        await runQuery(`INSERT INTO disease_medicines (disease_id, medicine_id, usage_note) VALUES (?, ?, ?)`, [diseaseId, mId, lm.note]);
      }
    }
  }

  // 6. Seed Medical Stores
  const storesData = [
    {
      name: 'Apollo Pharmacy — Jubilee Hills 24x7',
      address: 'Road No. 36, Near Metro Station, Jubilee Hills, Hyderabad',
      city: 'Hyderabad',
      state: 'Telangana',
      phone: '+91 40 2355 9999',
      latitude: 17.4325,
      longitude: 78.4071,
      open_time: '00:00',
      close_time: '23:59',
      is_open_24h: 1
    },
    {
      name: 'MedPlus Pharmacy — Madhapur Main Road',
      address: 'Plot No. 12, Hitec City Main Rd, Madhapur, Hyderabad',
      city: 'Hyderabad',
      state: 'Telangana',
      phone: '+91 40 6677 8899',
      latitude: 17.4483,
      longitude: 78.3915,
      open_time: '07:00',
      close_time: '23:00',
      is_open_24h: 0
    },
    {
      name: 'Apollo Pharmacy — Koramangala 5th Block',
      address: '80 Feet Rd, Opp Forum Mall, Koramangala, Bengaluru',
      city: 'Bengaluru',
      state: 'Karnataka',
      phone: '+91 80 4111 2233',
      latitude: 12.9352,
      longitude: 77.6245,
      open_time: '00:00',
      close_time: '23:59',
      is_open_24h: 1
    },
    {
      name: 'Wellness Forever — Bandra West',
      address: 'Hill Road, Opp St Andrews Church, Bandra West, Mumbai',
      city: 'Mumbai',
      state: 'Maharashtra',
      phone: '+91 22 2640 1122',
      latitude: 19.0596,
      longitude: 72.8295,
      open_time: '00:00',
      close_time: '23:59',
      is_open_24h: 1
    }
  ];

  for (const s of storesData) {
    const res = await runQuery(
      `INSERT INTO medical_stores (name, address, city, state, phone, latitude, longitude, open_time, close_time, is_open_24h) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [s.name, s.address, s.city, s.state, s.phone, s.latitude, s.longitude, s.open_time, s.close_time, s.is_open_24h]
    );
    const storeId = res.lastID;

    // Attach inventory for top medicines
    for (const medName in medIdMap) {
      const medId = medIdMap[medName];
      await runQuery(
        `INSERT INTO store_inventory (store_id, medicine_id, in_stock, quantity, price_at_store) VALUES (?, ?, 1, ?, ?)`,
        [storeId, medId, Math.floor(Math.random() * 80) + 20, medsData.find(x => x.name === medName)?.mrp || 50]
      );
    }
  }

  // 7. Seed Blood Banks
  const bloodBanksData = [
    {
      name: 'NTR Memorial Trust Blood Centre (Government Partnered)',
      address: 'Road No. 2, Banani, Banjara Hills, Hyderabad',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500034',
      phone: '+91 40 3079 9999',
      email: 'bloodbank@ntrmemorialtrust.org',
      latitude: 17.4184,
      longitude: 78.4385,
      license_number: 'TS/BB/2018/104',
      government_run: 1,
      stocks: { 'A+': 18, 'A-': 4, 'B+': 24, 'B-': 6, 'O+': 32, 'O-': 8, 'AB+': 12, 'AB-': 2 }
    },
    {
      name: 'Chiranjeevi Charitable Blood & Eye Bank',
      address: 'Road No. 1, Jubliee Hills, Hyderabad',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500033',
      phone: '+91 40 2355 4455',
      email: 'info@chiranjeevitrust.org',
      latitude: 17.4300,
      longitude: 78.4110,
      license_number: 'TS/BB/2015/088',
      government_run: 0,
      stocks: { 'A+': 15, 'A-': 2, 'B+': 30, 'B-': 5, 'O+': 40, 'O-': 7, 'AB+': 10, 'AB-': 3 }
    },
    {
      name: 'Rotary Bangalore TTK Blood Centre',
      address: 'New Thippasandra Main Rd, HAL 3rd Stage, Bengaluru',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560075',
      phone: '+91 80 2528 7903',
      email: 'contact@rotaryttk.org',
      latitude: 12.9734,
      longitude: 77.6540,
      license_number: 'KA/BB/2012/045',
      government_run: 1,
      stocks: { 'A+': 22, 'A-': 5, 'B+': 19, 'B-': 3, 'O+': 28, 'O-': 6, 'AB+': 14, 'AB-': 1 }
    },
    {
      name: 'KEM Hospital Central Blood Bank',
      address: 'Acharya Donde Marg, Parel, Mumbai',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400012',
      phone: '+91 22 2410 7000',
      email: 'bloodbank@kem.edu',
      latitude: 19.0024,
      longitude: 72.8427,
      license_number: 'MH/BB/2005/012',
      government_run: 1,
      stocks: { 'A+': 35, 'A-': 8, 'B+': 42, 'B-': 10, 'O+': 55, 'O-': 12, 'AB+': 20, 'AB-': 5 }
    }
  ];

  for (const bb of bloodBanksData) {
    const res = await runQuery(
      `INSERT INTO blood_banks (name, address, city, state, pincode, phone, email, latitude, longitude, license_number, government_run) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [bb.name, bb.address, bb.city, bb.state, bb.pincode, bb.phone, bb.email, bb.latitude, bb.longitude, bb.license_number, bb.government_run]
    );
    const bbId = res.lastID;

    for (const bg in bb.stocks) {
      await runQuery(
        `INSERT INTO blood_stock (blood_bank_id, blood_group, units_available) VALUES (?, ?, ?)`,
        [bbId, bg, bb.stocks[bg]]
      );
    }
  }

  // 8. Seed Organ & Eye Banks (NOTTO Registered)
  const organBanksData = [
    {
      name: 'Nizam Institute of Medical Sciences (NIMS) Transplant Center',
      type: 'multi_organ',
      address: 'Punjagutta Main Rd, Erramanzil, Hyderabad',
      city: 'Hyderabad',
      state: 'Telangana',
      phone: '+91 40 2348 9000',
      notto_registered: 1,
      notto_id: 'NOTTO-TS-HOSP-004',
      latitude: 17.4243,
      longitude: 78.4552,
      website: 'https://nims.edu.in'
    },
    {
      name: 'L.V. Prasad Eye Institute (LVPEI) Ramayamma International Eye Bank',
      type: 'eye_bank',
      address: 'Kallam Anji Reddy Campus, Banjara Hills, Hyderabad',
      city: 'Hyderabad',
      state: 'Telangana',
      phone: '+91 40 6810 2020',
      notto_registered: 1,
      notto_id: 'NOTTO-TS-EYE-001',
      latitude: 17.4285,
      longitude: 78.4350,
      website: 'https://www.lvpei.org'
    },
    {
      name: 'Manipal Hospital Multi-Organ Transplant Institute',
      type: 'multi_organ',
      address: '98 Rustam Bagh, Old Airport Rd, Bengaluru',
      city: 'Bengaluru',
      state: 'Karnataka',
      phone: '+91 80 2502 4444',
      notto_registered: 1,
      notto_id: 'NOTTO-KA-HOSP-012',
      latitude: 12.9582,
      longitude: 77.6492,
      website: 'https://www.manipalhospitals.com'
    },
    {
      name: 'National Organ and Tissue Transplant Organisation (NOTTO Registry HQ)',
      type: 'registry',
      address: '5th Floor, Institute of Pathology Building, Safdarjung Hospital Campus, New Delhi',
      city: 'New Delhi',
      state: 'Delhi',
      phone: '1800-11-4770 (24x7 Helpline)',
      notto_registered: 1,
      notto_id: 'NOTTO-HQ-GOI',
      latitude: 28.5714,
      longitude: 77.2081,
      website: 'https://notto.mohfw.gov.in'
    }
  ];

  for (const ob of organBanksData) {
    await runQuery(
      `INSERT INTO organ_banks (name, type, address, city, state, phone, notto_registered, notto_id, latitude, longitude, website) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [ob.name, ob.type, ob.address, ob.city, ob.state, ob.phone, ob.notto_registered, ob.notto_id, ob.latitude, ob.longitude, ob.website]
    );
  }

  // 9. Seed Health Tips
  const healthTips = [
    { category: 'Nutrition', text: 'Incorporating high-fiber millets like Ragi and Jowar in lunch stabilizes post-meal blood sugar spikes.' },
    { category: 'Hydration', text: 'Drinking 2.5 to 3 liters of fresh water daily optimizes renal filtration and flushing of metabolic waste.' },
    { category: 'Medicine Safety', text: 'Always check composition active ingredients instead of brand names to avoid accidental double dosing of Paracetamol.' },
    { category: 'Exercise', text: 'A brisk 15-minute walk after dinner reduces peak postprandial glucose levels by up to 22%.' },
    { category: 'First Aid', text: 'In case of severe Dengue fever, never take Ibuprofen or Aspirin as they significantly increase mucosal bleeding risks.' }
  ];

  for (const ht of healthTips) {
    await runQuery(`INSERT INTO health_tips (tip_text, category) VALUES (?, ?)`, [ht.text, ht.category]);
  }

  console.log('Database seeded successfully with rich realistic datasets!');
};

// Execute if run directly
if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  seedDatabase().then(() => process.exit(0)).catch(err => {
    console.error('Seeding failed:', err);
    process.exit(1);
  });
}
