import { cn } from "../../lib/utils";

export function CategoryBadge({ category, className }) {
  const label =
    category === "plant-care"
      ? "Plant Care"
      : category === "community"
      ? "Community"
      : "Weather";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700",
        className
      )}
    >
      {label}
    </span>
  );
}
