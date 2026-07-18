/**
 * समाधान NEWS – Local CMS Mock Data
 * Replaces the backend for this local-only news portal
 */

export interface Category {
  id: string;
  slug: string;
  name: string;
  nameEn: string;
}

export interface News {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  images?: string[];
  mediaType: 'image' | 'video';
  videoUrl?: string;
  youtubeId?: string;
  category: string;
  author: string;
  publishedAt: string;
  isBreaking?: boolean;
  views?: number;
}

// Categories for navigation
export const categories: Category[] = [
  { id: '1', slug: 'rajneeti', name: 'राजनीति', nameEn: 'Politics' },
  { id: '2', slug: 'desh', name: 'राष्ट्रीय', nameEn: 'National' },
  { id: '3', slug: 'duniya', name: 'अंतर्राष्ट्रीय', nameEn: 'World' },
  { id: '4', slug: 'rajya', name: 'राज्य', nameEn: 'State' },
  { id: '5', slug: 'vyapar', name: 'व्यापार', nameEn: 'Business' },
  { id: '6', slug: 'tech', name: 'तकनीक', nameEn: 'Technology' },
  { id: '7', slug: 'shiksha', name: 'शिक्षा', nameEn: 'Education' },
  { id: '8', slug: 'kheel', name: 'खेल', nameEn: 'Sports' },
  { id: '9', slug: 'manoranjan', name: 'मनोरंजन', nameEn: 'Entertainment' },
  { id: '10', slug: 'swasthya', name: 'स्वास्थ्य', nameEn: 'Health' },
  { id: '11', slug: 'dharm', name: 'धर्म', nameEn: 'Religion' },
  { id: '12', slug: 'jeevan', name: 'जीवनशैली', nameEn: 'Lifestyle' },
  { id: '13', slug: 'sampadkiya', name: 'संपादकीय', nameEn: 'Editorial' },
  { id: '14', slug: 'raay', name: 'राय', nameEn: 'Opinion' },
  { id: '15', slug: 'cg', name: 'छत्तीसगढ़', nameEn: 'Chhattisgarh' },
  { id: '16', slug: 'madhya-pradesh', name: 'मध्य प्रदेश', nameEn: 'Madhya Pradesh' },
];

