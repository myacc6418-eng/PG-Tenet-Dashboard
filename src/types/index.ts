export type TenantLifecycleState =
  | "logged_out"
  | "no_pg"
  | "joining_pending"
  | "joining_approved"
  | "upcoming_checkin"
  | "active_resident"
  | "checkout_requested"
  | "checkout_pending"
  | "checked_out";

export type LanguageCode = "en" | "te" | "hi";

export type PGGenderType = "Boys PG" | "Girls PG" | "Co-living";

export type SharingType = "Single" | "Double" | "Triple" | "Four";

export type AmenityKey =
  | "wifi"
  | "food"
  | "ac"
  | "laundry"
  | "housekeeping"
  | "cctv"
  | "power_backup"
  | "water_purifier"
  | "gym"
  | "common_area"
  | "parking"
  | "hot_water";

export interface RoomOption {
  id: string;
  pgId: string;
  title: string;
  roomNumber?: string;
  sharingType: SharingType;
  sharingCapacity: number;
  isAC: boolean;
  monthlyRent: number;
  securityDeposit: number;
  electricityCharges: string;
  foodCharges: string;
  availableBeds: number;
  availableRooms: number;
  furnishing: string;
  bathroomType: "Attached" | "Common";
  availableFrom: string;
  images: string[];
  amenities: string[];
}

export interface MealSlot {
  title: string;
  time: string;
  items: string[];
  isVeg: boolean;
  nonVegOption?: string;
  image?: string;
}

export interface DayFoodMenu {
  day: string;
  breakfast: MealSlot;
  lunch: MealSlot;
  dinner: MealSlot;
}

export interface PGReview {
  id: string;
  pgId: string;
  tenantName: string;
  stayDuration: string;
  verifiedResident: boolean;
  date: string;
  overallRating: number;
  categories: {
    cleanliness: number;
    food: number;
    comfort: number;
    wifi: number;
    security: number;
    management: number;
  };
  comment: string;
  ownerReply?: {
    text: string;
    date: string;
  };
  photos?: string[];
}

export interface NearbyLandmark {
  name: string;
  distance: string;
  type: "Metro" | "IT Park" | "Hospital" | "Market";
}

export interface PGProperty {
  id: string;
  name: string;
  city: "Hyderabad" | "Bengaluru" | "Pune";
  area: string;
  address: string;
  genderType: PGGenderType;
  rating: number;
  reviewCount: number;
  startingRent: number;
  availableBeds: number;
  availableRooms: number;
  totalRooms: number;
  totalBeds: number;
  currentOccupancy: number;
  foodIncluded: boolean;
  isFeatured?: boolean;
  description: string;
  images: string[];
  amenities: AmenityKey[];
  rules: string[];
  checkInConditions: string[];
  ownerName: string;
  ownerPhone: string;
  caretakerName: string;
  caretakerPhone: string;
  mapPosition: { x: number; y: number };
  nearbyLandmarks: NearbyLandmark[];
  rooms: RoomOption[];
  weeklyMenu: DayFoodMenu[];
  reviews: PGReview[];
}

export interface TenantUser {
  id: string;
  fullName: string;
  firstName: string;
  email: string;
  mobile: string;
  dob: string;
  occupation: string;
  permanentAddress: string;
  avatar: string;
  emergencyContact: {
    name: string;
    relationship: string;
    mobile: string;
  };
}

export interface ActiveStay {
  stayId: string;
  pgId: string;
  pgName: string;
  pgImage: string;
  location: string;
  address: string;
  roomId: string;
  roomTitle: string;
  roomNumber: string;
  bedNumber: string;
  sharingType: SharingType;
  isAC: boolean;
  checkInDate: string;
  monthlyRent: number;
  securityDeposit: number;
  rentDueDate: string;
  ownerName: string;
  ownerPhone: string;
  caretakerName: string;
  caretakerPhone: string;
}

export type JoiningStatus =
  | "Submitted"
  | "Under Review"
  | "More Details Required"
  | "Approved"
  | "Rejected"
  | "Upcoming Check-in"
  | "Active";

