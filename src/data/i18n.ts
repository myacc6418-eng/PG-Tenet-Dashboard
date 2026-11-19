import { LanguageCode } from "@/src/types";

type TranslationKeys = {
  appName: string;
  navHome: string;
  navExplore: string;
  navMyPg: string;
  navRequests: string;
  navProfile: string;
  welcomeBack: string;
  findPerfectPg: string;
  yourRoomAndBed: string;
  payRent: string;
  myRoom: string;
  foodMenu: string;
  complaints: string;
  documents: string;
  todaysFood: string;
  announcements: string;
  recommendedPgs: string;
  requestCheckout: string;
  ownerCheckingDetails: string;
  continueJoining: string;
  submitJoiningRequest: string;
  scheduleVisit: string;
  requestBooking: string;
  stepPersonal: string;
  stepRoom: string;
  stepDocuments: string;
  stepEmergency: string;
  stepReview: string;
  audioGuideLabel: string;
};

export const TRANSLATIONS: Record<LanguageCode, TranslationKeys> = {
  en: {
    appName: "PG Finder",
    navHome: "Home",
    navExplore: "Explore",
    navMyPg: "My PG",
    navRequests: "Requests",
    navProfile: "Profile",
    welcomeBack: "Hello",
    findPerfectPg: "Find Your Perfect PG",
    yourRoomAndBed: "Your Room and Bed",
    payRent: "Pay Rent",
    myRoom: "My Room",
    foodMenu: "Food Menu",
    complaints: "Complaints",
    documents: "Documents",
    todaysFood: "Today's Food",
    announcements: "PG Notices",
    recommendedPgs: "Recommended PGs",
    requestCheckout: "Request Checkout",
    ownerCheckingDetails: "The PG owner is checking your details.",
    continueJoining: "Continue Joining",
    submitJoiningRequest: "Submit Joining Request",
    scheduleVisit: "Schedule Visit",
    requestBooking: "Request Booking",
    stepPersonal: "Personal Details",
    stepRoom: "Room Choice",
    stepDocuments: "Upload ID & Photo",
    stepEmergency: "Family Contact",
    stepReview: "Check & Send",
    audioGuideLabel: "Read Aloud",
  },
  te: {
    appName: "PG ఫైండర్",
    navHome: "హోమ్",
    navExplore: "వెతకండి",
    navMyPg: "నా PG",
    navRequests: "అభ్యర్థనలు",
    navProfile: "ప్రొఫైల్",
    welcomeBack: "నమస్కారం",
    findPerfectPg: "మీకు సరైన PG కనుగొనండి",
    yourRoomAndBed: "మీ గది మరియు బెడ్",
    payRent: "అద్దె చెల్లించండి",
    myRoom: "నా గది",
    foodMenu: "భోజన మెనూ",
    complaints: "ఫిర్యాదులు",
    documents: "పత్రాలు",
    todaysFood: "నేటి భోజనం",
    announcements: "PG ప్రకటనలు",
    recommendedPgs: "సూచించిన PGలు",
    requestCheckout: "చెక్-అవుట్ అభ్యర్థించండి",
    ownerCheckingDetails: "PG యజమాని మీ వివరాలను పరిశీలిస్తున్నారు.",
    continueJoining: "చేరడం కొనసాగించండి",
    submitJoiningRequest: "అభ్యర్థన పంపండి",
    scheduleVisit: "సందర్శన బుక్ చేయండి",
    requestBooking: "బుకింగ్ అభ్యర్థించండి",
    stepPersonal: "వ్యక్తిగత వివరాలు",
    stepRoom: "గది ఎంపిక",
    stepDocuments: "గుర్తింపు పత్రాలు",
    stepEmergency: "అత్యవసర సంప్రదింపు",
    stepReview: "సమీక్షించి పంపండి",
    audioGuideLabel: "వినండి",
  },
  hi: {
    appName: "PG फ़ाइंडर",
    navHome: "होम",
    navExplore: "खोजें",
    navMyPg: "मेरा PG",
    navRequests: "अनुरोध",
    navProfile: "प्रोफ़ाइल",
    welcomeBack: "नमस्ते",
    findPerfectPg: "अपना पसंदीदा PG खोजें",
    yourRoomAndBed: "आपका कमरा और बेड",
    payRent: "किराया दें",
    myRoom: "मेरा कमरा",
    foodMenu: "खाने का मेन्यू",
    complaints: "शिकायतें",
    documents: "दस्तावेज़",
    todaysFood: "आज का खाना",
    announcements: "PG सूचनाएं",
    recommendedPgs: "सुझाए गए PG",
    requestCheckout: "चेक-आउट अनुरोध",
    ownerCheckingDetails: "PG मालिक आपकी जानकारी की जांच कर रहे हैं।",
    continueJoining: "जॉइनिंग जारी रखें",
    submitJoiningRequest: "अनुरोध भेजें",
    scheduleVisit: "विज़िट बुक करें",
    requestBooking: "बुकिंग अनुरोध",
    stepPersonal: "व्यक्तिगत विवरण",
    stepRoom: "कमरे का चुनाव",
    stepDocuments: "फोटो और आईडी",
    stepEmergency: "आपातकालीन संपर्क",
    stepReview: "जांचें और भेजें",
    audioGuideLabel: "सुनें",
  },
};
