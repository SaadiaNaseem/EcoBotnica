import { useMemo, useState } from "react";
import { NotificationCard } from "../compononts/notifications/NotificationCard";
import { RevealOnScroll } from "../compononts/notifications/RevealOnScroll";
import { ConfirmDeleteDialog } from "../compononts/notifications/ConfirmDeleteDialog";
import { Button } from "../compononts/ui/Button";
import Title from '../compononts/Title';
import { useNotifications } from "../context/NotificationContext";

export default function NotificationsPage() {
  const { notifications, deleteNotification, loading } = useNotifications();
  const [filter, setFilter] = useState("all");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);

  const filtered = useMemo(() => {
    if (filter === "all") return notifications;
    return notifications.filter((n) => n.category === filter);
  }, [notifications, filter]);

  const requestDelete = (item) => {
    setPendingDelete(item);
    setConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (!pendingDelete) return;
    deleteNotification(pendingDelete._id);
    setConfirmOpen(false);
    setPendingDelete(null);
  };

  const handleClick = (item) => {
    window.location.href = item.href;
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 md:py-10 lg:py-12">
      <section className="mb-6 md:mb-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-2xl mb-4">
              <Title text1="NOTIFICATION" text2="." />
            </div>
            <p className="mt-1 text-sm text-gray-500 md:text-base">
              Plant care and weather alerts — all in one place.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-5 flex flex-wrap items-center gap-2">
        {["all", "plant-care", "weather"].map((cat) => (
          <Button
            key={cat}
            variant={filter === cat ? "default" : "secondary"}
            onClick={() => setFilter(cat)}
          >
            {cat === "all"
              ? "All"
              : cat === "plant-care"
              ? "Plant Care"
              : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </Button>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <p>Loading notifications...</p>
        ) : filtered.length > 0 ? (
          filtered.map((item, idx) => (
            <RevealOnScroll key={item._id} idx={idx}>
              <NotificationCard
                item={{
                  id: item._id,
                  ...item,
                  date: new Date(item.date).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                }}
                onClick={handleClick}
                onDelete={requestDelete}
              />
            </RevealOnScroll>
          ))
        ) : (
          <div className="mt-10 rounded-lg border bg-white p-8 text-center shadow-sm">
            <p className="text-sm text-gray-500">
              No notifications here. Try switching the filter.
            </p>
          </div>
        )}
      </section>

      <ConfirmDeleteDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete this notification?"
        description={
          pendingDelete
            ? `${pendingDelete.title} — from ${pendingDelete.sender}`
            : "This action cannot be undone."
        }
        onConfirm={confirmDelete}
      />
    </main>
  );
}
