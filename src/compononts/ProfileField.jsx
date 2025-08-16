// File: /components/ProfileField.jsx
import { Pencil, Save } from "lucide-react";

export default function ProfileField({
  label,
  field,
  value,
  editMode,
  setEditMode,
  onChange,
  type = "text",
}) {
  const isEditing = editMode[field];

  return (
    <div className="bg-white p-4 rounded shadow flex justify-between items-start">
      <div>
        <p className="text-sm font-semibold mb-1">{label}</p>
        {isEditing ? (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(field, e.target.value)}
            className="border px-2 py-1 rounded text-sm w-64"
          />
        ) : (
          <p className="text-sm text-gray-700">{value}</p>
        )}
      </div>

      <button
        onClick={() =>
          setEditMode((prev) => ({
            ...prev,
            [field]: !prev[field],
          }))
        }
        className="text-gray-500 hover:text-black"
      >
        {isEditing ? <Save size={16} /> : <Pencil size={16} />}
      </button>
    </div>
  );
}