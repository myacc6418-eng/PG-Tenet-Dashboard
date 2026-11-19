import React, { createContext, useContext, useState } from "react";
import { toast } from "sonner";
import { TRANSLATIONS } from "@/src/data/i18n";
import {
  IMG,
  INITIAL_ACTIVE_STAY,
  INITIAL_COMPLAINTS,
  INITIAL_DOCUMENTS,
  INITIAL_JOINING_REQUEST,
  INITIAL_NOTICES,
  INITIAL_PAST_STAYS,
  INITIAL_PAYMENTS,
  INITIAL_USER,
  INITIAL_VISITS,
  MOCK_PGS,
} from "@/src/data/mockData";
import {
  ActiveStay,
  CheckoutRequest,
  ComplaintCategory,
  ComplaintItem,
  FoodFeedback,
  JoiningRequest,
  LanguageCode,
  MealOptOut,
  NoticeItem,
  PastStay,
  PGReview,
  RentPayment,
  TenantDocument,
  TenantLifecycleState,
  TenantUser,
  VisitSchedule,
} from "@/src/types";

interface TenantContextValue {
  tenantState: TenantLifecycleState;
  user: TenantUser | null;
  activeStay: ActiveStay | null;
  joiningRequest: JoiningRequest | null;
  checkoutRequest: CheckoutRequest | null;
  payments: RentPayment[];
  documents: TenantDocument[];
  complaints: ComplaintItem[];
  notices: NoticeItem[];
  pastStays: PastStay[];
  visits: VisitSchedule[];
  savedPgIds: string[];
  foodFeedbacks: FoodFeedback[];
  mealOptOuts: MealOptOut[];
  submittedReviews: PGReview[];
  language: LanguageCode;
  audioGuidanceEnabled: boolean;
  t: (typeof TRANSLATIONS)["en"];

  setLanguage: (lang: LanguageCode) => void;
  setAudioGuidanceEnabled: (enabled: boolean) => void;
  speakGuidance: (text: string) => void;

  // Auth actions (in-memory session, no real passwords stored)
  loginDemoUser: (email?: string) => void;
  registerDemoUser: (payload: {
    fullName: string;
    email: string;
    mobile: string;
  }) => void;
  logout: () => void;
  updateProfile: (updates: Partial<TenantUser>) => void;

  // Favourites & Visits
  toggleSavedPg: (pgId: string) => void;
  scheduleVisit: (pgId: string, date: string, timeSlot: string) => void;

  // Joining Flow
  submitJoiningRequest: (request: Omit<JoiningRequest, "id" | "status" | "submittedAt">) => void;
  resubmitCorrection: (note: string, updatedPhone?: string, updatedOccupation?: string) => void;
  acceptApprovedTerms: () => void;
  simulateJoiningStatus: (status: "Under Review" | "More Details Required" | "Approved" | "Rejected") => void;
  simulateCheckInComplete: () => void;

  // Rent & Payments (mock demonstration only)
  payRentMock: (paymentId: string, method: string) => void;

  // Food & Mess
  submitFoodFeedback: (mealType: "Breakfast" | "Lunch" | "Dinner", rating: number, comment: string) => void;
  toggleMealOptOut: (date: string, mealType: "Breakfast" | "Lunch" | "Dinner") => void;

  // Complaints
  createComplaint: (payload: {
    category: ComplaintCategory;
    title: string;
    description: string;
    photoLabel?: string;
  }) => void;
  simulateResolveComplaint: (complaintId: string) => void;

  // Checkout Flow
  submitCheckoutRequest: (requestedDate: string, reason: string) => void;
  simulateApproveCheckout: () => void;

  // Reviews
  submitPGReview: (payload: {
    pgId: string;
    stayId?: string;
    overallRating: number;
    categories: PGReview["categories"];
    comment: string;
    photos?: string[];
  }) => void;

