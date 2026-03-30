/**
 * Translation strings for Marathi (mr), Hindi (hi), English (en)
 * Usage: t('key', lang)
 */
const translations = {
    // Onboarding
    selectLanguage:   { mr: 'भाषा निवडा', hi: 'भाषा चुनें', en: 'Select Language' },
    next:             { mr: 'पुढे', hi: 'आगे', en: 'Next' },
    back:             { mr: 'मागे', hi: 'वापस', en: 'Back' },
    save:             { mr: 'जतन करा', hi: 'सहेजें', en: 'Save & Continue' },
    farmerDetails:    { mr: 'शेतकरी माहिती', hi: 'किसान जानकारी', en: 'Farmer Details' },
    farmerName:       { mr: 'शेतकऱ्याचे नाव (पर्यायी)', hi: 'किसान का नाम (वैकल्पिक)', en: 'Farmer Name (optional)' },
    country:          { mr: 'देश', hi: 'देश', en: 'Country' },
    state:            { mr: 'राज्य / जिल्हा', hi: 'राज्य / जिला', en: 'State / District' },
    crop:             { mr: 'पीक प्रकार', hi: 'फसल का प्रकार', en: 'Crop Type' },
    soilType:         { mr: 'मातीचा प्रकार', hi: 'मिट्टी का प्रकार', en: 'Soil Type' },
    irrigation:       { mr: 'सिंचन प्रकार (पर्यायी)', hi: 'सिंचाई का प्रकार (वैकल्पिक)', en: 'Irrigation Type (optional)' },
    experience:       { mr: 'शेती अनुभव (पर्यायी)', hi: 'खेती का अनुभव (वैकल्पिक)', en: 'Farming Experience (optional)' },
    welcomeStep1:     { mr: 'कृषिमित्रमध्ये आपले स्वागत आहे', hi: 'KrushiMitra में आपका स्वागत है', en: 'Welcome to KrushiMitra' },
    step1Desc:        { mr: 'सुरू करण्यासाठी आपली भाषा निवडा', hi: 'शुरू करने के लिए अपनी भाषा चुनें', en: 'Choose your preferred language to get started' },
    step2Desc:        { mr: 'आम्हाला तुमच्याबद्दल थोडे सांगा', hi: 'हमें अपने बारे में थोड़ा बताएं', en: 'Tell us a little about yourself' },

    // Chat
    askPlaceholder:   { mr: 'मराठीत प्रश्न विचारा…', hi: 'हिंदी में प्रश्न पूछें…', en: 'Ask your farming question…' },
    askButton:        { mr: 'विचारा', hi: 'पूछें', en: 'Ask' },
    thinking:         { mr: 'विचार करत आहे…', hi: 'सोच रहा हूँ…', en: 'Thinking…' },
    speak:            { mr: '🔊 ऐका', hi: '🔊 सुनें', en: '🔊 Speak' },
    stop:             { mr: '⏹ थांबा', hi: '⏹ रोकें', en: '⏹ Stop' },
    chatWithAI:       { mr: 'कृषी AI शी बोला', hi: 'कृषि AI से बात करें', en: 'Chat with AI' },
    newChat:          { mr: 'नवीन संभाषण', hi: 'नई बातचीत', en: 'New Chat' },
    chatHistory:      { mr: 'संभाषण इतिहास', hi: 'बातचीत इतिहास', en: 'Chat History' },
    noChats:          { mr: 'अजून कोणतेही संभाषण नाही', hi: 'अभी तक कोई बातचीत नहीं', en: 'No conversations yet' },
    deleteChat:       { mr: 'हटवा', hi: 'हटाएं', en: 'Delete' },

    // Navbar / General
    logout:           { mr: 'बाहेर पडा', hi: 'लॉगआउट', en: 'Logout' },
    knowledge:        { mr: 'ज्ञानकोश', hi: 'ज्ञान भंडार', en: 'Knowledge' },
    admin:            { mr: 'प्रशासक', hi: 'प्रशासक', en: 'Admin' },
    login:            { mr: 'लॉगिन', hi: 'लॉगिन', en: 'Login' },
    register:         { mr: 'नोंदणी', hi: 'पंजीकरण', en: 'Register' },
};

/**
 * Translate a key to the given language, fallback to English.
 */
export const t = (key, lang = 'en') => {
    const entry = translations[key];
    if (!entry) return key;
    return entry[lang] || entry['en'] || key;
};

export default translations;
