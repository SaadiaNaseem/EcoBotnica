import React, { useState } from "react";
import Title from '../compononts/Title';

const AddNewPlantProfile = () => {
    const [plantData, setPlantData] = useState({
        image: null,
        name: "",
        scientificName: "",
        location: "",
        seasons: "",
        toxicity: "",
        environmentIndoor: "",
        environmentOutdoor: "",
        disease: "",
        treatment: "",
        lastCheckup: "",
    });

    const [preview, setPreview] = useState(null);
    const [plantList, setPlantList] = useState([]);
    const [showDialog, setShowDialog] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPlantData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setPlantData((prev) => ({ ...prev, image: file }));
        setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Required fields check
        const requiredFields = ['image', 'name', 'scientificName', 'location', 'seasons', 'toxicity'];
        for (let field of requiredFields) {
            if (!plantData[field]) {
                alert("Please fill all required fields: Image, Name, Scientific Name, Location, Seasons, Toxicity");
                return;
            }
        }

        // Fill optional fields with "Unknown" if empty
        const updatedPlant = {
            ...plantData,
            environmentIndoor: plantData.environmentIndoor || "Unknown",
            environmentOutdoor: plantData.environmentOutdoor || "Unknown",
            disease: plantData.disease || "Unknown",
            treatment: plantData.treatment || "Unknown",
            lastCheckup: plantData.lastCheckup || "Unknown",
        };

        // Save to local state (or later to backend)
        setPlantList([...plantList, updatedPlant]);

        // Reset form
        setPlantData({
            image: null,
            name: "",
            scientificName: "",
            location: "",
            seasons: "",
            toxicity: "",
            environmentIndoor: "",
            environmentOutdoor: "",
            disease: "",
            treatment: "",
            lastCheckup: "",
        });
        setPreview(null);

        // Show success dialog
        setShowDialog(true);
    };

    return (
        <div className="max-w-3xl mx-auto p-6">
            <div className="text-2xl mb-4">
                <Title text1="ADD NEW" text2="PLANT" />
            </div>

            <form
                className="grid grid-cols-1 gap-4 bg-white shadow-md rounded-lg p-6"
                onSubmit={handleSubmit}
            >
                {/* Image Upload */}
                <div>
                    <label className="block font-medium mb-1">Upload Plant Image *</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="border p-2 rounded w-full"
                    />
                    {preview && (
                        <img
                            src={preview}
                            alt="Preview"
                            className="mt-2 h-40 w-auto object-cover rounded"
                        />
                    )}
                </div>

                {/* Inputs */}
                {[
                    { name: "name", label: "Plant Name *" },
                    { name: "scientificName", label: "Scientific Name *" },
                    { name: "location", label: "Location (Indoor / Outdoor / Both) *" },
                    { name: "seasons", label: "Seasons *" },
                    { name: "toxicity", label: "Toxicity *" },
                    { name: "environmentIndoor", label: "Indoor Environment" },
                    { name: "environmentOutdoor", label: "Outdoor Environment" },
                    { name: "disease", label: "Disease (Optional)" },
                    { name: "treatment", label: "Treatment (Optional)" },
                    { name: "lastCheckup", label: "Last Checkup Date (Optional)" },
                ].map((field) => (
                    <div key={field.name}>
                        <label className="block font-medium mb-1">{field.label}</label>
                        <input
                            type={field.name === "lastCheckup" ? "date" : "text"}
                            name={field.name}
                            value={plantData[field.name]}
                            onChange={handleInputChange}
                            className="border p-2 rounded w-full"
                        />
                    </div>
                ))}

                {/* Buttons */}
                <div className="flex justify-between items-center mt-6">
                    {/* Cancel Button */}
                    <button
                        type="button"
                        className="px-5 py-2 rounded-full bg-gray-200 text-black text-sm"
                        onClick={() => console.log("Cancelled")} // replace later with navigate
                    >
                        Cancel
                    </button>

                    {/* Add Plant Button */}
                    <button
                        type="submit"
                        className="px-5 py-2 rounded-full bg-black text-white text-sm"
                    >
                        Add Plant
                    </button>
                </div>
            </form>

            {/* Success Dialog */}
            {showDialog && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-2xl p-6 w-80 text-center shadow-lg">
                        <p className="text-lg font-semibold mb-4">Plant added successfully to database!</p>
                        <button
                            onClick={() => setShowDialog(false)}
                            className="bg-black text-white px-6 py-2 rounded-full"
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddNewPlantProfile;