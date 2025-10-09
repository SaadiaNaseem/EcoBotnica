// src/components/ProfileForm.jsx
import React, { useState, useEffect, useRef } from "react";
import api from "../api/axios";
import { MoreVertical } from "lucide-react";

const initialState = {
  fullName: "",
  nickName: "",
  gender: "",
  country: "",
  language: "",
  timeZone: "",
  gardeningExperience: "",
  favoritePlant: "",
  email: "",
  profileImage: null,
};

const timeZonesByCountry = {
  USA: "GMT-5",
  Pakistan: "GMT+5",
  India: "GMT+5:30",
  UK: "GMT+0",
  Australia: "GMT+10",
};

const languages = ["English", "Urdu", "Hindi", "French", "Spanish"];

const ProfileForm = () => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [popup, setPopup] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const formRef = useRef(null);

  // fetch user & profile, then merge (profile wins but fallback to user)
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("⚠️ No token found, user not logged in.");
        return;
      }

      console.log("🔄 Fetching user and profile...");
      // run both requests in parallel and handle possible failures individually
      const [userRes, profileRes] = await Promise.allSettled([
        api.get("/user/me"),
        api.get("/profile/me"),
      ]);

      const userObj =
        userRes.status === "fulfilled"
          ? userRes.value.data?.user || userRes.value.data
          : null;

      const profileObj =
        profileRes.status === "fulfilled" && profileRes.value.data?.profile
          ? profileRes.value.data.profile
          : null;

      // base from initialState, then user, then profile
      const base = { ...initialState };
      if (userObj) {
        base.fullName = userObj.name || base.fullName;
        base.email = userObj.email || base.email;
      }

      if (profileObj) {
        // profile fields override user fields, but fallback to user for email/name
        const merged = {
          ...base,
          ...profileObj,
          profileImage: null,
          fullName: profileObj.fullName || base.fullName,
          email: profileObj.email || base.email,
        };
        setFormData(merged);
        if (profileObj?.profileImage?.url) {
          setImagePreview(profileObj.profileImage.url);
        } else {
          setImagePreview(null);
        }
        setIsEditable(false);
      } else {
        // no profile -> prefill with user data
        setFormData(base);
        setImagePreview(null);
        setIsEditable(true);
      }

      console.log("📥 Completed fetch: user:", !!userObj, "profile:", !!profileObj);
    } catch (err) {
      console.error("❌ Failed to fetch data:", err.response?.data || err.message);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  };

  useEffect(() => {
    fetchData();
    // cleanup on unmount - revoke blob URL if any
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(imagePreview);
        } catch (e) {
          /* ignore */
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = "Required";
    if (!formData.email) newErrors.email = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files && files[0]) {
      // revoke previous blob if it was created
      if (imagePreview && imagePreview.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(imagePreview);
        } catch (e) {}
      }
      const file = files[0];
      setFormData((prev) => ({ ...prev, [name]: file }));
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      return;
    }

    const updatedData = { ...formData, [name]: value };
    if (name === "country" && timeZonesByCountry[value]) {
      updatedData.timeZone = timeZonesByCountry[value];
    }
    setFormData(updatedData);
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    if (e && typeof e.preventDefault === "function") e.preventDefault();
    // clear previous errors
    setErrors({});
    if (!validate()) {
      // show visible message + focus first invalid field
      const first = Object.keys(errors)[0] || "fullName";
      const el = formRef.current?.querySelector(`[name="${first}"]`);
      if (el) el.focus();
      alert("Please fill required fields (see highlighted inputs).");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You are not logged in!");
        return;
      }

      const payload = new FormData();

      // Append all fields intelligently
      Object.entries(formData).forEach(([key, value]) => {
        if (value === null || value === undefined) return;

        if (key === "profileImage") {
          // If it's a File, append it. If it's a URL/string, skip (backend expects file)
          if (value instanceof File) {
            payload.append(key, value);
          }
          return;
        }

        if (typeof value === "object") {
          // for safety stringify objects (if any)
          try {
            payload.append(key, JSON.stringify(value));
          } catch (err) {
            // fallback to empty string
            payload.append(key, "");
          }
          return;
        }

        payload.append(key, value);
      });

      // disabled inputs (fullName/email) won't be sent by form; force-include them:
      payload.set("fullName", formData.fullName || "");
      payload.set("email", formData.email || "");

      // Debugging output
      console.log("📤 Profile payload entries:");
      for (let pair of payload.entries()) {
        console.log(pair[0], ":", pair[1]);
      }

      const res = await api.post("/profile", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("✅ Save profile response:", res.data);
      if (res.data?.success) {
        setPopup(true);
        setIsEditable(false);
        // re-fetch to ensure what server saved is shown (and to get final image url)
        await fetchData();
        setTimeout(() => setPopup(false), 2000);
      } else {
        alert(res.data?.message || "Could not save profile");
      }
    } catch (err) {
      console.error("❌ Failed to save profile:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Save failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your profile?")) return;
    try {
      await api.delete("/profile");
      alert("Profile deleted successfully!");
      window.location.reload();
    } catch (err) {
      console.error("Failed to delete profile:", err.response?.data || err.message);
      alert("Delete failed");
    }
  };

  return (
    <div className="bg-white text-gray-800 rounded-lg shadow p-6 w-full max-w-4xl mx-auto mt-2 relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          {formData.fullName ? `Welcome, ${formData.fullName}` : "Welcome, User"}
        </h2>

        <div className="flex items-center gap-2">
          {/* Use requestSubmit from header button so it triggers the form's onSubmit reliably */}
          <button
            type="button"
            className="bg-black text-white px-4 py-2 rounded hover:opacity-90 disabled:opacity-50"
            onClick={() => formRef.current?.requestSubmit?.()}
            disabled={loading || !isEditable}
          >
            {loading ? "Saving..." : "Save"}
          </button>

          <div className="relative">
            <button
              onClick={() => setMenuOpen((s) => !s)}
              className="p-2 rounded-full hover:bg-gray-200"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 bg-white shadow-md rounded-lg border w-36 z-10">
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => {
                    setIsEditable(true);
                    setMenuOpen(false);
                  }}
                >
                  Edit Profile
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                  onClick={() => {
                    setMenuOpen(false);
                    handleDelete();
                  }}
                >
                  Delete Profile
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {popup && (
        <div className="bg-green-200 text-green-800 px-4 py-2 mb-4 rounded">
          Details saved successfully!
        </div>
      )}

      <form
        id="profileForm"
        ref={formRef}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        onSubmit={handleSubmit}
      >
        <div className="sm:col-span-2 flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-4">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Profile Preview"
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center text-sm text-gray-600">
              No Image
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            name="profileImage"
            onChange={handleChange}
            disabled={!isEditable}
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            disabled
            className="bg-gray-100 border border-gray-300 rounded px-3 py-2"
          />
          {errors.fullName && <div className="text-red-600 text-sm mt-1">{errors.fullName}</div>}
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium">Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            disabled
            className="bg-gray-100 border border-gray-300 rounded px-3 py-2"
          />
          {errors.email && <div className="text-red-600 text-sm mt-1">{errors.email}</div>}
        </div>

        {[
          { label: "Nick Name", name: "nickName" },
          { label: "Country", name: "country" },
          { label: "Time Zone", name: "timeZone", type: "text", disabled: true },
          { label: "Gardening Experience", name: "gardeningExperience" },
          { label: "Favorite Plant", name: "favoritePlant" },
        ].map(({ label, name, type = "text", disabled = false }) => (
          <div key={name} className="flex flex-col">
            <label className="mb-1 font-medium">{label}</label>
            <input
              type={type}
              name={name}
              disabled={disabled || !isEditable}
              value={formData[name] || ""}
              onChange={handleChange}
              className={`border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black ${
                disabled || !isEditable ? "bg-gray-100" : ""
              }`}
            />
          </div>
        ))}

        <div className="flex flex-col">
          <label className="mb-1 font-medium">Gender</label>
          <select
            name="gender"
            value={formData.gender || ""}
            onChange={handleChange}
            disabled={!isEditable}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium">Language</label>
          <select
            name="language"
            value={formData.language || ""}
            onChange={handleChange}
            disabled={!isEditable}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="">Select Language</option>
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;