export interface JoiningDocument {
  id: string;
  label: string;
  fileName: string;
  type: "photo" | "id_proof" | "work_id";
  uploadedAt: string;
  previewUrl?: string;
}

export interface JoiningRequest {
  id: string;
  pgId: string;
  pgName: string;
  pgImage: string;
  pgLocation: string;
  roomId: string;
  roomTitle: string;
  sharingType: SharingType;
  isAC: boolean;
  expectedCheckInDate: string;
  advertisedRent: number;
  advertisedDeposit: number;
  status: JoiningStatus;
  submittedAt: string;
  ownerNote?: string;
  correctionField?: string;
  personalDetails: {
    fullName: string;
    email: string;
    mobile: string;
    dob: string;
    occupation: string;
    permanentAddress: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    mobile: string;
  };
  documents: JoiningDocument[];
  confirmedTerms?: {
    assignedRoomNumber: string;
    assignedBedNumber: string;
    confirmedRent: number;
    confirmedDeposit: number;
    confirmedCheckInDate: string;
    agreementSummary: string;
    termsAccepted: boolean;
  };
}

export interface RentPayment {
  id: string;
  stayId: string;
  monthLabel: string;
  rentAmount: number;
  electricityCharge: number;
  otherCharges: number;
  totalAmount: number;
  paidAmount: number;
  dueDate: string;
  paidDate?: string;
  status: "Paid" | "Due" | "Partial";
  method?: string;
  transactionRef?: string;
}

export interface TenantDocument {
  id: string;
  name: string;
  category: "Identity" | "Agreement" | "Receipt" | "Confirmation";
  date: string;
  status: "Verified" | "Issued" | "Archived";
  pgName: string;
  fileSize: string;
  description: string;
}

export type ComplaintCategory =
  | "Electricity"
  | "Plumbing"
  | "Wi-Fi"
  | "Cleaning"
  | "Furniture"
  | "Food"
  | "Other";

export type ComplaintStatus = "Submitted" | "In Progress" | "Resolved";

export interface ComplaintItem {
  id: string;
  pgId: string;
  category: ComplaintCategory;
  title: string;
  description: string;
  createdAt: string;
  status: ComplaintStatus;
  photoLabel?: string;
  resolutionNote?: string;
  rating?: number;
}

export interface NoticeItem {
  id: string;
  pgId: string;
  title: string;
  body: string;
  date: string;
  priority: "Important" | "Update" | "Event";
}

export interface VisitSchedule {
  id: string;
  pgId: string;
  pgName: string;
  pgLocation: string;
  date: string;
  timeSlot: string;
  status: "Scheduled" | "Completed";
}

export type CheckoutStatus = "Submitted" | "Under Review" | "Approved" | "Completed";

export interface CheckoutRequest {
  id: string;
  stayId: string;
  pgId: string;
  pgName: string;
  roomNumber: string;
  bedNumber: string;
  checkInDate: string;
  requestedCheckoutDate: string;
  reason: string;
  noticePeriodDays: number;
  pendingRent: number;
  depositAmount: number;
  deductions: number;
  refundableDeposit: number;
  status: CheckoutStatus;
  submittedAt: string;
  ownerApproval?: {
    finalCheckoutDate: string;
    finalCharges: number;
    settlementStatus: string;
    approvedAt: string;
  };
}

export interface PastStay {
  stayId: string;
  pgId: string;
  pgName: string;
  pgImage: string;
  location: string;
  roomNumber: string;
  sharingType: SharingType;
  checkInDate: string;
  checkOutDate: string;
  durationLabel: string;
  monthlyRent: number;
  depositRefunded: number;
  hasReviewed: boolean;
}

export interface FoodFeedback {
  id: string;
  date: string;
  mealType: "Breakfast" | "Lunch" | "Dinner";
  rating: number;
  comment: string;
}

export interface MealOptOut {
  date: string;
  mealType: "Breakfast" | "Lunch" | "Dinner";
}