// News articles - mixed image and video content
export const news: News[] = [
  {
    id: '1',
    slug: 'pm-modi-rajasthan-visit',
    title: 'प्रधानमंत्री मोदी की राजस्थान यात्रा: विकास परियोजनाओं का शुभारंभ',
    excerpt: 'प्रधानमंत्री नरेंद्र मोदी आज राजस्थान की यात्रा पर हैं, जहां वे कई विकास परियोजनाओं का शुभारंभ करेंगे और जनसभा को संबोधित करेंगे।',
    content: `प्रधानमंत्री नरेंद्र मोदी आज राजस्थान की महत्वपूर्ण यात्रा पर हैं। इस यात्रा के दौरान वे राज्य के कई विकास परियोजनाओं का शुभारंभ करेंगे और जनसभा को संबोधित करेंगे।

यात्रा के दौरान पीएम मोदी स्वास्थ्य, शिक्षा और अवसंरचना से संबंधित कई योजनाओं का उद्घाटन करेंगे। राज्य के वरिष्ठ अधिकारियों ने बताया कि सभी तैयारियां पूरी कर ली गई हैं।`,
    image: 'https://picsum.photos/seed/news1/800/450',
    mediaType: 'image',
    category: 'desh',
    author: 'राजेश कुमार',
    publishedAt: '2026-02-06T10:30:00Z',
  },
  {
    id: '2',
    slug: 'rs-500-note-shortage',
    title: 'देशभर में ₹500 के नोटों की कमी, RBI ने जारी किया बयान',
    excerpt: 'देश के कई राज्यों में ₹500 के नोटों की भारी कमी देखी जा रही है। लोगों को ATM से पैसे नहीं मिल पा रहे हैं।',
    content: `देश के विभिन्न हिस्सों से ₹500 के नोटों की कमी की खबरें आ रही हैं। RBI ने इस संबंध में एक आधिकारिक बयान जारी किया है।

बैंक सूत्रों के अनुसार, नोटों की आपूर्ति में कुछ तकनीकी समस्याएं आई हैं जिन्हें जल्द ही दूर कर लिया जाएगा।`,
    image: 'https://picsum.photos/seed/news2/800/450',
    mediaType: 'image',
    category: 'desh',
    author: 'अनिल शर्मा',
    publishedAt: '2026-02-06T09:15:00Z',
  },
  {
    id: '3',
    slug: 'rahul-gandhi-rajasthan-meeting',
    title: 'राहुल गांधी की राजस्थान में जनसभा: कांग्रेस ने जुटाई भीड़',
    excerpt: 'कांग्रेस नेता राहुल गांधी राजस्थान में एक महत्वपूर्ण जनसभा को संबोधित करेंगे। पार्टी ने बड़ी संख्या में लोगों को जुटाने का दावा किया है।',
    content: `राजस्थान के एक प्रमुख शहर में कांग्रेस नेता राहुल गांधी जनसभा को संबोधित करेंगे। यह जनसभा आगामी चुनावों के मद्देनजर महत्वपूर्ण मानी जा रही है।

कांग्रेस ने दावा किया है कि जनसभा में लाखों लोगों के शामिल होने की उम्मीद है।`,
    image: 'https://picsum.photos/seed/news3/800/450',
    mediaType: 'image',
    category: 'desh',
    author: 'प्रियंका सिंह',
    publishedAt: '2026-02-06T08:00:00Z',
  },
  {
    id: '4',
    slug: 'china-us-trade-tensions',
    title: 'चीन-अमेरिका व्यापार तनाव: नए शुल्कों की घोषणा',
    excerpt: 'अमेरिका ने चीनी आयात पर नए टैरिफ लागू करने की घोषणा की है, जिससे वैश्विक व्यापार बाजार में नया तनाव उत्पन्न हो गया है।',
    content: `वाशिंगटन: अमेरिकी सरकार ने चीन से आयात होने वाले कुछ उत्पादों पर नए टैरिफ लागू करने की घोषणा की है।

यह निर्णय दोनों देशों के बीच चल रहे व्यापार विवाद का नया अध्याय है।`,
    image: 'https://picsum.photos/seed/news4/800/450',
    mediaType: 'image',
    category: 'duniya',
    author: 'विक्रम सक्सेना',
    publishedAt: '2026-02-05T22:45:00Z',
  },
  {
    id: '5',
    slug: 'cg-farmers-protest',
    title: 'छत्तीसगढ़ में किसान आंदोलन: सरकार ने बनाई संवाद समिति',
    excerpt: 'छत्तीसगढ़ के किसानों की मांगों को लेकर सरकार ने एक संवाद समिति का गठन किया है।',
    content: `रायपुर: छत्तीसगढ़ सरकार ने किसानों की मांगों को सुलझाने के लिए एक उच्च स्तरीय संवाद समिति का गठन किया है।

इस समिति में कृषि विभाग के वरिष्ठ अधिकारी और किसान नेता शामिल होंगे।`,
    image: 'https://picsum.photos/seed/news5/800/450',
    mediaType: 'image',
    category: 'cg',
    author: 'दीपक वर्मा',
    publishedAt: '2026-02-06T07:30:00Z',
  },
  {
    id: '6',
    slug: 'india-australia-t20-series',
    title: 'भारत-ऑस्ट्रेलिया T20 सीरीज: रोहित शर्मा का शतक',
    excerpt: 'भारतीय कप्तान रोहित शर्मा ने ऑस्ट्रेलिया के विरुद्ध T20 मैच में 118 रनों की नाटकीय पारी खेली।',
    content: `मुंबई: भारतीय क्रिकेट टीम के कप्तान रोहित शर्मा ने ऑस्ट्रेलिया के विरुद्ध T20 मैच में 118 रनों की नाटकीय पारी खेली।

इस शतक की बदौलत भारत ने मैच जीत लिया और सीरीज में 2-1 की बढ़त बना ली।`,
    image: 'https://picsum.photos/seed/news6/800/450',
    mediaType: 'video',
    youtubeId: 'dQw4w9WgXcQ',
    category: 'kheel',
    author: 'महेश भाई',
    publishedAt: '2026-02-05T20:15:00Z',
  },
  {
    id: '7',
    slug: 'bollywood-new-film',
    title: 'बॉलीवुड: दीपिका पादुकोण की नई फिल्म का ट्रेलर जारी',
    excerpt: 'बॉलीवुड की प्रमुख अभिनेत्री दीपिका पादुकोण की आगामी फिल्म का ट्रेलर रिलीज हो गया है।',
    content: `मुंबई: दीपिका पादुकोण और रणबीर कपूर की जोड़ी में बनी नई फिल्म का ट्रेलर रिलीज हो गया है।

फिल्म का निर्देशन एक प्रसिद्ध फिल्मकार ने किया है।`,
    image: 'https://picsum.photos/seed/news7/800/450',
    mediaType: 'image',
    category: 'manoranjan',
    author: 'कविता शर्मा',
    publishedAt: '2026-02-06T06:00:00Z',
  },
  {
    id: '8',
    slug: 'ai-technology-2026',
    title: 'AI टेक्नोलॉजी 2026: ये कंपनियां बनाएंगी नया रिकॉर्ड',
    excerpt: 'आर्टिफिशियल इंटेलिजेंस क्षेत्र में 2026 में क्रांतिकारी बदलाव आने की संभावना है।',
    content: `सिलिकॉन वैली: AI तकनीक क्षेत्र में आने वाले वर्षों में महत्वपूर्ण प्रगति की उम्मीद है।

विश्लेषकों का मानना है कि जनरेटिव AI और मशीन लर्निंग में नई तकनीकें बाजार को बदल देंगी।`,
    image: 'https://picsum.photos/seed/news8/800/450',
    mediaType: 'video',
    youtubeId: 'LXb3EKWsInQ',
    category: 'tech',
    author: 'आनंद गुप्ता',
    publishedAt: '2026-02-05T18:30:00Z',
  },
  {
    id: '9',
    slug: 'election-commission-dates',
    title: 'चुनाव आयोग ने जारी किए मतदान तिथियां: 5 राज्यों में चुनाव',
    excerpt: 'चुनाव आयोग ने 5 राज्यों में विधानसभा चुनावों की तिथियां घोषित कर दी हैं।',
    content: `नई दिल्ली: चुनाव आयोग ने आज 5 राज्यों में विधानसभा चुनावों की तिथियां घोषित कर दी हैं।

इन चुनावों को लोकतंत्र के महोत्सव के रूप में देखा जा रहा है।`,
    image: 'https://picsum.photos/seed/news9/800/450',
    mediaType: 'image',
    category: 'desh',
    author: 'सुरेश त्यागी',
    publishedAt: '2026-02-06T05:45:00Z',
  },
  {
    id: '10',
    slug: 'weather-alert-cold-wave',
    title: 'मौसम अलर्ट: उत्तर भारत में कड़ाके की ठंड, येलो अलर्ट जारी',
    excerpt: 'मौसम विभाग ने उत्तर भारत के कई राज्यों में कड़ाके की ठंड को लेकर येलो अलर्ट जारी किया है।',
    content: `नई दिल्ली: भारतीय मौसम विभाग ने उत्तर भारत में कड़ाके की ठंड को लेकर येलो अलर्ट जारी किया है।

शीत लहर के कारण स्कूलों में छुट्टी और परिवहन में व्यवधान की संभावना है।`,
    image: 'https://picsum.photos/seed/news10/800/450',
    mediaType: 'image',
    category: 'desh',
    author: 'पवन कुमार',
    publishedAt: '2026-02-06T04:30:00Z',
  },
  {
    id: '11',
    slug: 'opposition-raises-inflation',
    title: 'संसद में विपक्ष ने उठाए महंगाई और बेरोज़गारी के मुद्दे',
    excerpt: 'संसद के बजट सत्र में विपक्ष ने महंगाई, बेरोज़गारी और किसानों की समस्याओं को ज़ोर-शोर से उठाया।',
    content: `नई दिल्ली: संसद के बजट सत्र में विपक्षी दलों ने महंगाई और बेरोज़गारी के मुद्दों को प्रमुखता से उठाया।

विपक्ष का आरोप है कि आम जनता पर महंगाई का बोझ बढ़ रहा है और सरकार को इस दिशा में ठोस कदम उठाने चाहिए।`,
    image: 'https://picsum.photos/seed/news11/800/450',
    mediaType: 'image',
    category: 'rajneeti',
    author: 'राजेश कुमार',
    publishedAt: '2026-02-06T03:15:00Z',
  },
  {
    id: '12',
    slug: 'sensex-new-high',
    title: 'शेयर बाज़ार नई ऊंचाई पर: सेंसेक्स 85,000 के पार',
    excerpt: 'घरेलू शेयर बाज़ार ने नई ऊंचाई छुई, निवेशकों के साथ-साथ विदेशी निवेशकों का भरोसा भी बढ़ा।',
    content: `मुंबई: घरेलू शेयर बाज़ार ने आज नया रिकॉर्ड बनाया। सेंसेक्स 85,000 अंक के पार पहुंच गया।

विश्लेषकों के अनुसार, मज़बूत कॉर्पोरेट आय और विदेशी निवेश के चलते बाज़ार में तेज़ी बनी हुई है।`,
    image: 'https://picsum.photos/seed/news12/800/450',
    mediaType: 'image',
    category: 'vyapar',
    author: 'विक्रम सक्सेना',
    publishedAt: '2026-02-06T02:40:00Z',
  },
  {
    id: '13',
    slug: 'ugc-academic-calendar',
    title: 'UGC ने जारी किया नया अकादमिक कैलेंडर, परीक्षाएं इस तारीख से',
    excerpt: 'विश्वविद्यालय अनुदान आयोग ने नए शैक्षणिक सत्र के लिए अकादमिक कैलेंडर जारी किया है।',
    content: `नई दिल्ली: UGC ने आगामी शैक्षणिक सत्र हेतु नया अकादमिक कैलेंडर जारी किया है।

इसमें प्रवेश प्रक्रिया, परीक्षाओं और परिणामों की तिथियां स्पष्ट की गई हैं ताकि छात्रों को कोई भ्रम न रहे।`,
    image: 'https://picsum.photos/seed/news13/800/450',
    mediaType: 'image',
    category: 'shiksha',
    author: 'कविता शर्मा',
    publishedAt: '2026-02-05T23:10:00Z',
  },
  {
    id: '14',
    slug: 'winter-health-tips',
    title: 'सर्दी-जुकाम से बचाव: डॉक्टरों ने दी ये ज़रूरी सलाह',
    excerpt: 'कड़ाके की ठंड में स्वास्थ्य का विशेष ध्यान रखना ज़रूरी है। जानें क्या करें और क्या न करें।',
    content: `लखनऊ: सर्दियों में स्वास्थ्य संबंधी समस्याएं बढ़ जाती हैं। डॉक्टरों का कहना है कि गर्म कपड़े, पर्याप्त पानी और संतुलित आहार ज़रूरी है।

बुज़ुर्गों और बच्चों को सर्दी से विशेष सावधानी बरतनी चाहिए।`,
    image: 'https://picsum.photos/seed/news14/800/450',
    mediaType: 'image',
    category: 'swasthya',
    author: 'डॉ. सुनीता वर्मा',
    publishedAt: '2026-02-05T21:30:00Z',
  },
  {
    id: '15',
    slug: 'mahakumbh-dip',
    title: 'महाकुंभ में लाखों श्रद्धालुओं ने लगाई पावन डुबकी',
    excerpt: 'पवित्र संगम में आस्था का सैलाब, लाखों श्रद्धालुओं ने रिकॉर्ड संख्या में लगाई डुबकी।',
    content: `प्रयागराज: महाकुंभ के पावन अवसर पर लाखों श्रद्धालुओं ने संगम में डुबकी लगाई।

प्रशासन ने व्यवस्था को चुस्त-दुरुस्त रखने के लिए विशेष इंतज़ाम किए हुए हैं।`,
    image: 'https://picsum.photos/seed/news15/800/450',
    mediaType: 'image',
    category: 'dharm',
    author: 'प्रियंका सिंह',
    publishedAt: '2026-02-05T19:00:00Z',
  },
  {
    id: '16',
    slug: 'healthy-habits-new-year',
    title: 'नए साल में अपनाएं ये 5 हेल्दी आदतें',
    excerpt: 'बेहतर जीवनशैली के लिए छोटी-छोटी आदतों में बदलाव बड़ा अंतर ला सकता है।',
    content: `जीवनशैली में सुधार के लिए विशेषज्ञ सुबह की सैर, पौष्टिक आहार और पर्याप्त नींद की सलाह देते हैं।

छोटे बदलाव न केवल सेहत सुधारते हैं बल्कि मानसिक शांति भी देते हैं।`,
    image: 'https://picsum.photos/seed/news16/800/450',
    mediaType: 'image',
    category: 'jeevan',
    author: 'अनिता गुप्ता',
    publishedAt: '2026-02-05T17:45:00Z',
  },
  {
    id: '17',
    slug: 'editorial-healthy-journalism',
    title: 'संपादकीय: लोकतंत्र में स्वस्थ पत्रकारिता का महत्व',
    excerpt: 'स्वतंत्र और निष्पक्ष पत्रकारिता ही लोकतंत्र की सच्ची नींव है।',
    content: `समाधान NEWS का मानना है कि स्वतंत्र और निष्पक्ष पत्रकारिता लोकतंत्र का चौथा स्तंभ है।

हम तथ्यों के साथ खड़े होकर अपने पाठकों तक सही और संतुलित खबरें पहुंचाने के लिए प्रतिबद्ध हैं।`,
    image: 'https://picsum.photos/seed/news17/800/450',
    mediaType: 'image',
    category: 'sampadkiya',
    author: 'संपादक मंडल',
    publishedAt: '2026-02-05T16:20:00Z',
  },
  {
    id: '18',
    slug: 'opinion-digital-education',
    title: 'राय: डिजिटल शिक्षा की चुनौतियां और संभावनाएं',
    excerpt: 'तकनीक शिक्षा का साधन बने, बाधा नहीं – यह सुनिश्चित करना हम सबकी ज़िम्मेदारी है।',
    content: `डिजिटल शिक्षा ने सीखने के तरीके बदल दिए हैं, लेकिन डिजिटल विभाजन अभी भी एक बड़ी चुनौती है।

ग्रामीण और शहरी छात्रों के बीच के अंतर को पाटने के लिए समावेशी नीतियों की ज़रूरत है।`,
    image: 'https://picsum.photos/seed/news18/800/450',
    mediaType: 'image',
    category: 'raay',
    author: 'विश्लेषक',
    publishedAt: '2026-02-05T15:00:00Z',
  },
  {
    id: '19',
    slug: 'state-budget-health',
    title: 'राज्य सरकार ने बजट में स्वास्थ्य और शिक्षा के लिए बढ़ाई राशि',
    excerpt: 'राज्य के बजट में स्वास्थ्य, शिक्षा और ग्रामीण विकास को प्राथमिकता दी गई है।',
    content: `शहडोल: राज्य सरकार ने अपने वार्षिक बजट में स्वास्थ्य और शिक्षा के बजट में भारी वृद्धि की घोषणा की।

वित्त मंत्री ने कहा कि ग्रामीण विकास और रोज़गार सृजन सरकार की शीर्ष प्राथमिकता है।`,
    image: 'https://picsum.photos/seed/news19/800/450',
    mediaType: 'image',
    category: 'rajya',
    author: 'दीपक वर्मा',
    publishedAt: '2026-02-05T14:10:00Z',
  },
  {
    id: '20',
    slug: 'mp-infrastructure-project',
    title: 'मध्य प्रदेश: नए एक्सप्रेसवे से बदलेगी कनेक्टिविटी',
    excerpt: 'प्रदेश में चल रहीं अवसंरचना परियोजनाओं से औद्योगिक विकास को गति मिलेगी।',
    content: `शहडोल: मध्य प्रदेश सरकार नए एक्सप्रेसवे और औद्योगिक गलियारों पर तेज़ी से काम कर रही है।

अधिकारियों के अनुसार, इन परियोजनाओं से रोज़गार और कनेक्टिविटी दोनों में सुधार होगा।`,
    image: 'https://picsum.photos/seed/news20/800/450',
    mediaType: 'image',
    category: 'madhya-pradesh',
    author: 'सुरेश त्यागी',
    publishedAt: '2026-02-05T13:00:00Z',
  },
  {
    id: '21',
    slug: 'cg-tribal-welfare',
    title: 'छत्तीसगढ़: आदिवासी कल्याण योजनाओं का हुआ विस्तार',
    excerpt: 'राज्य सरकार ने आदिवासी बाहुल्य क्षेत्रों में शिक्षा और स्वास्थ्य सुविधाओं का विस्तार किया।',
    content: `रायपुर: छत्तीसगढ़ सरकार ने आदिवासी कल्याण हेतु कई नई योजनाओं की घोषणा की।

इन योजनाओं का लक्ष्य दूरस्थ क्षेत्रों तक शिक्षा, स्वास्थ्य और रोज़गार की पहुंच सुनिश्चित करना है।`,
    image: 'https://picsum.photos/seed/news21/800/450',
    mediaType: 'image',
    category: 'cg',
    author: 'अनिल शर्मा',
    publishedAt: '2026-02-05T12:00:00Z',
  },
];

// Helper functions for data access
export function getLatestNews(limit?: number): News[] {
  const sorted = [...news].sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  return limit ? sorted.slice(0, limit) : sorted;
}

export function getBreakingNews(limit?: number): News[] {
  return getLatestNews().slice(0, limit || 3);
}

export function getNewsBySlug(slug: string): News | undefined {
  return news.find(n => n.slug === slug);
}

export function getNewsByCategory(categorySlug: string): News[] {
  return news
    .filter(n => n.category === categorySlug)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function getRelatedNews(currentId: string, category: string, limit = 4): News[] {
  return news
    .filter(n => n.id !== currentId && n.category === category)
    .slice(0, limit);
}

export function getLatestVideos(limit = 4): News[] {
  return news
    .filter(n => n.youtubeId)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);
}

export function getAllVideos(limit?: number): News[] {
  return news
    .filter(n => n.youtubeId)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);
}

export function getCategoryName(slug: string): string {
  return categories.find(c => c.slug === slug)?.name || slug;
}
