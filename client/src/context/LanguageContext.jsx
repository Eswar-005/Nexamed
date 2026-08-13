import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const LANGUAGES = [
  { code: 'en', name: 'English',  flag: '🇬🇧', label: 'English' },
  { code: 'te', name: 'తెలుగు',   flag: '🇮🇳', label: 'తెలుగు (Telugu)' },
  { code: 'hi', name: 'हिंदी',    flag: '🇮🇳', label: 'हिंदी (Hindi)' },
  { code: 'ta', name: 'தமிழ்',    flag: '🇮🇳', label: 'தமிழ் (Tamil)' },
  { code: 'kn', name: 'ಕನ್ನಡ',    flag: '🇮🇳', label: 'ಕನ್ನಡ (Kannada)' },
];

export const TRANSLATIONS = {
  en: {
    // ── Navigation ──
    navHome:    'Home',
    navPharma:  'Generic Medicines',
    navDisease: 'Disease Profiles',
    navSymptom: 'Symptom Checker',
    navStores:  '24x7 Pharmacies',
    navBlood:   'Blood Stock',
    navOrgan:   'Organ Registry',
    navNews:    'Health News',
    navProfile: 'My Profile',
    navOcr:     'OCR Medicine Scanner',

    // ── Navbar UI labels (no mixed languages) ──
    selectLanguage:  'Select Language',
    allModules:      'All Modules',
    footerCredit:    'Nexamed Healthcare Engine · Multilingual',
    lightMode:       'Light Mode',
    darkMode:        'Dark Mode',

    // ── SOS / Audio ──
    sosBtn:    '1-TAP SOS',
    readPage:  'Listen to Page (Audio)',
    stopAudio: 'Stop Audio',

    // ── Helplines ──
    call104:   'Call 104 Govt Helpline',
    call108:   'Call 108 Ambulance',
    ashaTitle: 'ASHA / Rural Health Worker Guidance',
    ashaDesc:  'If you cannot type or explain symptoms, call 104 or visit your nearest Primary Health Centre (PHC).',

    // ── Voice ──
    voiceSearch:     'Tap to Speak (Voice Search)',
    voiceListening:  'Listening... Speak now...',
    emergencyAlert:  'Emergency SOS Activated',

    // ── Voice Assistant Widget ──
    voiceAssistantTitle: 'Voice Assistant',
    voiceAssistantHint:  'Say: "Search Paracetamol", "Go to Blood Bank", "Emergency"',
    voiceWelcome:        'Hello! How can I help you today?',
    voiceNotSupported:   'Voice not supported on this browser. Use Chrome.',
    voiceNoMatch:        'Could not understand. Please try again.',
    voiceNavigating:     'Opening',
    voiceSearching:      'Searching for',
    voiceDictateStory:   'Tell me your symptoms and I will help you.',
    stopListening:       'Stop Listening',
    startListening:      'Tap to Speak',

    // ── Home Hero ──
    heroTitle:       'Your Complete Healthcare Intelligence Platform',
    heroDesc:        'Search medicines, explore diseases, check symptoms with voice input, find pharmacies, and trigger emergency SOS.',
    wellnessTipTitle: "TODAY'S WELLNESS TIP — First Aid",
    wellnessTipText:  'In case of severe Dengue fever, never take Ibuprofen or Aspirin as they significantly increase mucosal bleeding risks.',
    searchPlaceholder: 'Search medicine, salt, disease, or hospital...',

    // ── Module Titles ──
    pharmaTitle:   'Generic Medicines & Substitutes',
    diseaseTitle:  'Clinical Disease Encyclopedia',
    storeTitle:    '24x7 Medical Store & Pharmacy Map',
    bloodTitle:    'Live Blood Bank Directory & Stock',
    organTitle:    'NOTTO Organ Bank & Transplant Registry',
    newsTitle:     'Health Bulletins & WHO News',
    profileTitle:  'Patient Health Profile & Emergency Shield',

    // ── Common Buttons ──
    savePercentage:       'Save up to 70% on Generics',
    searchBtn:            'Search',
    clearBtn:             'Clear',
    detailsBtn:           'View Details',
    emergencyDisclaimer:  'Not a final medical diagnosis. Always consult a certified physician.',

    // ── Footer ──
    footerDisclaimer:     'MEDICAL & LEGAL DISCLAIMER: ',
    footerDisclaimerBody: 'Content, symptom matching, and medicine data on Nexamed are for educational and informational purposes only. In a medical emergency, call 108 (National Ambulance) or visit your nearest hospital immediately.',
    emergencyHelplines:   'Emergency & National Helplines',
    organBloodDonation:   'Organ & Blood Donation',
    saveLives:            'Save Lives — Donate',
    donationText:         'Register as a voluntary blood or organ donor. One donor can save up to 8 lives. Join the NOTTO national registry today.',
    nottoPortal:          'Official NOTTO Portal',
    footerRights:         '© Nexamed Healthcare Portal. All rights reserved.',
    footerStack:          'Built with React 19 · Node.js · SQLite · Leaflet',

    // ── Symptom Checker ──
    scTitle:          'Interactive Clinical Symptom Checker',
    scSubtitle:       'Multilingual & Voice-Enabled clinical symptom matcher for all patients',
    scStep1:          '1. Select Body Region',
    scStep2:          '2. Pick Symptoms / Voice Input',
    scStep3:          '3. Clinical Assessment Report',
    scDisclaimerTitle: 'NOT A FINAL MEDICAL DIAGNOSIS: ',
    scDisclaimerText:  'This tool provides clinical symptom matching for informational guidance. Always consult a certified physician.',
    scVoiceBtn:        'Tap & Speak Symptoms (Voice Input)',
    scListeningMsg:    'Listening... Speak your symptoms clearly (e.g. fever, headache, stomach pain)',
    scListenResults:   'Listen to Assessment (Audio Readout)',
    scStopAudio:       'Stop Audio Readout',
    scNeedHelpTitle:   "Can't type or need assistance? Call a Doctor or Health Worker Directly",
    scNeedHelpDesc:    'Free 24×7 Government Health Consultation (104), Emergency Ambulance (108), or ASHA Rural Worker Guidance.',
    scHelpline104Title: 'Govt Tele-Health Helpline 104',
    scHelpline104Sub:   '24×7 Free Doctor Consultation & Health Advice',
    scHelpline108Title: 'Emergency Ambulance 108',
    scHelpline108Sub:   'Instant Emergency Medical Transport & Critical Care',
    scCallDocBtn:       'Call Health Helpline (104)',
    scAshaGuidanceTitle: 'Rural Health / ASHA Worker Guidance',
    scAshaGuidanceSub:   'If you cannot type or explain symptoms, visit your nearest Primary Health Centre (PHC).',
    scQuickPictorial:   'Quick Pictorial Symptom Picker (Tap Any Icon to Add)',
    scSearchPlaceholder: 'Search or speak symptoms...',
    scSelectedCount:    'SELECTED SYMPTOMS',
    scAnalyzeBtn:       'Analyze Symptoms',
    scAnalyzingBtn:     'Analyzing Symptoms...',
    scClearAll:         'Clear All Symptoms',
    scMinSymptomError:  'Please select or speak at least 3 symptoms for a meaningful clinical assessment.',
    scIcdCode:          'ICD-10 Code',
    scRecommendedDoc:   'RECOMMENDED SPECIALIST',
    scEmergencySigns:   'EMERGENCY WARNING SIGNS',
    scSeeProfile:       'View Disease Profile',
    scRuralSupport:     'Farmer & Rural Patient Health Assistance',
    scDictateBtn:       'Dictate Full Story (Voice)',
    scDictateListening: 'Listening...',
    scDictateTitle:     'Type or Dictate Your Full Health Story',
    scDictateSubtitle:  'Describe all your symptoms in detail — type or use voice to speak freely',
    scDictatePlaceholder: "Type or speak all your symptoms here in detail (e.g. 'I have high fever since 2 days, severe stomach pain after eating, and mild cough')...",
    scNewCheck:         'New Check',
    scAddMore:          'more to analyze',
    scReady:            'Ready for assessment!',
    scNoMatch:          'No symptoms match',
    scMatchConfidence:  'Match Confidence',

    // ── Body Regions (Symptom Checker) ──
    Head:    'Head',
    Chest:   'Chest',
    Abdomen: 'Abdomen',
    Limbs:   'Limbs',
    Skin:    'Skin',
    Eyes:    'Eyes',
    Throat:  'Throat',
    Back:    'Back',
    General: 'General',

    // ── Pictorial Symptoms ──
    picFever:    'High Fever',
    picHeadache: 'Headache',
    picCough:    'Cough / Cold',
    picVomit:    'Vomiting',
    picStomach:  'Stomach Pain',
    picBodypain: 'Body Pain',
    picRash:     'Skin Rash',
    picDiarrhea: 'Loose Motions',
  },

  te: {
    // ── Navigation ──
    navHome:    'ముఖ్యాంశాలు',
    navPharma:  'జెనెరిక్ మందులు',
    navDisease: 'వ్యాధుల వివరాలు',
    navSymptom: 'లక్షణాల తనిఖీ',
    navStores:  '24x7 మెడికల్ షాపులు',
    navBlood:   'రక్తనిధి లభ్యత',
    navOrgan:   'అవయవ దానం',
    navNews:    'ఆరోగ్య వార్తలు',
    navProfile: 'నా ప్రొఫైల్',
    navOcr:     'OCR మందుల స్కానర్',

    // ── Navbar UI labels ──
    selectLanguage:  'భాషను ఎంచుకోండి',
    allModules:      'అన్ని విభాగాలు',
    footerCredit:    'నెక్సామెడ్ ఆరోగ్య వేదిక · బహుభాషా',
    lightMode:       'లైట్ మోడ్',
    darkMode:        'డార్క్ మోడ్',

    // ── SOS / Audio ──
    sosBtn:    'అత్యవసర SOS',
    readPage:  'పేజీని వినండి (ఆడియో)',
    stopAudio: 'ఆడియో ఆపండి',

    // ── Helplines ──
    call104:   '104 ఉచిత డాక్టర్ హెల్ప్‌లైన్',
    call108:   '108 అంబులెన్స్‌కు కాల్ చేయండి',
    ashaTitle: 'ఆశా / గ్రామీణ ఆరోగ్య కార్యకర్త సలహా',
    ashaDesc:  'టైప్ చేయడం రాకపోతే 104 హెల్ప్‌లైన్‌కు కాల్ చేయండి లేదా దగ్గరలోని ప్రాథమిక ఆరోగ్య కేంద్రానికి వెళ్ళండి.',

    // ── Voice ──
    voiceSearch:    'మాట్లాడి వెతకండి (వాయిస్)',
    voiceListening: 'వింటోంది... మాట్లాడండి...',
    emergencyAlert: 'అత్యవసర SOS యాక్టివేట్ అయ్యింది',

    // ── Voice Assistant Widget ──
    voiceAssistantTitle: 'వాయిస్ అసిస్టెంట్',
    voiceAssistantHint:  '"పారాసిటమాల్ వెతకండి", "రక్తనిధి తెరవండి", "అత్యవసరం" అని చెప్పండి',
    voiceWelcome:        'నమస్కారం! నేను మీకు ఎలా సహాయపడగలను?',
    voiceNotSupported:   'వాయిస్ ఈ బ్రౌజర్‌లో పనిచేయదు. Chrome వాడండి.',
    voiceNoMatch:        'అర్థం కాలేదు. మళ్ళీ చెప్పండి.',
    voiceNavigating:     'తెరుస్తోంది',
    voiceSearching:      'వెతుకుతోంది',
    voiceDictateStory:   'మీ లక్షణాలు చెప్పండి, నేను సహాయపడతాను.',
    stopListening:       'ఆపండి',
    startListening:      'మాట్లాడండి',

    // ── Home Hero ──
    heroTitle:       'మీ సమగ్ర డిజిటల్ ఆరోగ్య సహాయక పోర్టల్',
    heroDesc:        'మందుల శోధన, వ్యాధుల సమాచారం, నోటితో మాట్లాడి లక్షణాల తనిఖీ, ఫార్మసీలు మరియు అత్యవసర SOS సౌకర్యం.',
    wellnessTipTitle: 'ఈనాటి ఆరోగ్య సూచన — ప్రథమ చికిత్స',
    wellnessTipText:  'తీవ్రమైన డెంగ్యూ జ్వరం ఉన్నప్పుడు ఐబుప్రోఫెన్ లేదా ఆస్పిరిన్ మందులు వాడకూడదు, ఇవి రక్తస్రావ ప్రమాదాన్ని పెంచుతాయి.',
    searchPlaceholder: 'మందు పేరు, వ్యాధి లేదా ఆసుపత్రి పేరు వెతకండి...',

    // ── Module Titles ──
    pharmaTitle:  'జెనెరిక్ మందులు మరియు ప్రత్యామ్నాయాలు',
    diseaseTitle: 'వ్యాధుల సమగ్ర సమాచార కోశం',
    storeTitle:   '24x7 మెడికల్ స్టోర్లు మరియు మ్యాప్',
    bloodTitle:   'రక్తనిధి లభ్యత మరియు బ్లడ్ బ్యాంకులు',
    organTitle:   'అవయవ దానం మరియు మార్పిడి కేంద్రాలు',
    newsTitle:    'ఆరోగ్య వార్తలు మరియు హెచ్చరికలు',
    profileTitle: 'రోగి ఆరోగ్య ప్రొఫైల్ మరియు రక్షణ',

    // ── Common Buttons ──
    savePercentage:      'జెనెరిక్ మందులపై 70% వరకు ఆదా చేయండి',
    searchBtn:           'వెతకండి',
    clearBtn:            'తొలగించు',
    detailsBtn:          'వివరాలు చూడండి',
    emergencyDisclaimer: 'ఇది తుది వైద్య సలహా కాదు. అర్హత కలిగిన డాక్టర్‌ను సంప్రదించండి.',

    // ── Footer ──
    footerDisclaimer:     'వైద్య & చట్టపరమైన నిరాకరణ: ',
    footerDisclaimerBody: 'నెక్సామెడ్‌లోని సమాచారం కేవలం అవగాహన కోసం. అత్యవసరంలో 108 కి కాల్ చేయండి.',
    emergencyHelplines:   'అత్యవసర & జాతీయ హెల్ప్‌లైన్లు',
    organBloodDonation:   'అవయవ & రక్త దానం',
    saveLives:            'జీవితాలను కాపాడండి — దానం చేయండి',
    donationText:         'స్వచ్ఛంద రక్త లేదా అవయవ దాతగా నమోదు చేయండి. ఒక దాత 8 జీవితాలను కాపాడగలరు.',
    nottoPortal:          'అధికారిక NOTTO పోర్టల్',
    footerRights:         '© నెక్సామెడ్ హెల్త్‌కేర్ పోర్టల్. అన్ని హక్కులు రిజర్వ్ చేయబడ్డాయి.',
    footerStack:          'React 19 · Node.js · SQLite · Leaflet తో నిర్మించబడింది',

    // ── Symptom Checker ──
    scTitle:          'ఇంటరాక్టివ్ క్లినికల్ లక్షణాల తనిఖీ',
    scSubtitle:       'శరీర భాగాల ద్వారా, మాట్లాడి (వాయిస్) లేదా చిత్రాలు నొక్కి లక్షణాలను ఎంచుకోండి',
    scStep1:          '1. శరీర భాగాన్ని ఎంచుకోండి',
    scStep2:          '2. లక్షణాలను నొక్కండి / మాట్లాడండి',
    scStep3:          '3. వైద్య విశ్లేషణ నివేదిక',
    scDisclaimerTitle: 'ఇది తుది వైద్య నిర్ధారణ కాదు: ',
    scDisclaimerText:  'ఈ పరికరం ప్రాథమిక అవగాహన కొరకు మాత్రమే. దయచేసి అర్హత కలిగిన డాక్టర్‌ను సంప్రదించండి.',
    scVoiceBtn:        'నోటితో మాట్లాడి చెప్పండి (వాయిస్ ఇన్పుట్)',
    scListeningMsg:    'వింటోంది... మీ లక్షణాలను స్పష్టంగా చెప్పండి (ఉదా: జ్వరం, తలనొప్పి, కడుపునొప్పి)',
    scListenResults:   'విశ్లేషణను వినండి (ఆడియో రీడౌట్)',
    scStopAudio:       'ఆడియో ఆపండి',
    scNeedHelpTitle:   'రాయడం కష్టంగా ఉందా? నేరుగా డాక్టర్ లేదా హెల్ప్‌లైన్‌తో మాట్లాడండి',
    scNeedHelpDesc:    '24 గంటల ఉచిత ప్రభుత్వ ఆరోగ్య సలహాలు (104), అత్యవసర అంబులెన్స్ (108) సేవలు అందుబాటులో ఉన్నాయి.',
    scHelpline104Title: 'ప్రభుత్వ ఉచిత ఆరోగ్య హెల్ప్‌లైన్ 104',
    scHelpline104Sub:   '24 గంటల ఉచిత డాక్టర్ సలహాలు మరియు మార్గదర్శకత్వం',
    scHelpline108Title: 'అత్యవసర అంబులెన్స్ 108',
    scHelpline108Sub:   'అత్యవసర వైద్య రవాణా మరియు చికిత్స',
    scCallDocBtn:       'హెల్ప్‌లైన్‌కు కాల్ చేయండి (104)',
    scAshaGuidanceTitle: 'ఆశా / ప్రాథమిక ఆరోగ్య కేంద్రం (PHC) సలహా',
    scAshaGuidanceSub:   'లక్షణాలు చెప్పడం రాకపోతే దగ్గరలోని ప్రాథమిక ఆరోగ్య కేంద్రానికి (PHC) వెళ్ళండి.',
    scQuickPictorial:   'చిత్రాల ద్వారా త్వరిత ఎంపిక (చిహ్నం నొక్కండి)',
    scSearchPlaceholder: 'లక్షణాన్ని టైప్ చేయండి లేదా మాట్లాడండి...',
    scSelectedCount:    'ఎంచుకున్న లక్షణాలు',
    scAnalyzeBtn:       'లక్షణాలను విశ్లేషించు',
    scAnalyzingBtn:     'విశ్లేషిస్తోంది...',
    scClearAll:         'అన్నీ తొలగించు',
    scMinSymptomError:  'ఖచ్చితమైన విశ్లేషణ కోసం కనీసం 3 లక్షణాలను ఎంచుకోండి లేదా మాట్లాడండి.',
    scIcdCode:          'ICD-10 కోడ్',
    scRecommendedDoc:   'సంప్రదించాల్సిన నిపుణుల డాక్టర్',
    scEmergencySigns:   'అత్యవసర ప్రమాద హెచ్చరిక లక్షణాలు',
    scSeeProfile:       'వ్యాధి సమాచారం చూడండి',
    scRuralSupport:     'రైతులు & గ్రామీణ ప్రజల ఆరోగ్య సహాయం',
    scDictateBtn:       'నోటితో చెప్పండి (వాయిస్)',
    scDictateListening: 'వింటోంది...',
    scDictateTitle:     'మీ ఆరోగ్య సమస్యను రాయండి లేదా చెప్పండి',
    scDictateSubtitle:  'మీ లక్షణాలన్నీ వివరంగా చెప్పండి — రాయవచ్చు లేదా మాట్లాడవచ్చు',
    scDictatePlaceholder: "మీ లక్షణాలను ఇక్కడ రాయండి (ఉదా: '2 రోజులుగా తీవ్రమైన జ్వరం, తినాక కడుపు నొప్పి, తేలికపాటి దగ్గు')...",
    scNewCheck:         'కొత్త తనిఖీ',
    scAddMore:          'మరిన్ని జోడించండి',
    scReady:            'విశ్లేషణకు సిద్ధం!',
    scNoMatch:          'మీ శోధనకు లక్షణాలు కనుగొనలేదు',
    scMatchConfidence:  'సరిపోలిక నమ్మకం',

    // ── Body Regions ──
    Head:    'తల',
    Chest:   'ఛాతీ',
    Abdomen: 'ఉదరం',
    Limbs:   'చేతులు & కాళ్ళు',
    Skin:    'చర్మం',
    Eyes:    'కళ్ళు',
    Throat:  'గొంతు',
    Back:    'వీపు',
    General: 'సాధారణ',

    // ── Pictorial Symptoms ──
    picFever:    'జ్వరం',
    picHeadache: 'తలనొప్పి',
    picCough:    'దగ్గు / జలుబు',
    picVomit:    'వాంతులు',
    picStomach:  'కడుపు నొప్పులు',
    picBodypain: 'ఒళ్ళు నొప్పులు',
    picRash:     'దద్దుర్లు',
    picDiarrhea: 'విరేచనాలు',
  },

  hi: {
    // ── Navigation ──
    navHome:    'मुख्य पृष्ठ',
    navPharma:  'जेनेरिक दवाएं',
    navDisease: 'बीमारी की जानकारी',
    navSymptom: 'लक्षण जांचकर्ता',
    navStores:  '24x7 मेडिकल स्टोर',
    navBlood:   'ब्लड बैंक उपलब्धता',
    navOrgan:   'अंगदान रजिस्ट्री',
    navNews:    'स्वास्थ्य समाचार',
    navProfile: 'मेरा प्रोफाइल',
    navOcr:     'OCR दवा स्कैनर',

    // ── Navbar UI labels ──
    selectLanguage:  'भाषा चुनें',
    allModules:      'सभी मॉड्यूल',
    footerCredit:    'नेक्सामेड हेल्थकेयर इंजन · बहुभाषी',
    lightMode:       'लाइट मोड',
    darkMode:        'डार्क मोड',

    // ── SOS / Audio ──
    sosBtn:    'आपातकालीन SOS',
    readPage:  'पेज बोलकर सुनें (ऑडियो)',
    stopAudio: 'ऑडियो बंद करें',

    // ── Helplines ──
    call104:   '104 मुफ्त डॉक्टर हेल्पलाइन',
    call108:   '108 एम्बुलेंस को कॉल करें',
    ashaTitle: 'आशा / ग्रामीण स्वास्थ्य कार्यकर्ता मार्गदर्शन',
    ashaDesc:  'यदि लिखना न आए तो 104 पर कॉल करें या निकटतम प्राथमिक स्वास्थ्य केंद्र (PHC) जाएं।',

    // ── Voice ──
    voiceSearch:    'बोलकर खोजें (वॉइस इनपुट)',
    voiceListening: 'सुन रहा है... बोलिए...',
    emergencyAlert: 'आपातकालीन SOS सक्रिय हुआ',

    // ── Voice Assistant Widget ──
    voiceAssistantTitle: 'वॉइस असिस्टेंट',
    voiceAssistantHint:  '"पैरासिटामोल खोजें", "ब्लड बैंक खोलें", "आपातकाल" बोलें',
    voiceWelcome:        'नमस्ते! मैं आपकी कैसे मदद कर सकता हूँ?',
    voiceNotSupported:   'वॉइस इस ब्राउज़र में काम नहीं करता। Chrome का उपयोग करें।',
    voiceNoMatch:        'समझ नहीं आया। कृपया दोबारा बोलें।',
    voiceNavigating:     'खोल रहा है',
    voiceSearching:      'खोज रहा है',
    voiceDictateStory:   'अपने लक्षण बताएं, मैं मदद करूंगा।',
    stopListening:       'रोकें',
    startListening:      'बोलें',

    // ── Home Hero ──
    heroTitle:       'आपका संपूर्ण डिजिटल स्वास्थ्य मंच',
    heroDesc:        'दवाएं खोजें, बीमारियों को समझें, बोलकर लक्षणों की जांच करें और आपातकालीन एम्बुलेंस पाएं।',
    wellnessTipTitle: 'आज का स्वास्थ्य सुझाव — प्राथमिक चिकित्सा',
    wellnessTipText:  'गंभीर डेंगू बुखार में कभी भी इबुप्रोफेन या एस्पिरिन न लें, यह रक्तस्राव के खतरे को बढ़ाती हैं।',
    searchPlaceholder: 'दवा का नाम, बीमारी या अस्पताल खोजें...',

    // ── Module Titles ──
    pharmaTitle:  'जेनेरिक दवाएं और विकल्प',
    diseaseTitle: 'रोग एवं लक्षण ज्ञानकोश',
    storeTitle:   '24x7 मेडिकल स्टोर और मानचित्र',
    bloodTitle:   'ब्लड बैंक उपलब्धता एवं डायरेक्टरी',
    organTitle:   'अंगदान एवं प्रत्यारोपण रजिस्ट्री',
    newsTitle:    'स्वास्थ्य बुलेटिन और WHO समाचार',
    profileTitle: 'मरीज का स्वास्थ्य प्रोफाइल एवं सुरक्षा',

    // ── Common Buttons ──
    savePercentage:      'जेनेरिक दवाओं पर 70% तक बचाएं',
    searchBtn:           'खोजें',
    clearBtn:            'हटाएं',
    detailsBtn:          'विवरण देखें',
    emergencyDisclaimer: 'यह अंतिम डॉक्टरी सलाह नहीं है। हमेशा डॉक्टर से संपर्क करें।',

    // ── Footer ──
    footerDisclaimer:     'चिकित्सा एवं कानूनी अस्वीकरण: ',
    footerDisclaimerBody: 'नेक्सामेड पर उपलब्ध सामग्री केवल शैक्षणिक उद्देश्यों के लिए है। आपातकाल में 108 पर कॉल करें।',
    emergencyHelplines:   'आपातकालीन एवं राष्ट्रीय हेल्पलाइन',
    organBloodDonation:   'अंगदान एवं रक्तदान',
    saveLives:            'जीवन बचाएं — दान करें',
    donationText:         'स्वैच्छिक रक्त या अंग दाता के रूप में पंजीकरण करें। एक दाता 8 जीवन बचा सकता है।',
    nottoPortal:          'आधिकारिक NOTTO पोर्टल',
    footerRights:         '© नेक्सामेड हेल्थकेयर पोर्टल। सर्वाधिकार सुरक्षित।',
    footerStack:          'React 19 · Node.js · SQLite · Leaflet के साथ बनाया गया',

    // ── Symptom Checker ──
    scTitle:          'इंटरएक्टिव क्लिनिकल लक्षण जांचकर्ता',
    scSubtitle:       'शरीर के अंगों, बोलकर (वॉइस) या चित्रों द्वारा अपने लक्षणों का चयन करें',
    scStep1:          '1. शरीर का अंग चुनें',
    scStep2:          '2. लक्षण चुनें या बोलें',
    scStep3:          '3. स्वास्थ्य जांच रिपोर्ट',
    scDisclaimerTitle: 'यह अंतिम डॉक्टरी सलाह नहीं है: ',
    scDisclaimerText:  'यह उपकरण केवल प्राथमिक जानकारी प्रदान करता है। कृपया डॉक्टर से संपर्क करें।',
    scVoiceBtn:        'बोलकर लक्षण बताएं (वॉइस इनपुट)',
    scListeningMsg:    'सुन रहा है... अपने लक्षण साफ बोलें (जैसे: बुखार, सिरदर्द, पेट दर्द)',
    scListenResults:   'रिपोर्ट बोलकर सुनें (ऑडियो रीडाउट)',
    scStopAudio:       'ऑडियो बंद करें',
    scNeedHelpTitle:   'लिखने में कठिनाई? सीधे डॉक्टर या स्वास्थ्य कार्यकर्ता से बात करें',
    scNeedHelpDesc:    'मुफ्त 24x7 सरकारी स्वास्थ्य सलाह (104) व आपातकालीन एम्बुलेंस (108) सेवा प्राप्त करें।',
    scHelpline104Title: 'सरकारी स्वास्थ्य हेल्पलाइन 104',
    scHelpline104Sub:   '24x7 मुफ्त डॉक्टर सलाह और स्वास्थ्य मार्गदर्शन',
    scHelpline108Title: 'आपातकालीन एम्बुलेंस 108',
    scHelpline108Sub:   'तत्काल आपातकालीन चिकित्सा वाहन सुविधा',
    scCallDocBtn:       'हेल्पलाइन 104 पर कॉल करें',
    scAshaGuidanceTitle: 'आशा / प्राथमिक स्वास्थ्य केंद्र (PHC) सहायता',
    scAshaGuidanceSub:   'यदि लक्षण स्पष्ट न हों तो निकटतम प्राथमिक स्वास्थ्य केंद्र जाएं।',
    scQuickPictorial:   'चित्रों द्वारा त्वरित चुनाव (आइकन दबाएं)',
    scSearchPlaceholder: 'लक्षण खोजें या बोलें...',
    scSelectedCount:    'चुने गए लक्षण',
    scAnalyzeBtn:       'लक्षणों की जांच करें',
    scAnalyzingBtn:     'जांच जारी है...',
    scClearAll:         'सभी हटाएं',
    scMinSymptomError:  'सटीक रिपोर्ट के लिए कम से कम 3 लक्षण चुनें या बोलें।',
    scIcdCode:          'ICD-10 कोड',
    scRecommendedDoc:   'अनुशंसित विशेषज्ञ डॉक्टर',
    scEmergencySigns:   'आपातकालीन चेतावनी के संकेत',
    scSeeProfile:       'बीमारी की पूरी जानकारी देखें',
    scRuralSupport:     'किसान व ग्रामीण नागरिकों हेतु विशेष सहायता',
    scDictateBtn:       'आवाज़ से बोलें (वॉइस)',
    scDictateListening: 'सुन रहा है...',
    scDictateTitle:     'अपनी पूरी स्वास्थ्य कहानी लिखें या बोलें',
    scDictateSubtitle:  'अपने सभी लक्षणों को विस्तार से बताएं — लिखें या आवाज़ से बोलें',
    scDictatePlaceholder: "यहाँ अपने लक्षण लिखें (जैसे: '2 दिनों से तेज़ बुखार, खाने के बाद पेट दर्द, हल्की खांसी')...",
    scNewCheck:         'नई जांच',
    scAddMore:          'और जोड़ें',
    scReady:            'विश्लेषण के लिए तैयार!',
    scNoMatch:          'कोई लक्षण नहीं मिला',
    scMatchConfidence:  'मिलान विश्वास',

    // ── Body Regions ──
    Head:    'सिर',
    Chest:   'सीना',
    Abdomen: 'पेट',
    Limbs:   'हाथ-पैर',
    Skin:    'त्वचा',
    Eyes:    'आँखें',
    Throat:  'गला',
    Back:    'पीठ',
    General: 'सामान्य',

    // ── Pictorial Symptoms ──
    picFever:    'तेज़ बुखार',
    picHeadache: 'सिरदर्द',
    picCough:    'खांसी / जुकाम',
    picVomit:    'उल्टी',
    picStomach:  'पेट दर्द',
    picBodypain: 'शरीर दर्द',
    picRash:     'त्वचा चकत्ते',
    picDiarrhea: 'दस्त',
  },

  ta: {
    // ── Navigation ──
    navHome:    'முகப்பு',
    navPharma:  'ஜெனரிக் மருந்துகள்',
    navDisease: 'நோய் விவரங்கள்',
    navSymptom: 'அறிகுறி சரிபார்ப்பு',
    navStores:  '24x7 மருந்தகங்கள்',
    navBlood:   'இரத்த வங்கி',
    navOrgan:   'உறுப்பு தானம்',
    navNews:    'சுகாதார செய்திகள்',
    navProfile: 'என் சுயவிவரம்',
    navOcr:     'OCR மருந்து ஸ்கேனர்',

    // ── Navbar UI labels ──
    selectLanguage:  'மொழியைத் தேர்ந்தெடுக்கவும்',
    allModules:      'அனைத்து பிரிவுகளும்',
    footerCredit:    'நெக்சாமெட் சுகாதார தளம் · பன்மொழி',
    lightMode:       'ஒளி பயன்முறை',
    darkMode:        'இருள் பயன்முறை',

    // ── SOS / Audio ──
    sosBtn:    'அவசர SOS',
    readPage:  'பக்கத்தைக் கேட்கவும் (ஒலி)',
    stopAudio: 'ஒலியை நிறுத்தவும்',

    // ── Helplines ──
    call104:   '104 அரசு சுகாதார உதவி எண்',
    call108:   '108 ஆம்புலன்ஸ் சேவை',
    ashaTitle: 'ஆஷா / கிராமப்புற சுகாதார வழிகாட்டுதல்',
    ashaDesc:  'டைப் செய்ய இயலாவிட்டால் 104-ஐ அழைக்கவும் அல்லது ஆரம்ப சுகாதார நிலையத்திற்குச் செல்லவும்.',

    // ── Voice ──
    voiceSearch:    'பேசித் தேடவும் (குரல் பதிவு)',
    voiceListening: 'கேட்கிறது... பேசுங்கள்...',
    emergencyAlert: 'அவசர SOS செயல்படுத்தப்பட்டது',

    // ── Voice Assistant Widget ──
    voiceAssistantTitle: 'குரல் உதவியாளர்',
    voiceAssistantHint:  '"பாரசிட்டமால் தேடு", "இரத்த வங்கி திற", "அவசரம்" என்று சொல்லுங்கள்',
    voiceWelcome:        'வணக்கம்! நான் உங்களுக்கு எப்படி உதவலாம்?',
    voiceNotSupported:   'குரல் இந்த உலாவியில் ஆதரிக்கப்படவில்லை. Chrome பயன்படுத்தவும்.',
    voiceNoMatch:        'புரியவில்லை. மீண்டும் முயற்சிக்கவும்.',
    voiceNavigating:     'திறக்கிறது',
    voiceSearching:      'தேடுகிறது',
    voiceDictateStory:   'உங்கள் அறிகுறிகளைக் கூறுங்கள், நான் உதவுகிறேன்.',
    stopListening:       'நிறுத்து',
    startListening:      'பேசுங்கள்',

    // ── Home Hero ──
    heroTitle:       'உங்கள் முழுமையான டிஜிட்டல் சுகாதார தளம்',
    heroDesc:        'மருந்துகளைத் தேடவும், நோய்களைப் பற்றி அறியவும், குரல் மூலம் அறிகுறிகளைச் சரிபார்க்கவும்.',
    wellnessTipTitle: 'இன்றைய சுகாதாரக் குறிப்பு — முதலுதவி',
    wellnessTipText:  'டெங்கு காய்ச்சலின் போது இப்யூபுரூஃபென் அல்லது ஆஸ்பிரின் மருந்துகளை உட்கொள்ள வேண்டாம்.',
    searchPlaceholder: 'மருந்து, நோய் அல்லது மருத்துவமனையைத் தேடவும்...',

    // ── Module Titles ──
    pharmaTitle:  'ஜெனரிக் மருந்துகள் மற்றும் மாற்று மருந்துகள்',
    diseaseTitle: 'நோய்கள் பற்றிய விபரங்கள்',
    storeTitle:   '24x7 மருந்தகங்கள் மற்றும் வரைபடம்',
    bloodTitle:   'இரத்த வங்கி இருப்பு விபரம்',
    organTitle:   'உறுப்பு தான பதிவு மையம்',
    newsTitle:    'சுகாதார செய்திகள் மற்றும் அறிவிப்புகள்',
    profileTitle: 'நோயாளி சுயவிவரம்',

    // ── Common Buttons ──
    savePercentage:      'ஜெனரிக் மருந்துகளில் 70% வரை சேமிக்கவும்',
    searchBtn:           'தேடுக',
    clearBtn:            'நீக்கு',
    detailsBtn:          'விவரங்களைப் பார்க்க',
    emergencyDisclaimer: 'இது இறுதி மருத்துவ சிகிச்சை அல்ல. மருத்துவரை அணுகவும்.',

    // ── Footer ──
    footerDisclaimer:     'மருத்துவ & சட்ட மறுப்பு: ',
    footerDisclaimerBody: 'நெக்சாமெட்டில் உள்ள தகவல்கள் கல்வி நோக்கங்களுக்கு மட்டுமே. அவசரத்தில் 108 ஐ அழைக்கவும்.',
    emergencyHelplines:   'அவசர & தேசிய உதவி எண்கள்',
    organBloodDonation:   'உறுப்பு & இரத்த தானம்',
    saveLives:            'உயிர்களைக் காப்பாற்றுங்கள் — தானம் செய்யுங்கள்',
    donationText:         'தன்னார்வ இரத்த அல்லது உறுப்பு தாதாவாக பதிவு செய்யுங்கள். ஒரு தாதா 8 உயிர்களை காப்பாற்றலாம்.',
    nottoPortal:          'அதிகாரப்பூர்வ NOTTO போர்டல்',
    footerRights:         '© நெக்சாமெட் சுகாதார போர்டல். அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.',
    footerStack:          'React 19 · Node.js · SQLite · Leaflet மூலம் உருவாக்கப்பட்டது',

    // ── Symptom Checker ──
    scTitle:          'அறிகுறி சரிபார்ப்பு',
    scSubtitle:       'உறுப்புகள், குரல் அல்லது படங்கள் மூலம் அறிகுறிகளைத் தேர்ந்தெடுக்கவும்',
    scStep1:          '1. உடல் உறுப்பைத் தேர்ந்தெடுக்கவும்',
    scStep2:          '2. அறிகுறிகளைத் தட்டவும் / பேசவும்',
    scStep3:          '3. மருத்துவ அறிக்கை',
    scDisclaimerTitle: 'இது இறுதி மருத்துவ சிகிச்சை அல்ல: ',
    scDisclaimerText:  'இது தகவல் நோக்கத்திற்காக மட்டுமே. தகுதியான மருத்துவரை அணுகவும்.',
    scVoiceBtn:        'பேசி அறிகுறிகளைக் கூறவும் (குரல் பதிவு)',
    scListeningMsg:    'கேட்கிறது... உங்கள் அறிகுறிகளைக் கூறுங்கள் (எ.கா: காய்ச்சல், தலைவலி, வயிற்று வலி)',
    scListenResults:   'முடிவுகளைக் கேட்கவும் (ஆடியோ)',
    scStopAudio:       'ஒலியை நிறுத்தவும்',
    scNeedHelpTitle:   'டைப் செய்ய கடினமாக உள்ளதா? மருத்துவரிடம் பேசவும்',
    scNeedHelpDesc:    '24x7 அரசு சுகாதார உதவி எண் (104) மற்றும் ஆம்புலன்ஸ் (108) சேவைகள் உள்ளன.',
    scHelpline104Title: 'அரசு இலவச சுகாதார உதவி எண் 104',
    scHelpline104Sub:   '24x7 இலவச மருத்துவர் ஆலோசனை',
    scHelpline108Title: 'அவசர ஆம்புலன்ஸ் 108',
    scHelpline108Sub:   'உடனடி அவசர மருத்துவ சேவை',
    scCallDocBtn:       'உதவி எண் 104-ஐ அழைக்கவும்',
    scAshaGuidanceTitle: 'ஆஷா / ஆரம்ப சுகாதார நிலைய (PHC) வழிகாட்டுதல்',
    scAshaGuidanceSub:   'அருகிலுள்ள ஆரம்ப சுகாதார நிலையத்தை அணுகவும்.',
    scQuickPictorial:   'படங்கள் மூலம் விரைவுத் தேர்வு',
    scSearchPlaceholder: 'தேடவும் அல்லது பேசவும்...',
    scSelectedCount:    'தேர்ந்தெடுக்கப்பட்ட அறிகுறிகள்',
    scAnalyzeBtn:       'அறிகுறிகளை ஆய்வு செய்',
    scAnalyzingBtn:     'ஆய்வு செய்யப்படுகிறது...',
    scClearAll:         'அனைத்தையும் நீக்கு',
    scMinSymptomError:  'துல்லியமான ஆய்வுக்கு குறைந்தபட்சம் 3 அறிகுறிகளைத் தேர்ந்தெடுக்கவும்.',
    scIcdCode:          'ICD-10 குறியீடு',
    scRecommendedDoc:   'பரிந்துரைக்கப்பட்ட சிறப்பு மருத்துவர்',
    scEmergencySigns:   'அவசர எச்சரிக்கை அறிகுறிகள்',
    scSeeProfile:       'நோய் விபரங்களைப் பார்க்கவும்',
    scRuralSupport:     'விவசாயிகள் மற்றும் கிராமப்புற மக்களுக்கு உதவி',
    scDictateBtn:       'குரலில் பேசுங்கள்',
    scDictateListening: 'கேட்கிறது...',
    scDictateTitle:     'உங்கள் சுகாதார கதையை எழுதுங்கள் அல்லது பேசுங்கள்',
    scDictateSubtitle:  'உங்கள் அனைத்து அறிகுறிகளையும் விரிவாக கூறுங்கள்',
    scDictatePlaceholder: "உங்கள் அறிகுறிகளை இங்கே எழுதுங்கள்...",
    scNewCheck:         'புதிய சரிபார்ப்பு',
    scAddMore:          'மேலும் சேர்க்கவும்',
    scReady:            'ஆய்வுக்கு தயார்!',
    scNoMatch:          'அறிகுறிகள் கிடைக்கவில்லை',
    scMatchConfidence:  'பொருத்தம் நம்பகத்தன்மை',

    // ── Body Regions ──
    Head:    'தலை',
    Chest:   'மார்பு',
    Abdomen: 'வயிறு',
    Limbs:   'கைகால்கள்',
    Skin:    'தோல்',
    Eyes:    'கண்கள்',
    Throat:  'தொண்டை',
    Back:    'முதுகு',
    General: 'பொதுவான',

    // ── Pictorial Symptoms ──
    picFever:    'காய்ச்சல்',
    picHeadache: 'தலைவலி',
    picCough:    'இருமல்',
    picVomit:    'வாந்தி',
    picStomach:  'வயிற்று வலி',
    picBodypain: 'உடல் வலி',
    picRash:     'தோல் தடிப்பு',
    picDiarrhea: 'வயிற்றுப்போக்கு',
  },

  kn: {
    // ── Navigation ──
    navHome:    'ಮುಖಪುಟ',
    navPharma:  'ಜೆನೆರಿಕ್ ಔಷಧಿಗಳು',
    navDisease: 'ರೋಗದ ವಿವರಗಳು',
    navSymptom: 'ರೋಗಲಕ್ಷಣ ಪರೀಕ್ಷಕ',
    navStores:  '24x7 ಔಷಧಾಲಯಗಳು',
    navBlood:   'ರಕ್ತ ನಿಧಿ ಲಭ್ಯತೆ',
    navOrgan:   'ಅಂಗದಾನ ನೋಂದಣಿ',
    navNews:    'ಆರೋಗ್ಯ ಸುದ್ದಿಗಳು',
    navProfile: 'ನನ್ನ ಪ್ರೊಫೈಲ್',
    navOcr:     'OCR ಔಷಧ ಸ್ಕ್ಯಾನರ್',

    // ── Navbar UI labels ──
    selectLanguage:  'ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ',
    allModules:      'ಎಲ್ಲ ವಿಭಾಗಗಳು',
    footerCredit:    'ನೆಕ್ಸಾಮೆಡ್ ಆರೋಗ್ಯ ತಂತ್ರಾಂಶ · ಬಹುಭಾಷಾ',
    lightMode:       'ಬೆಳಕಿನ ಮೋಡ್',
    darkMode:        'ಡಾರ್ಕ್ ಮೋಡ್',

    // ── SOS / Audio ──
    sosBtn:    'ತುರ್ತು SOS',
    readPage:  'ಪುಟವನ್ನು ಆಲಿಸಿ (ಆಡಿಯೋ)',
    stopAudio: 'ಆಡಿಯೋ ನಿಲ್ಲಿಸಿ',

    // ── Helplines ──
    call104:   '104 ಸರ್ಕಾರಿ ವೈದ್ಯಕೀಯ ಸಹಾಯವಾಣಿ',
    call108:   '108 ಅಂಬ್ಯುಲೆನ್ಸ್ ಕರೆ ಮಾಡಿ',
    ashaTitle: 'ಆಶಾ / ಗ್ರಾಮೀಣ ಆರೋಗ್ಯ ಸಿಬ್ಬಂದಿ ಮಾರ್ಗದರ್ಶನ',
    ashaDesc:  'ಬರೆಯಲು ಬರದಿದ್ದರೆ 104 ಗೆ ಕರೆ ಮಾಡಿ ಅಥವಾ ಹತ್ತಿರದ ಪ್ರಾಥಮಿಕ ಆರೋಗ್ಯ ಕೇಂದ್ರಕ್ಕೆ ಭೇಟಿ ನೀಡಿ.',

    // ── Voice ──
    voiceSearch:    'ಮಾತನಾಡಿ ಹುಡುಕಿ (ವಾಯ್ಸ್)',
    voiceListening: 'ಆಲಿಸುತ್ತಿದೆ... ಮಾತನಾಡಿ...',
    emergencyAlert: 'ತುರ್ತು SOS ಸಕ್ರಿಯಗೊಳಿಸಲಾಗಿದೆ',

    // ── Voice Assistant Widget ──
    voiceAssistantTitle: 'ವಾಯ್ಸ್ ಅಸಿಸ್ಟೆಂಟ್',
    voiceAssistantHint:  '"ಪ್ಯಾರಾಸಿಟಮಾಲ್ ಹುಡುಕಿ", "ರಕ್ತ ಬ್ಯಾಂಕ್ ತೆರೆಯಿರಿ", "ತುರ್ತು" ಎಂದು ಹೇಳಿ',
    voiceWelcome:        'ನಮಸ್ಕಾರ! ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?',
    voiceNotSupported:   'ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ವಾಯ್ಸ್ ಕೆಲಸ ಮಾಡುವುದಿಲ್ಲ. Chrome ಬಳಸಿ.',
    voiceNoMatch:        'ಅರ್ಥವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
    voiceNavigating:     'ತೆರೆಯಲಾಗುತ್ತಿದೆ',
    voiceSearching:      'ಹುಡುಕಲಾಗುತ್ತಿದೆ',
    voiceDictateStory:   'ನಿಮ್ಮ ರೋಗಲಕ್ಷಣಗಳನ್ನು ಹೇಳಿ, ನಾನು ಸಹಾಯ ಮಾಡುತ್ತೇನೆ.',
    stopListening:       'ನಿಲ್ಲಿಸಿ',
    startListening:      'ಮಾತನಾಡಿ',

    // ── Home Hero ──
    heroTitle:       'ನಿಮ್ಮ ಸಂಪೂರ್ಣ ಡಿಜಿಟಲ್ ಆರೋಗ್ಯ ವೇದಿಕೆ',
    heroDesc:        'ಔಷಧಿಗಳನ್ನು ಹುಡುಕಿ, ರೋಗಗಳನ್ನು ತಿಳಿಯಿರಿ, ಧ್ವನಿ ಮೂಲಕ ರೋಗಲಕ್ಷಣಗಳನ್ನು ಪರೀಕ್ಷಿಸಿ.',
    wellnessTipTitle: 'ಇಂದಿನ ಆರೋಗ್ಯ ಸುಳಿವು — ಪ್ರಥಮ ಚಿಕಿತ್ಸೆ',
    wellnessTipText:  'ಡೆಂಗ್ಯೂ ಜ್ವರದ ಸಮಯದಲ್ಲಿ ಐಬುಪ್ರೊಫೆನ್ ಅಥವಾ ಆಸ್ಪಿರಿನ್ ಔಷಧಗಳನ್ನು ಸೇವಿಸಬೇಡಿ.',
    searchPlaceholder: 'ಔಷಧಿ, ರೋಗ ಅಥವಾ ಆಸ್ಪತ್ರೆ ಹುಡುಕಿ...',

    // ── Module Titles ──
    pharmaTitle:  'ಜೆನೆರಿಕ್ ಔಷಧಿಗಳು ಮತ್ತು ಪರ್ಯಾಯಗಳು',
    diseaseTitle: 'ರೋಗಗಳ ಸಮಗ್ರ ಮಾಹಿತಿ',
    storeTitle:   '24x7 ಔಷಧಾಲಯಗಳು ಮತ್ತು ನಕ್ಷೆ',
    bloodTitle:   'ರಕ್ತ ನಿಧಿ ಲಭ್ಯತೆ ಮತ್ತು ಬ್ಯಾಂಕ್‌ಗಳು',
    organTitle:   'ಅಂಗದಾನ ಮತ್ತು ಕಸಿ ನೋಂದಣಿ',
    newsTitle:    'ಆರೋಗ್ಯ ಸುದ್ದಿಗಳು ಮತ್ತು ಎಚ್ಚರಿಕೆಗಳು',
    profileTitle: 'ರೋಗಿಯ ಆರೋಗ್ಯ ಪ್ರೊಫೈಲ್',

    // ── Common Buttons ──
    savePercentage:      'ಜೆನೆರಿಕ್ ಔಷಧಿಗಳಲ್ಲಿ 70% ವರೆಗೆ ಉಳಿಸಿ',
    searchBtn:           'ಹುಡುಕಿ',
    clearBtn:            'ಅಳಿಸಿ',
    detailsBtn:          'ವಿವರ ನೋಡಿ',
    emergencyDisclaimer: 'ಇದು ಅಂತಿಮ ವೈದ್ಯಕೀಯ ಸಲಹೆಯಲ್ಲ. ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ.',

    // ── Footer ──
    footerDisclaimer:     'ವೈದ್ಯಕೀಯ & ಕಾನೂನು ಹಕ್ಕು ನಿರಾಕರಣೆ: ',
    footerDisclaimerBody: 'ನೆಕ್ಸಾಮೆಡ್‌ನಲ್ಲಿನ ಮಾಹಿತಿ ಕೇವಲ ಶಿಕ್ಷಣ ಉದ್ದೇಶಗಳಿಗಾಗಿ. ತುರ್ತುಗಾಗಿ 108 ಗೆ ಕರೆ ಮಾಡಿ.',
    emergencyHelplines:   'ತುರ್ತು & ರಾಷ್ಟ್ರೀಯ ಸಹಾಯವಾಣಿಗಳು',
    organBloodDonation:   'ಅಂಗದಾನ & ರಕ್ತದಾನ',
    saveLives:            'ಜೀವ ಉಳಿಸಿ — ದಾನ ಮಾಡಿ',
    donationText:         'ಸ್ವಯಂ ರಕ್ತ ಅಥವಾ ಅಂಗ ದಾನಿಯಾಗಿ ನೋಂದಾಯಿಸಿ. ಒಬ್ಬ ದಾನಿ 8 ಜೀವಗಳನ್ನು ಉಳಿಸಬಹುದು.',
    nottoPortal:          'ಅಧಿಕೃತ NOTTO ಪೋರ್ಟಲ್',
    footerRights:         '© ನೆಕ್ಸಾಮೆಡ್ ಆರೋಗ್ಯ ಪೋರ್ಟಲ್. ಎಲ್ಲ ಹಕ್ಕುಗಳು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.',
    footerStack:          'React 19 · Node.js · SQLite · Leaflet ಮೂಲಕ ನಿರ್ಮಿಸಲಾಗಿದೆ',

    // ── Symptom Checker ──
    scTitle:          'ಇಂಟರಾಕ್ಟಿವ್ ರೋಗಲಕ್ಷಣ ಪರೀಕ್ಷಕ',
    scSubtitle:       'ದೇಹದ ಭಾಗಗಳು, ಧ್ವನಿ ಅಥವಾ ಚಿತ್ರಗಳ ಮೂಲಕ ರೋಗಲಕ್ಷಣಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    scStep1:          '1. ದೇಹದ ಭಾಗ ಆಯ್ಕೆಮಾಡಿ',
    scStep2:          '2. ರೋಗಲಕ್ಷಣ ಒತ್ತಿ / ಮಾತನಾಡಿ',
    scStep3:          '3. ವೈದ್ಯಕೀಯ ಪರೀಕ್ಷಾ ವರದಿ',
    scDisclaimerTitle: 'ಇದು ಅಂತಿಮ ವೈದ್ಯಕೀಯ ಚಿಕಿತ್ಸೆಯಲ್ಲ: ',
    scDisclaimerText:  'ಇದು ಕೇವಲ ಸೂಚನಾ ಮಾಹಿತಿಯಾಗಿದೆ. ಅರ್ಹ ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ.',
    scVoiceBtn:        'ಮಾತನಾಡಿ ರೋಗಲಕ್ಷಣ ತಿಳಿಸಿ (ವಾಯ್ಸ್)',
    scListeningMsg:    'ಆಲಿಸುತ್ತಿದೆ... ರೋಗಲಕ್ಷಣಗಳನ್ನು ಸ್ಪಷ್ಟವಾಗಿ ಹೇಳಿ (ಉದಾ: ಜ್ವರ, ತಲೆನೋವು, ಹೊಟ್ಟೆನೋವು)',
    scListenResults:   'ವರದಿಯನ್ನು ಆಲಿಸಿ (ಆಡಿಯೋ)',
    scStopAudio:       'ಆಡಿಯೋ ನಿಲ್ಲಿಸಿ',
    scNeedHelpTitle:   'ಬರೆಯಲು ಕಷ್ಟವೇ? ನೇರವಾಗಿ ವೈದ್ಯರೊಂದಿಗೆ ಮಾತನಾಡಿ',
    scNeedHelpDesc:    '24x7 ಉಚಿತ ಸರ್ಕಾರಿ ವೈದ್ಯಕೀಯ ಸಲಹೆ (104) ಮತ್ತು ತುರ್ತು ಅಂಬ್ಯುಲೆನ್ಸ್ (108) ಲಭ್ಯವಿದೆ.',
    scHelpline104Title: 'ಸರ್ಕಾರಿ ಉಚಿತ ಆರೋಗ್ಯ ಸಹಾಯವಾಣಿ 104',
    scHelpline104Sub:   '24x7 ಉಚಿತ ವೈದ್ಯಕೀಯ ಸಲಹೆ ಮತ್ತು ಮಾರ್ಗದರ್ಶನ',
    scHelpline108Title: 'ತುರ್ತು ಅಂಬ್ಯುಲೆನ್ಸ್ 108',
    scHelpline108Sub:   'ತಕ್ಷಣದ ತುರ್ತು ವೈದ್ಯಕೀಯ ಸಾರಿಗೆ',
    scCallDocBtn:       'ಸಹಾಯವಾಣಿ 104 ಗೆ ಕರೆ ಮಾಡಿ',
    scAshaGuidanceTitle: 'ಆಶಾ / ಪ್ರಾಥಮಿಕ ಆರೋಗ್ಯ ಕೇಂದ್ರ (PHC) ಮಾರ್ಗದರ್ಶನ',
    scAshaGuidanceSub:   'ಹತ್ತಿರದ ಪ್ರಾಥಮಿಕ ಆರೋಗ್ಯ ಕೇಂದ್ರಕ್ಕೆ ಭೇಟಿ ನೀಡಿ.',
    scQuickPictorial:   'ಚಿತ್ರಗಳ ಮೂಲಕ ಆಯ್ಕೆ (Quick Icons)',
    scSearchPlaceholder: 'ಹುಡುಕಿ ಅಥವಾ ಮಾತನಾಡಿ...',
    scSelectedCount:    'ಆಯ್ಕೆಮಾಡಿದ ರೋಗಲಕ್ಷಣಗಳು',
    scAnalyzeBtn:       'ರೋಗಲಕ್ಷಣಗಳನ್ನು ವಿಶ್ಲೇಷಿಸಿ',
    scAnalyzingBtn:     'ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...',
    scClearAll:         'ಎಲ್ಲವನ್ನೂ ಅಳಿಸಿ',
    scMinSymptomError:  'ನಿಖರ ವರದಿಗಾಗಿ ಕನಿಷ್ಠ 3 ರೋಗಲಕ್ಷಣಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
    scIcdCode:          'ICD-10 ಕೋಡ್',
    scRecommendedDoc:   'ಸೂಚಿಸಿದ ತಜ್ಞ ವೈದ್ಯರು',
    scEmergencySigns:   'ತುರ್ತು ಎಚ್ಚರಿಕೆಯ ಚಿಹ್ನೆಗಳು',
    scSeeProfile:       'ರೋಗದ ವಿವರ ನೋಡಿ',
    scRuralSupport:     'ರೈತರು ಮತ್ತು ಗ್ರಾಮೀಣ ಜನರಿಗೆ ವೈದ್ಯಕೀಯ ನೆರವು',
    scDictateBtn:       'ಧ್ವನಿಯಲ್ಲಿ ಹೇಳಿ (ವಾಯ್ಸ್)',
    scDictateListening: 'ಆಲಿಸುತ್ತಿದೆ...',
    scDictateTitle:     'ನಿಮ್ಮ ಆರೋಗ್ಯ ಕಥೆಯನ್ನು ಬರೆಯಿರಿ ಅಥವಾ ಹೇಳಿ',
    scDictateSubtitle:  'ನಿಮ್ಮ ಎಲ್ಲ ರೋಗಲಕ್ಷಣಗಳನ್ನು ವಿವರವಾಗಿ ಹೇಳಿ',
    scDictatePlaceholder: "ನಿಮ್ಮ ರೋಗಲಕ್ಷಣಗಳನ್ನು ಇಲ್ಲಿ ಬರೆಯಿರಿ...",
    scNewCheck:         'ಹೊಸ ಪರೀಕ್ಷೆ',
    scAddMore:          'ಇನ್ನಷ್ಟು ಸೇರಿಸಿ',
    scReady:            'ವಿಶ್ಲೇಷಣೆಗೆ ಸಿದ್ಧ!',
    scNoMatch:          'ರೋಗಲಕ್ಷಣ ಕಂಡುಬಂದಿಲ್ಲ',
    scMatchConfidence:  'ಹೊಂದಾಣಿಕೆ ವಿಶ್ವಾಸ',

    // ── Body Regions ──
    Head:    'ತಲೆ',
    Chest:   'ಎದೆ',
    Abdomen: 'ಹೊಟ್ಟೆ',
    Limbs:   'ಕೈ-ಕಾಲುಗಳು',
    Skin:    'ಚರ್ಮ',
    Eyes:    'ಕಣ್ಣುಗಳು',
    Throat:  'ಗಂಟಲು',
    Back:    'ಬೆನ್ನು',
    General: 'ಸಾಮಾನ್ಯ',

    // ── Pictorial Symptoms ──
    picFever:    'ಜ್ವರ',
    picHeadache: 'ತಲೆನೋವು',
    picCough:    'ಕೆಮ್ಮು',
    picVomit:    'ವಾಂತಿ',
    picStomach:  'ಹೊಟ್ಟೆ ನೋವು',
    picBodypain: 'ಮೈಕೈ ನೋವು',
    picRash:     'ಚರ್ಮದ ದದ್ದು',
    picDiarrhea: 'ಬೇಧಿ',
  },
};

// Lang code → Web Speech API BCP-47 code
export const LANG_SPEECH_CODE = {
  en: 'en-US',
  te: 'te-IN',
  hi: 'hi-IN',
  ta: 'ta-IN',
  kn: 'kn-IN',
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => localStorage.getItem('nexamed_lang') || 'en');
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    localStorage.setItem('nexamed_lang', language);
  }, [language]);

  const changeLanguage = (code) => {
    setLanguage(code);
    stopAudio();
  };

  // Central translation function — single source of truth
  const t = (key) => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS.en;
    return langDict[key] || TRANSLATIONS.en[key] || key;
  };

  const speakAudio = (text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = LANG_SPEECH_CODE[language] || 'en-US';
    utterance.rate = 0.88;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend   = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const stopAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t, LANGUAGES, speakAudio, stopAudio, isSpeaking, LANG_SPEECH_CODE }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
