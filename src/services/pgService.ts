import { MOCK_PGS } from "@/src/data/mockData";
import {
  ActiveStay,
  PGGenderType,
  PGProperty,
  RoomOption,
  SharingType,
  TenantLifecycleState,
} from "@/src/types";

export interface PGFilterParams {
  search?: string;
  city?: string;
  area?: string;
  maxRent?: number;
  minRent?: number;
  genderType?: PGGenderType | "All";
  sharingTypes?: SharingType[];
  acOnly?: boolean | null;
  foodIncluded?: boolean;
  amenities?: string[];
  availableOnly?: boolean;
  minRating?: number;
  sortBy?: "recommended" | "rent_low" | "rent_high" | "rating";
}

export const pgService = {
  async listPGs(filters?: PGFilterParams): Promise<PGProperty[]> {
    let items = [...MOCK_PGS];

    if (filters?.search?.trim()) {
      const q = filters.search.trim().toLowerCase();
      items = items.filter(
        (pg) =>
          pg.name.toLowerCase().includes(q) ||
          pg.area.toLowerCase().includes(q) ||
          pg.city.toLowerCase().includes(q) ||
          pg.address.toLowerCase().includes(q)
      );
    }

    if (filters?.city && filters.city !== "All") {
      items = items.filter((pg) => pg.city === filters.city);
    }

    if (filters?.area && filters.area !== "All") {
      items = items.filter((pg) => pg.area === filters.area);
    }

    if (filters?.genderType && filters.genderType !== "All") {
      items = items.filter((pg) => pg.genderType === filters.genderType);
    }

    if (filters?.maxRent) {
      items = items.filter((pg) => pg.startingRent <= filters.maxRent!);
    }

    if (filters?.minRent) {
      items = items.filter((pg) => pg.startingRent >= filters.minRent!);
    }

    if (filters?.sharingTypes && filters.sharingTypes.length > 0) {
      items = items.filter((pg) =>
        pg.rooms.some((room) => filters.sharingTypes!.includes(room.sharingType))
      );
    }

    if (filters?.acOnly === true) {
      items = items.filter((pg) => pg.rooms.some((r) => r.isAC));
    } else if (filters?.acOnly === false) {
      items = items.filter((pg) => pg.rooms.some((r) => !r.isAC));
    }

    if (filters?.foodIncluded) {
      items = items.filter((pg) => pg.foodIncluded);
    }

    if (filters?.amenities && filters.amenities.length > 0) {
      items = items.filter((pg) =>
        filters.amenities!.every((a) => pg.amenities.includes(a as any))
      );
    }

    if (filters?.availableOnly) {
      items = items.filter((pg) => pg.availableBeds > 0);
    }

    if (filters?.minRating) {
      items = items.filter((pg) => pg.rating >= filters.minRating!);
    }

    switch (filters?.sortBy) {
      case "rent_low":
        items.sort((a, b) => a.startingRent - b.startingRent);
        break;
      case "rent_high":
        items.sort((a, b) => b.startingRent - a.startingRent);
        break;
      case "rating":
        items.sort((a, b) => b.rating - a.rating);
        break;
      default:
        items.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    return items;
  },

  async getPGById(pgId: string): Promise<PGProperty | undefined> {
    return MOCK_PGS.find((pg) => pg.id === pgId);
  },

  async getRoomById(
    pgId: string,
    roomId: string
  ): Promise<{ pg: PGProperty; room: RoomOption } | undefined> {
    const pg = MOCK_PGS.find((p) => p.id === pgId);
    if (!pg) return undefined;
    const room = pg.rooms.find((r) => r.id === roomId);
    if (!room) return undefined;
    return { pg, room };
  },
};

export function evaluateJoinEligibility(
  tenantState: TenantLifecycleState,
  activeStay: ActiveStay | null,
  targetPgId: string
): {
  allowed: boolean;
  reason?: "logged_out" | "already_active_other_pg" | "checkout_in_progress" | "same_pg_active" | "pending_request";
} {
  if (tenantState === "logged_out") {
    return { allowed: false, reason: "logged_out" };
  }

  if (
    tenantState === "active_resident" ||
    tenantState === "upcoming_checkin"
  ) {
    if (activeStay && activeStay.pgId === targetPgId) {
      return { allowed: false, reason: "same_pg_active" };
    }
    return { allowed: false, reason: "already_active_other_pg" };
  }

  if (
    tenantState === "checkout_requested" ||
    tenantState === "checkout_pending"
  ) {
    return { allowed: false, reason: "checkout_in_progress" };
  }

  if (
    tenantState === "joining_pending" ||
    tenantState === "joining_approved"
  ) {
    return { allowed: false, reason: "pending_request" };
  }

  return { allowed: true };
}