  // Demo Scenario Switcher (Dev / Demo only)
  switchDemoScenario: (
    scenario:
      | "logged_out"
      | "no_pg"
      | "joining_pending"
      | "joining_approved"
      | "upcoming_checkin"
      | "active_resident"
      | "checkout_pending"
      | "checked_out"
  ) => void;
}

const TenantContext = createContext<TenantContextValue | undefined>(undefined);

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [tenantState, setTenantState] = useState<TenantLifecycleState>("active_resident");
  const [user, setUser] = useState<TenantUser | null>(INITIAL_USER);
  const [activeStay, setActiveStay] = useState<ActiveStay | null>(INITIAL_ACTIVE_STAY);
  const [joiningRequest, setJoiningRequest] = useState<JoiningRequest | null>(null);
  const [checkoutRequest, setCheckoutRequest] = useState<CheckoutRequest | null>(null);
  const [payments, setPayments] = useState<RentPayment[]>(INITIAL_PAYMENTS);
  const [documents, setDocuments] = useState<TenantDocument[]>(INITIAL_DOCUMENTS);
  const [complaints, setComplaints] = useState<ComplaintItem[]>(INITIAL_COMPLAINTS);
  const [notices] = useState<NoticeItem[]>(INITIAL_NOTICES);
  const [pastStays, setPastStays] = useState<PastStay[]>(INITIAL_PAST_STAYS);
  const [visits, setVisits] = useState<VisitSchedule[]>(INITIAL_VISITS);
  const [savedPgIds, setSavedPgIds] = useState<string[]>(["pg-urban-oasis", "pg-serene-heights"]);
  const [foodFeedbacks, setFoodFeedbacks] = useState<FoodFeedback[]>([]);
  const [mealOptOuts, setMealOptOuts] = useState<MealOptOut[]>([]);
  const [submittedReviews, setSubmittedReviews] = useState<PGReview[]>([]);
  const [language, setLanguage] = useState<LanguageCode>("en");
  const [audioGuidanceEnabled, setAudioGuidanceEnabled] = useState<boolean>(false);

  const t = TRANSLATIONS[language];

  const speakGuidance = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === "te" ? "te-IN" : language === "hi" ? "hi-IN" : "en-IN";
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
      toast.info("Playing voice guide", { description: text });
    } else {
      toast.info("Voice guide", { description: text });
    }
  };

  const loginDemoUser = (email?: string) => {
    setUser({
      ...INITIAL_USER,
      email: email && email.includes("@") ? email : INITIAL_USER.email,
    });
    if (tenantState === "logged_out") {
      setTenantState(activeStay ? "active_resident" : "no_pg");
    }
    toast.success("Signed in to PG Finder");
  };

  const registerDemoUser = (payload: { fullName: string; email: string; mobile: string }) => {
    const firstName = payload.fullName.trim().split(" ")[0] || "Tenant";
    setUser({
      ...INITIAL_USER,
      id: `tenant-${Date.now()}`,
      fullName: payload.fullName,
      firstName,
      email: payload.email,
      mobile: payload.mobile,
    });
    setActiveStay(null);
    setJoiningRequest(null);
    setCheckoutRequest(null);
    setTenantState("no_pg");
    toast.success("Account verified and ready");
  };

  const logout = () => {
    setTenantState("logged_out");
    setUser(null);
    toast.info("Signed out of your account");
  };

  const updateProfile = (updates: Partial<TenantUser>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const nextName = updates.fullName ?? prev.fullName;
      return {
        ...prev,
        ...updates,
        firstName: nextName.trim().split(" ")[0] || prev.firstName,
      };
    });
    toast.success("Profile updated");
  };

  const toggleSavedPg = (pgId: string) => {
    setSavedPgIds((prev) => {
      const exists = prev.includes(pgId);
      const next = exists ? prev.filter((id) => id !== pgId) : [...prev, pgId];
      toast.success(exists ? "Removed from Saved PGs" : "Saved PG to your list");
      return next;
    });
  };

  const scheduleVisit = (pgId: string, date: string, timeSlot: string) => {
    const pg = MOCK_PGS.find((p) => p.id === pgId);
    if (!pg) return;
    const newVisit: VisitSchedule = {
      id: `vis-${Date.now()}`,
      pgId,
      pgName: pg.name,
      pgLocation: `${pg.area}, ${pg.city}`,
      date,
      timeSlot,
      status: "Scheduled",
    };
    setVisits((prev) => [newVisit, ...prev]);
    toast.success(`Visit scheduled at ${pg.name}`, {
      description: `${date} · ${timeSlot}`,
    });
  };

  const submitJoiningRequest = (request: Omit<JoiningRequest, "id" | "status" | "submittedAt">) => {
    const created: JoiningRequest = {
      ...request,
      id: `join-req-${Date.now()}`,
      status: "Submitted",
      submittedAt: new Date().toISOString().split("T")[0],
      ownerNote: "Your request has been sent to the PG owner for review.",
      confirmedTerms: {
        assignedRoomNumber: "Room 204",
        assignedBedNumber: "Bed A",
        confirmedRent: request.advertisedRent,
        confirmedDeposit: request.advertisedDeposit,
        confirmedCheckInDate: request.expectedCheckInDate,
        agreementSummary:
          "Monthly rent includes meals, Wi-Fi, and daily housekeeping. 30-day advance checkout notice applies.",
        termsAccepted: false,
      },
    };
    setJoiningRequest(created);
    setTenantState("joining_pending");
    toast.success("Joining request submitted!");
  };

  const resubmitCorrection = (_note: string, updatedPhone?: string, updatedOccupation?: string) => {
    setJoiningRequest((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        status: "Under Review",
        ownerNote: "Thank you for updating your details. The PG owner is reviewing again.",
        correctionField: undefined,
        personalDetails: {
          ...prev.personalDetails,
          mobile: updatedPhone ?? prev.personalDetails.mobile,
          occupation: updatedOccupation ?? prev.personalDetails.occupation,
        },
      };
    });
    toast.success("Updated details sent to owner");
  };

  const simulateJoiningStatus = (
    status: "Under Review" | "More Details Required" | "Approved" | "Rejected"
  ) => {
    setJoiningRequest((prev) => {
      if (!prev) return prev;
      const notes: Record<typeof status, string> = {
        "Under Review": "The PG owner is checking your details and room availability.",
        "More Details Required": "Please confirm your current mobile number and workplace/college name.",
        Approved: "Good news! Your room and bed are ready. Please review and accept the stay terms.",
        Rejected: "Sorry, the requested bed was taken just before your request was reviewed.",
      };
      return {
        ...prev,
        status,
        ownerNote: notes[status],
        correctionField: status === "More Details Required" ? "Occupation & Mobile Number" : undefined,
      };
    });
    if (status === "Approved") {
      setTenantState("joining_approved");
    } else if (status === "Rejected") {
      setTenantState("no_pg");
    } else {
      setTenantState("joining_pending");
    }
    toast.info(`Demo update: Request marked as ${status}`);
  };

  const acceptApprovedTerms = () => {
    if (!joiningRequest) return;
    setJoiningRequest((prev) =>
      prev && prev.confirmedTerms
        ? {
            ...prev,
            status: "Upcoming Check-in",
            confirmedTerms: { ...prev.confirmedTerms, termsAccepted: true },
          }
        : prev
    );
    const pg = MOCK_PGS.find((p) => p.id === joiningRequest.pgId);
    const terms = joiningRequest.confirmedTerms;
    const upcomingStay: ActiveStay = {
      stayId: `stay-${Date.now()}`,
      pgId: joiningRequest.pgId,
      pgName: joiningRequest.pgName,
      pgImage: joiningRequest.pgImage,
      location: joiningRequest.pgLocation,
      address: pg?.address || joiningRequest.pgLocation,
      roomId: joiningRequest.roomId,
      roomTitle: joiningRequest.roomTitle,
      roomNumber: terms?.assignedRoomNumber || "Room 204",
      bedNumber: terms?.assignedBedNumber || "Bed A",
      sharingType: joiningRequest.sharingType,
      isAC: joiningRequest.isAC,
      checkInDate: terms?.confirmedCheckInDate || joiningRequest.expectedCheckInDate,
      monthlyRent: terms?.confirmedRent || joiningRequest.advertisedRent,
      securityDeposit: terms?.confirmedDeposit || joiningRequest.advertisedDeposit,
      rentDueDate: "2026-12-05",
      ownerName: pg?.ownerName || "PG Owner",
      ownerPhone: pg?.ownerPhone || "+91 98490 22310",
      caretakerName: pg?.caretakerName || "Caretaker",
      caretakerPhone: pg?.caretakerPhone || "+91 90001 44521",
    };
    setActiveStay(upcomingStay);
    setTenantState("upcoming_checkin");
    toast.success("Stay terms accepted! Your check-in is scheduled.");
  };

  const simulateCheckInComplete = () => {
    if (!activeStay) return;
    setJoiningRequest((prev) => (prev ? { ...prev, status: "Active" } : prev));
    setTenantState("active_resident");
    setPayments([
      {
        id: `pay-${Date.now()}`,
        stayId: activeStay.stayId,
        monthLabel: "December 2026",
        rentAmount: activeStay.monthlyRent,
        electricityCharge: 0,
        otherCharges: 0,
        totalAmount: activeStay.monthlyRent,
        paidAmount: activeStay.monthlyRent,
        dueDate: "2026-12-05",
        paidDate: new Date().toISOString().split("T")[0],
        status: "Paid",
        method: "UPI (Demo)",
        transactionRef: `DEMO-UPI-${Math.floor(100000 + Math.random() * 900000)}`,
      },
    ]);
    setDocuments((prev) => [
      {
        id: `doc-agree-${Date.now()}`,
        name: `PG Stay Agreement — ${activeStay.pgName}`,
        category: "Agreement",
        date: new Date().toISOString().split("T")[0],
        status: "Issued",
        pgName: activeStay.pgName,
        fileSize: "640 KB",
        description: `Confirmed ${activeStay.roomNumber}, ${activeStay.bedNumber}`,
      },
      ...prev,
    ]);
    toast.success(`Welcome to ${activeStay.pgName}! You are now an active resident.`);
  };

  const payRentMock = (paymentId: string, method: string) => {
    const today = new Date().toISOString().split("T")[0];
    const ref = `DEMO-${method.toUpperCase().slice(0, 4)}-${Math.floor(100000 + Math.random() * 900000)}`;
    setPayments((prev) =>
      prev.map((p) =>
        p.id === paymentId
          ? {
              ...p,
              paidAmount: p.totalAmount,
              status: "Paid",
              paidDate: today,
              method: `${method} (Demo)`,
              transactionRef: ref,
            }
          : p
      )
    );
    const target = payments.find((p) => p.id === paymentId);
    if (target) {
      setDocuments((prev) => [
        {
          id: `doc-rec-${Date.now()}`,
          name: `Rent Receipt — ${target.monthLabel}`,
          category: "Receipt",
          date: today,
          status: "Issued",
          pgName: activeStay?.pgName || "PG Stay",
          fileSize: "195 KB",
          description: `Demo payment receipt (${ref}) for ₹${target.totalAmount}.`,
        },
        ...prev,
      ]);
    }
    toast.success("Demo payment recorded!", {
      description: `Demo receipt ${ref} added to your Documents. No real money transferred.`,
    });
  };

  const submitFoodFeedback = (
    mealType: "Breakfast" | "Lunch" | "Dinner",
    rating: number,
    comment: string
  ) => {
    setFoodFeedbacks((prev) => [
      {
        id: `fb-${Date.now()}`,
        date: new Date().toISOString().split("T")[0],
        mealType,
        rating,
        comment,
      },
      ...prev,
    ]);
    toast.success(`Rated ${mealType} ${rating}/5 stars`);
  };

  const toggleMealOptOut = (date: string, mealType: "Breakfast" | "Lunch" | "Dinner") => {
    setMealOptOuts((prev) => {
      const exists = prev.some((m) => m.date === date && m.mealType === mealType);
      const next = exists
        ? prev.filter((m) => !(m.date === date && m.mealType === mealType))
        : [...prev, { date, mealType }];
      toast.success(
        exists ? `Cancelled opt-out for ${mealType}` : `Opted out of ${mealType} on ${date}`
      );
      return next;
    });
  };

  const createComplaint = (payload: {
    category: ComplaintCategory;
    title: string;
    description: string;
    photoLabel?: string;
  }) => {
    const newItem: ComplaintItem = {
      id: `cmp-${Date.now()}`,
      pgId: activeStay?.pgId || "pg-green-nest",
      category: payload.category,
      title: payload.title,
      description: payload.description,
      photoLabel: payload.photoLabel,
      createdAt: new Date().toISOString().split("T")[0],
      status: "Submitted",
    };
    setComplaints((prev) => [newItem, ...prev]);
    toast.success("Maintenance request submitted");
  };

  const simulateResolveComplaint = (complaintId: string) => {
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === complaintId
          ? {
              ...c,
              status: "Resolved",
              resolutionNote: "Demo Simulation: Caretaker fixed the issue and verified room status.",
            }
          : c
      )
    );
    toast.success("Demo: Complaint marked Resolved");
  };

  const submitCheckoutRequest = (requestedDate: string, reason: string) => {
    if (!activeStay) return;
    const dueTotal = payments
      .filter((p) => p.status !== "Paid")
      .reduce((acc, p) => acc + (p.totalAmount - p.paidAmount), 0);

    const newCheckout: CheckoutRequest = {
      id: `chk-${Date.now()}`,
      stayId: activeStay.stayId,
      pgId: activeStay.pgId,
      pgName: activeStay.pgName,
      roomNumber: activeStay.roomNumber,
      bedNumber: activeStay.bedNumber,
      checkInDate: activeStay.checkInDate,
      requestedCheckoutDate: requestedDate,
      reason,
      noticePeriodDays: 30,
      pendingRent: dueTotal,
      depositAmount: activeStay.securityDeposit,
      deductions: 0,
      refundableDeposit: Math.max(0, activeStay.securityDeposit - dueTotal),
      status: "Under Review",
      submittedAt: new Date().toISOString().split("T")[0],
    };
    setCheckoutRequest(newCheckout);
    setTenantState("checkout_pending");
    toast.success("Checkout request sent to PG owner");
  };

  const simulateApproveCheckout = () => {
    if (!checkoutRequest || !activeStay) return;
    const today = new Date().toISOString().split("T")[0];
    const archivedStay: PastStay = {
      stayId: activeStay.stayId,
      pgId: activeStay.pgId,
      pgName: activeStay.pgName,
      pgImage: activeStay.pgImage,
      location: activeStay.location,
      roomNumber: activeStay.roomNumber,
      sharingType: activeStay.sharingType,
      checkInDate: activeStay.checkInDate,
      checkOutDate: checkoutRequest.requestedCheckoutDate,
      durationLabel: "5 months, 18 days",
      monthlyRent: activeStay.monthlyRent,
      depositRefunded: checkoutRequest.refundableDeposit,
      hasReviewed: false,
    };

    setCheckoutRequest((prev) =>
      prev
        ? {
            ...prev,
            status: "Completed",
            ownerApproval: {
              finalCheckoutDate: prev.requestedCheckoutDate,
              finalCharges: prev.pendingRent,
              settlementStatus: `₹${prev.refundableDeposit.toLocaleString("en-IN")} deposit settled`,
              approvedAt: today,
            },
          }
        : prev
    );
    setPastStays((prev) => [archivedStay, ...prev]);
    setDocuments((prev) => [
      {
        id: `doc-chk-${Date.now()}`,
        name: `Checkout Confirmation — ${activeStay.pgName}`,
        category: "Confirmation",
        date: today,
        status: "Issued",
        pgName: activeStay.pgName,
        fileSize: "275 KB",
        description: `Final room clearance and deposit refund of ₹${checkoutRequest.refundableDeposit}.`,
      },
      ...prev,
    ]);
    setActiveStay(null);
    setTenantState("checked_out");
    toast.success("Demo: Owner approved checkout! You can now join another PG.");
  };

  const submitPGReview = (payload: {
    pgId: string;
    stayId?: string;
    overallRating: number;
    categories: PGReview["categories"];
    comment: string;
    photos?: string[];
  }) => {
    const newReview: PGReview = {
      id: `rev-user-${Date.now()}`,
      pgId: payload.pgId,
      tenantName: user?.fullName || "Verified Tenant",
      stayDuration: "Verified Resident",
      verifiedResident: true,
      date: new Date().toISOString().split("T")[0],
      overallRating: payload.overallRating,
      categories: payload.categories,
      comment: payload.comment,
      photos: payload.photos,
    };
    setSubmittedReviews((prev) => [newReview, ...prev]);
    if (payload.stayId) {
      setPastStays((prev) =>
        prev.map((s) => (s.stayId === payload.stayId ? { ...s, hasReviewed: true } : s))
      );
    }
    toast.success("Thank you! Your verified review has been posted.");
  };

  const switchDemoScenario = (
    scenario:
      | "logged_out"
      | "no_pg"
      | "joining_pending"
      | "joining_approved"
      | "upcoming_checkin"
      | "active_resident"
      | "checkout_pending"
      | "checked_out"
  ) => {
    switch (scenario) {
      case "logged_out":
        setUser(null);
        setActiveStay(null);
        setJoiningRequest(null);
        setCheckoutRequest(null);
        setTenantState("logged_out");
        break;
      case "no_pg":
        setUser(INITIAL_USER);
        setActiveStay(null);
        setJoiningRequest(null);
        setCheckoutRequest(null);
        setTenantState("no_pg");
        break;
      case "joining_pending":
        setUser(INITIAL_USER);
        setActiveStay(null);
        setCheckoutRequest(null);
        setJoiningRequest({ ...INITIAL_JOINING_REQUEST, status: "Under Review" });
        setTenantState("joining_pending");
        break;
      case "joining_approved":
        setUser(INITIAL_USER);
        setActiveStay(null);
        setCheckoutRequest(null);
        setJoiningRequest({
          ...INITIAL_JOINING_REQUEST,
          status: "Approved",
          ownerNote: "Approved! Room 208 (Bed A) is reserved for you. Accept terms to proceed.",
        });
        setTenantState("joining_approved");
        break;
      case "upcoming_checkin":
        setUser(INITIAL_USER);
        setCheckoutRequest(null);
        setJoiningRequest({
          ...INITIAL_JOINING_REQUEST,
          status: "Upcoming Check-in",
          confirmedTerms: {
            ...INITIAL_JOINING_REQUEST.confirmedTerms!,
            termsAccepted: true,
          },
        });
        setActiveStay({
          ...INITIAL_ACTIVE_STAY,
          pgId: "pg-urban-oasis",
          pgName: "Urban Oasis Co-Living",
          pgImage: IMG.urbanOasisExt,
          location: "Koramangala, Bengaluru",
          roomNumber: "Room 208",
          bedNumber: "Bed A",
          checkInDate: "2026-12-01",
          monthlyRent: 10500,
          securityDeposit: 10500,
        });
        setTenantState("upcoming_checkin");
        break;
      case "active_resident":
        setUser(INITIAL_USER);
        setActiveStay(INITIAL_ACTIVE_STAY);
        setJoiningRequest(null);
        setCheckoutRequest(null);
        setPayments(INITIAL_PAYMENTS);
        setTenantState("active_resident");
        break;
      case "checkout_pending":
        setUser(INITIAL_USER);
        setActiveStay(INITIAL_ACTIVE_STAY);
        setJoiningRequest(null);
        setCheckoutRequest({
          id: "chk-demo-1",
          stayId: INITIAL_ACTIVE_STAY.stayId,
          pgId: INITIAL_ACTIVE_STAY.pgId,
          pgName: INITIAL_ACTIVE_STAY.pgName,
          roomNumber: INITIAL_ACTIVE_STAY.roomNumber,
          bedNumber: INITIAL_ACTIVE_STAY.bedNumber,
          checkInDate: INITIAL_ACTIVE_STAY.checkInDate,
          requestedCheckoutDate: "2026-12-15",
          reason: "Relocating to Bengaluru office",
          noticePeriodDays: 30,
          pendingRent: 0,
          depositAmount: 8500,
          deductions: 0,
          refundableDeposit: 8500,
          status: "Under Review",
          submittedAt: "2026-11-16",
        });
        setTenantState("checkout_pending");
        break;
      case "checked_out":
        setUser(INITIAL_USER);
        setActiveStay(null);
        setJoiningRequest(null);
        setCheckoutRequest(null);
        setPastStays([
          {
            stayId: INITIAL_ACTIVE_STAY.stayId,
            pgId: INITIAL_ACTIVE_STAY.pgId,
            pgName: INITIAL_ACTIVE_STAY.pgName,
            pgImage: INITIAL_ACTIVE_STAY.pgImage,
            location: INITIAL_ACTIVE_STAY.location,
            roomNumber: INITIAL_ACTIVE_STAY.roomNumber,
            sharingType: INITIAL_ACTIVE_STAY.sharingType,
            checkInDate: INITIAL_ACTIVE_STAY.checkInDate,
            checkOutDate: "2026-11-18",
            durationLabel: "5 months, 18 days",
            monthlyRent: INITIAL_ACTIVE_STAY.monthlyRent,
            depositRefunded: 8500,
            hasReviewed: false,
          },
          ...INITIAL_PAST_STAYS,
        ]);
        setTenantState("checked_out");
        break;
    }
    toast.success(`Switched scenario: ${scenario.replace(/_/g, " ")}`);
  };

  return (
    <TenantContext.Provider
      value={{
        tenantState,
        user,
        activeStay,
        joiningRequest,
        checkoutRequest,
        payments,
        documents,
        complaints,
        notices,
        pastStays,
        visits,
        savedPgIds,
        foodFeedbacks,
        mealOptOuts,
        submittedReviews,
        language,
        audioGuidanceEnabled,
        t,
        setLanguage,
        setAudioGuidanceEnabled,
        speakGuidance,
        loginDemoUser,
        registerDemoUser,
        logout,
        updateProfile,
        toggleSavedPg,
        scheduleVisit,
        submitJoiningRequest,
        resubmitCorrection,
        acceptApprovedTerms,
        simulateJoiningStatus,
        simulateCheckInComplete,
        payRentMock,
        submitFoodFeedback,
        toggleMealOptOut,
        createComplaint,
        simulateResolveComplaint,
        submitCheckoutRequest,
        simulateApproveCheckout,
        submitPGReview,
        switchDemoScenario,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const ctx = useContext(TenantContext);
  if (!ctx) throw new Error("useTenant must be used inside TenantProvider");
  return ctx;
}
