import { cn } from "../../lib/utils";

export function Button({ children, onClick, variant = "default", className, ...props }) {
  const base =
    "px-4 py-2 rounded-md text-sm font-medium focus:outline-none transition";
  const styles =
    variant === "default"
      ? "bg-gray-900 text-white hover:bg-gray-700"
      : variant === "secondary"
      ? "bg-gray-100 text-gray-800 hover:bg-gray-200"
      : variant === "ghost"
      ? "text-gray-700 hover:bg-gray-100"
      : "";

  return (
    <button onClick={onClick} className={cn(base, styles, className)} {...props}>
      {children}
    </button>
  );
}
