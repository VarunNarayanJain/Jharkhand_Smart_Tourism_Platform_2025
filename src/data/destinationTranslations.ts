// Translation helper for destination data
export const getTranslatedDestinationName = (destinationId: number, language: 'en' | 'hi'): string => {
  const translations: Record<number, { en: string; hi: string }> = {
    1: {
      en: 'Netarhat',
      hi: 'नेतरहाट'
    },
    2: {
      en: 'Hundru Falls',
      hi: 'हुंडरू जलप्रपात'
    },
    3: {
      en: 'Betla National Park',
      hi: 'बेतला राष्ट्रीय पार्क'
    },
    4: {
      en: 'Deoghar',
      hi: 'देवघर'
    },
    5: {
      en: 'Hazaribagh',
      hi: 'हजारीबाग'
    }
  };

  return translations[destinationId]?.[language] || translations[destinationId]?.en || '';
};

export const getTranslatedDestinationTagline = (destinationId: number, language: 'en' | 'hi'): string => {
  const translations: Record<number, { en: string; hi: string }> = {
    1: {
      en: 'Queen of Chotanagpur Plateau',
      hi: 'छोटानागपुर पठार की रानी'
    },
    2: {
      en: 'Thundering Beauty',
      hi: 'गर्जना करती सुंदरता'
    },
    3: {
      en: 'Wildlife Paradise',
      hi: 'वन्यजीव स्वर्ग'
    },
    4: {
      en: 'Abode of Gods',
      hi: 'देवताओं का निवास'
    },
    5: {
      en: 'Land of Thousand Gardens',
      hi: 'हजार बगीचों की भूमि'
    }
  };

  return translations[destinationId]?.[language] || translations[destinationId]?.en || '';
};

export const getTranslatedDestinationDescription = (destinationId: number, language: 'en' | 'hi'): string => {
  const translations: Record<number, { en: string; hi: string }> = {
    1: {
      en: 'Famous for its sunrise views and cool climate, Netarhat is a perfect hill station escape.',
      hi: 'सूर्योदय के दृश्यों और ठंडी जलवायु के लिए प्रसिद्ध, नेतरहाट एक आदर्श हिल स्टेशन है।'
    },
    2: {
      en: 'A spectacular 98-meter waterfall where Subarnarekha river creates nature\'s masterpiece.',
      hi: 'एक शानदार 98 मीटर का जलप्रपात जहां सुवर्णरेखा नदी प्रकृति की कृति बनाती है।'
    },
    3: {
      en: 'Home to tigers, elephants and diverse wildlife in the Palamau Tiger Reserve.',
      hi: 'पलामू टाइगर रिजर्व में बाघों, हाथियों और विविध वन्यजीवों का घर।'
    },
    4: {
      en: 'Sacred temple town famous for Baba Baidyanath Dham, one of the twelve Jyotirlingas.',
      hi: 'बाबा बैद्यनाथ धाम के लिए प्रसिद्ध पवित्र मंदिर शहर, जो बारह ज्योतिर्लिंगों में से एक है।'
    },
    5: {
      en: 'A scenic paradise known for its national park, lakes, and breathtaking natural beauty.',
      hi: 'अपने राष्ट्रीय उद्यान, झीलों और लुभावनी प्राकृतिक सुंदरता के लिए जाना जाने वाला एक दर्शनीय स्वर्ग।'
    }
  };

  return translations[destinationId]?.[language] || translations[destinationId]?.en || '';
};