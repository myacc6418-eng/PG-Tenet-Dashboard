import { useState } from "react";
import { Utensils } from "lucide-react";
import { PageHeader } from "@/src/components/shared/PageHeader";
import { RatingStars } from "@/src/components/shared/RatingStars";
import { SafeImage } from "@/src/components/shared/SafeImage";
import { StatusBadge } from "@/src/components/shared/StatusBadge";
import { Button } from "@/src/components/ui/button";
import { MobileSheet } from "@/src/components/ui/sheet";
import { Switch } from "@/src/components/ui/switch";
import { useTenant } from "@/src/context/TenantContext";
import { MOCK_PGS } from "@/src/data/mockData";

export function FoodMessScreen() {
  const {
    activeStay,
    foodFeedbacks,
    mealOptOuts,
    submitFoodFeedback,
    toggleMealOptOut,
  } = useTenant();

  const pg = MOCK_PGS.find((p) => p.id === activeStay?.pgId) || MOCK_PGS[0];
  const [dayIdx, setDayIdx] = useState(2); // Wednesday default
  const [feedbackMeal, setFeedbackMeal] = useState<
    "Breakfast" | "Lunch" | "Dinner" | null
  >(null);
  const [stars, setStars] = useState(4);
  const [comment, setComment] = useState("");

  const activeDayMenu = pg.weeklyMenu[dayIdx] || pg.weeklyMenu[0];
  const tomorrowDate = "2026-11-19";

  const handleSaveFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackMeal) return;
    submitFoodFeedback(feedbackMeal, stars, comment);
    setComment("");
    setStars(4);
    setFeedbackMeal(null);
  };

  return (
    <div className="pb-16">
      <PageHeader title="Food & Mess" subtitle={pg.name} />

      <div className="mx-auto mt-5 max-w-5xl space-y-6 px-4 sm:px-6">
        {/* Day Selector */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="no-scrollbar flex gap-1.5 overflow-x-auto pb-1">
            {pg.weeklyMenu.map((d, idx) => (
              <button
                key={d.day}
                type="button"
                onClick={() => setDayIdx(idx)}
                className={`min-h-[42px] shrink-0 rounded-xl px-4 text-xs font-semibold cursor-pointer ${
                  dayIdx === idx
                    ? "bg-[#047857] text-white"
                    : "border border-[#E5E7EB] bg-white text-[#374151]"
                }`}
              >
                {d.day}
              </button>
            ))}
          </div>
          <StatusBadge label="Veg & Optional Non-Veg" tone="success" />
        </div>

        {/* 3 Meals Grid */}
        <div className="grid gap-5 md:grid-cols-3">
          {(
            [
              { type: "Breakfast" as const, slot: activeDayMenu.breakfast },
              { type: "Lunch" as const, slot: activeDayMenu.lunch },
              { type: "Dinner" as const, slot: activeDayMenu.dinner },
            ] as const
          ).map(({ type, slot }) => {
            const isOptedOut = mealOptOuts.some(
              (m) => m.date === tomorrowDate && m.mealType === type
            );
            return (
              <article
                key={type}
                className="flex flex-col overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white"
              >
                <div className="aspect-[16/10] w-full bg-[#F1F5F9]">
                  <SafeImage
                    src={slot.image}
                    alt={slot.title}
                    fallbackLabel={slot.title}
                    className="h-full w-full"
                  />
                </div>

                <div className="flex flex-1 flex-col justify-between p-4">
                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold text-[#047857]">
                      <span className="inline-flex items-center gap-1">
                        <Utensils className="h-3.5 w-3.5" />
                        {type}
                      </span>
                      <span className="text-[#6B7280] font-normal">{slot.time}</span>
                    </div>

                    <h2 className="mt-1.5 font-display text-lg font-bold text-[#111827]">
                      {slot.title}
                    </h2>

                    <ul className="mt-2.5 space-y-1 text-xs text-[#4B5563]">
                      {slot.items.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>

                    {slot.nonVegOption && (
                      <p className="mt-2.5 rounded-lg bg-[#FEF3C7] px-2.5 py-1.5 text-[11px] font-semibold text-[#92400E]">
                        Non-veg option: {slot.nonVegOption}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 space-y-3 border-t border-[#F1F5F9] pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-[#374151]">
                        Opt out for tomorrow
                      </span>
                      <Switch
                        checked={isOptedOut}
                        onCheckedChange={() => toggleMealOptOut(tomorrowDate, type)}
                      />
                    </div>

                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full"
                      onClick={() => setFeedbackMeal(type)}
                    >
                      Rate {type}
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Recent Feedback */}
        {foodFeedbacks.length > 0 && (
          <section className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
            <h2 className="font-display text-base font-bold text-[#111827]">
              Your Meal Feedback
            </h2>
            <div className="mt-3 space-y-3">
              {foodFeedbacks.map((fb) => (
                <div
                  key={fb.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[#F8FAFC] p-3.5 text-sm"
                >
                  <div>
                    <p className="font-bold text-[#111827]">{fb.mealType}</p>
                    {fb.comment && (
                      <p className="text-xs text-[#4B5563]">{fb.comment}</p>
                    )}
                  </div>
                  <RatingStars rating={fb.rating} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Meal Feedback Sheet */}
      <MobileSheet
        open={Boolean(feedbackMeal)}
        onOpenChange={(o) => !o && setFeedbackMeal(null)}
        title={`Rate ${feedbackMeal || "Meal"}`}
        description="Your rating helps the PG kitchen improve taste and quality."
      >
        <form onSubmit={handleSaveFeedback} className="space-y-4">
          <div>
            <p className="mb-2 text-sm font-semibold text-[#111827]">Your Rating</p>
            <RatingStars
              rating={stars}
              interactive
              onChange={setStars}
              size="lg"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-[#111827]">
              Comments (Optional)
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Was the food fresh, warm, and well spiced?"
              className="w-full rounded-xl border border-[#E5E7EB] p-3.5 text-sm"
            />
          </div>
          <Button type="submit" size="lg" className="w-full">
            Submit Meal Feedback
          </Button>
        </form>
      </MobileSheet>
    </div>
  );
}
