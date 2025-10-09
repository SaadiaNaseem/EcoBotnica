import { CategoryBadge } from "./CategoryBadge";
import { Button } from "../ui/Button";
import { Trash2, CloudSun, Users, Leaf, Bell } from "lucide-react";
import { cn } from "../../lib/utils";
import { deleteNotification } from "../../api/notificationApi.js"; // import API

export function NotificationCard({ item, onClick, className, onDeleted }) {
  const Icon =
    item.category === "plant-care"
      ? Leaf
      : item.category === "community"
      ? Users
      : CloudSun;

  // Handler for delete
  const handleDelete = async (e) => {
    e.stopPropagation(); // prevent triggering onClick for card
    if (!item._id) return;

    const confirmDelete = window.confirm("Are you sure you want to delete this notification?");
    if (!confirmDelete) return;

    const res = await deleteNotification(item._id);
    if (res) {
      // Optionally, notify parent to remove from local state
      onDeleted?.(item._id);
    }
  };

  return (
    <article
      onClick={() => onClick?.(item)}
      className={cn(
        "relative w-full cursor-pointer rounded-lg border bg-white p-4 shadow-sm transition hover:shadow-md hover:-translate-y-0.5",
        className
      )}
    >
      <div className="absolute right-2 top-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDelete}
          className="h-8 w-8 rounded-full hover:bg-gray-100"
        >
          <Trash2 className="h-4 w-4 text-gray-700" />
        </Button>
      </div>

      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-100">
          <Icon className="h-5 w-5 text-gray-700" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold">{item.title}</h3>
            <CategoryBadge category={item.category} />
          </div>
          <p className="mt-1 text-sm text-gray-600">
            <span className="font-medium">{item.sender}:</span> {item.content}
          </p>
          <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
            <Bell className="h-3.5 w-3.5" />
            <time>{item.date}</time>
          </div>
        </div>
      </div>
    </article>
  );
}
