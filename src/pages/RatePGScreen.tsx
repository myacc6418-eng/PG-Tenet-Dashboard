import { useState } from "react";
import { Camera, CheckCircle2, Star } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "@/src/components/shared/PageHeader";
import { RatingStars } from "@/src/components/shared/RatingStars";
import { StatusBadge } from "@/src/components/shared/StatusBadge";
import { Button } from "@/src/components/ui/button";
import { useTenant } from "@/src/context/TenantContext";
import { MOCK_PGS } from "@/src/data/mockData";

export function RatePGScreen() {
  const { pgId } = useParams<{ pgId?: string }>();
  const { activeStay, pastStays, submittedReviews, submitPGReview } = useTenant();
  const navigate = useNavigate();

  const targetPgId = pgId || activeStay?.pgId || pastStays[0]?.pgId || "pg-green-nest";
  const targetPg = MOCK_PGS.find((p) => p.id === targetPgId) || MOCK_PGS[0];
  const matchingPastStay = pastStays.find((s) => s.pgId === targetPg.id);
  const alreadyReviewed =
    Boolean(matchingPastStay?.hasReviewed) ||
    submittedReviews.some((r) => r.pgId === targetPg.id);

  const [overall, setOverall] = useState(5);
  const [cleanliness, setCleanliness] = useState(5);
  const [food, setFood] = useState(4);
  const [comfort, setComfort] = useState(5);
  const [wifi, setWifi] = useState(5);
  const [security, setSecurity] = useState(5);
  const [management, setManagement] = useState(5);
  const [comment, setComment] = useState("");
  const [photoAdded, setPhotoAdded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    submitPGReview({
      pgId: targetPg.id,
      stayId: matchingPastStay?.stayId,
      overallRating: overall,
      categories: { cleanliness, food, comfort, wifi, security, management },
      comment: comment.trim(),
      photos: photoAdded ? [targetPg.images[0]] : undefined,
    });
    navigate(`/pg/${targetPg.id}`);
  };

  return (
    <div className="pb-16">
      <PageHeader title={`Rate ${targetPg.name}`} subtitle="Verified Resident Review" />

      <div className="mx-auto mt-5 max-w-2xl px-4 sm:px-6">
        {alreadyReviewed ? (
          <div className="rounded-2xl border border-[#A7F3D0] bg-white p-6 text-center">
            <CheckCircle2 className="mx-auto h-10 w-10 text-[#047857]" />
            <h2 className="mt-3 font-display text-lg font-bold text-[#111827]">
              You already reviewed {targetPg.name}
            </h2>
            <p className="mt-1 text-sm text-[#6B7280]">
              Only one verified review is allowed per stay to keep ratings honest.
            </p>
            <Button
              className="mt-4"
              onClick={() => navigate(`/pg/${targetPg.id}`)}
            >
              View PG Reviews
            </Button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-5 rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:p-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="font-display text-xl font-bold text-[#111827]">
                  How was your stay?
                </h2>
                <p className="text-xs text-[#6B7280]">
                  {targetPg.area}, {targetPg.city}
                </p>
              </div>
              <StatusBadge label="Verified Resident" tone="success" />
            </div>

            <div>
              <p className="mb-1.5 text-sm font-bold text-[#111827]">
                Overall Experience
              </p>
              <RatingStars rating={overall} interactive onChange={setOverall} size="lg" />
            </div>

            <div className="grid gap-3 border-t border-[#F1F5F9] pt-4 sm:grid-cols-2">
              {[
                { label: "Cleanliness", val: cleanliness, set: setCleanliness },
                { label: "Food Quality", val: food, set: setFood },
                { label: "Room Comfort", val: comfort, set: setComfort },
                { label: "Wi-Fi & Facilities", val: wifi, set: setWifi },
                { label: "Security", val: security, set: setSecurity },
                { label: "Management", val: management, set: setManagement },
              ].map((cat) => (
                <div
                  key={cat.label}
                  className="flex items-center justify-between rounded-xl bg-[#F8FAFC] px-3.5 py-2"
                >
                  <span className="text-xs font-semibold text-[#111827]">
                    {cat.label}
                  </span>
                  <RatingStars
                    rating={cat.val}
                    interactive
                    onChange={cat.set}
                    size="sm"
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-bold text-[#111827]">
                Your Review
              </label>
              <textarea
                rows={4}
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share what future tenants should know about rooms, food, Wi-Fi, and management..."
                className="w-full rounded-xl border border-[#E5E7EB] p-3.5 text-sm"
              />
            </div>

            <div className="flex items-center justify-between rounded-xl border border-[#E5E7EB] p-3">
              <span className="text-xs text-[#4B5563]">
                {photoAdded ? "Room photo attached (Demo)" : "Add optional room photo"}
              </span>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => setPhotoAdded((p) => !p)}
              >
                <Camera className="h-4 w-4" />
                {photoAdded ? "Remove Photo" : "Add Photo"}
              </Button>
            </div>

            <Button type="submit" size="lg" className="w-full">
              <Star className="h-4 w-4" />
              Publish Verified Review
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
