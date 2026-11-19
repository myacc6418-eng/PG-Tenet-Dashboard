import { BedDouble, Snowflake, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/src/components/ui/button";
import { SafeImage } from "@/src/components/shared/SafeImage";
import { StatusBadge } from "@/src/components/shared/StatusBadge";
import { formatINR } from "@/src/lib/utils";
import { RoomOption } from "@/src/types";

interface RoomCardProps {
  room: RoomOption;
}

export function RoomCard({ room }: RoomCardProps) {
  const isAvailable = room.availableBeds > 0;

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white sm:flex-row">
      <div className="relative aspect-[4/3] w-full shrink-0 bg-[#F1F5F9] sm:w-52 sm:aspect-auto">
        <SafeImage
          src={room.images[0]}
          alt={room.title}
          fallbackLabel={room.title}
          className="h-full w-full"
        />
      </div>

      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h4 className="font-display text-base font-bold text-[#111827]">
                {room.title}
              </h4>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[#6B7280]">
                <span className="inline-flex items-center gap-1">
                  <Users className="h-3.5 w-3.5 text-[#047857]" />
                  {room.sharingType} Sharing
                </span>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1">
                  <Snowflake className="h-3.5 w-3.5 text-[#047857]" />
                  {room.isAC ? "AC" : "Non-AC"}
                </span>
                <span aria-hidden="true">·</span>
                <span>{room.bathroomType} Bath</span>
              </div>
            </div>

            {isAvailable ? (
              <StatusBadge
                label={`${room.availableBeds} bed${room.availableBeds > 1 ? "s" : ""} left`}
                tone="success"
              />
            ) : (
              <StatusBadge label="Sold Out" tone="error" />
            )}
          </div>

          <p className="mt-2.5 text-xs text-[#4B5563]">
            {room.amenities.slice(0, 4).join(" · ")}
          </p>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#F1F5F9] pt-3">
          <div>
            <p className="font-display text-lg font-bold text-[#111827] tabular-nums">
              {formatINR(room.monthlyRent)}
              <span className="text-xs font-normal text-[#6B7280]">
                /month {room.sharingCapacity > 1 ? "per bed" : ""}
              </span>
            </p>
            <p className="text-xs text-[#6B7280] tabular-nums">
              Deposit: {formatINR(room.securityDeposit)}
            </p>
          </div>

          <Button asChild size="sm" variant={isAvailable ? "default" : "outline"}>
            <Link to={`/pg/${room.pgId}/room/${room.id}`}>
              <BedDouble className="h-4 w-4" />
              View Room
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
