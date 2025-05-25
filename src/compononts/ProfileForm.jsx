import React, { useState } from "react";

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

const ProfileForm = () => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [popup, setPopup] = useState(false);
  const [isEditable, setIsEditable] = useState(true);

  const validate = () => {
    const newErrors = {};
    for (const field in formData) {
      if (!formData[field] && field !== "profileImage") {
        newErrors[field] = "This field is required";
      }
    }
    if (!formData.email.includes("@")) {
      newErrors.email = "Enter a valid email";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
      setImagePreview(URL.createObjectURL(files[0]));
    } else {
      const updatedData = { ...formData, [name]: value };
      if (name === "country" && timeZonesByCountry[value]) {
        updatedData.timeZone = timeZonesByCountry[value];
      }
      setFormData(updatedData);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setPopup(true);
      setIsEditable(false);
      setTimeout(() => setPopup(false), 2500);
    }
  };

  return (
    <div className="bg-white text-gray-800 rounded-lg shadow p-6 w-full max-w-4xl mx-auto mt-2">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          {formData.fullName ? `Welcome, ${formData.fullName}` : "Welcome, User"}
        </h2>
        <div className="flex gap-2">
          <button
            className="bg-black text-white px-4 py-2 rounded hover:opacity-90"
            onClick={handleSubmit}
          >
            Save
          </button>
          <button
            className="bg-black text-white px-4 py-2 rounded hover:opacity-90"
            type="button"
            onClick={() => setIsEditable(true)}
          >
            Edit
          </button>
        </div>
      </div>

      {popup && (
        <div className="bg-green-200 text-green-800 px-4 py-2 mb-4 rounded">
          Details saved successfully!
        </div>
      )}

      <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Profile Image */}
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

        {[ 
          { label: "Full Name", name: "fullName" },
          { label: "Nick Name", name: "nickName" },
          { label: "Country", name: "country" },
          { label: "Language", name: "language" },
          { label: "Time Zone", name: "timeZone", type: "text", disabled: true },
          { label: "Gardening Experience", name: "gardeningExperience" },
          { label: "Favorite Plant", name: "favoritePlant" },
          { label: "Email Address", name: "email", type: "email" },
        ].map(({ label, name, type = "text", disabled = false }) => (
          <div key={name} className="flex flex-col">
            <label className="mb-1 font-medium">{label}</label>
            <input
              type={type}
              name={name}
              disabled={disabled || !isEditable}
              value={formData[name]}
              onChange={handleChange}
              className={`border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black ${disabled || !isEditable ? 'bg-gray-100' : ''}`}
            />
            {errors[name] && (
              <p className="text-red-600 text-sm mt-1">{errors[name]}</p>
            )}
          </div>
        ))}

        {/* Gender Dropdown */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            disabled={!isEditable}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && (
            <p className="text-red-600 text-sm mt-1">{errors.gender}</p>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
