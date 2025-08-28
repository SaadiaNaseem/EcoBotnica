// File: /pages/PlantProfile.jsx
import { useState } from "react";
import { assets } from "../assets/assets";
import { Pencil } from "lucide-react";
import ProfileField from "../compononts/ProfileField";
import Title from '../compononts/Title';

export default function PlantProfile() {
  const [plantData, setPlantData] = useState({
    name: "Bird of Paradise",
    scientificName: "Strelitzia reginae",
    location: "Both",
    seasons: "Spring and Summer",
    toxicity: "Mildly toxic to pets (cats and dogs)",
    environmentIndoor:
      "Bright, indirect sunlight, allow soil to dry between waterings",
    environmentOutdoor:
      "Full sun, well-drained soil, tropical or subtropical climates",
    disease: "Leaf blight",
    treatment: "Trim affected leaves, apply fungicide",
    lastCheckup: "2025-07-28",
  });

  const [editMode, setEditMode] = useState({});

  const handleChange = (key, value) => {
    setPlantData({ ...plantData, [key]: value });
  };

  return (
    <div className="py-12">
      {/* Title */}
      <div className="text-2xl mb-4">
        <Title text1="PLANT" text2="PROFILE" />
      </div>
    <div className="flex gap-8 p-2">
      {/* Left: Plant Image */}
      <div className="w-1/3">
        <img
          src={assets.plant1}
          alt="Bird of Paradise"
          className="w-full h-auto rounded shadow"
        />
      </div>

      {/* Right: Info */}
      <div className="w-2/3 flex flex-col gap-2">
        <ProfileField
          label="Name"
          field="name"
          value="Bird of Paradise" // plantData.name
          editMode={editMode}
          setEditMode={setEditMode}
          onChange={handleChange}
        />
        <ProfileField
          label="Scientific Name"
          field="scientificName"
          value="Strelitzia reginae" // plantData.scientificName
          editMode={editMode}
          setEditMode={setEditMode}
          onChange={handleChange}
        />
        <ProfileField
          label="Indoor or Outdoor Plant"
          field="location"
          value="Both" // plantData.location
          editMode={editMode}
          setEditMode={setEditMode}
          onChange={handleChange}
        />
        <ProfileField
          label="Optimal Growing Seasons"
          field="seasons"
          value="Spring and Summer" // plantData.seasons
          editMode={editMode}
          setEditMode={setEditMode}
          onChange={handleChange}
        />
        <ProfileField
          label="Toxicity Status"
          field="toxicity"
          value="Mildly toxic to pets (cats and dogs)" // plantData.toxicity
          editMode={editMode}
          setEditMode={setEditMode}
          onChange={handleChange}
        />
        <ProfileField
          label="Environment (Indoor)"
          field="environmentIndoor"
          value="Bright, indirect sunlight, allow soil to dry between waterings" // plantData.environmentIndoor
          editMode={editMode}
          setEditMode={setEditMode}
          onChange={handleChange}
        />
        <ProfileField
          label="Environment (Outdoor)"
          field="environmentOutdoor"
          value="Full sun, well-drained soil, tropical or subtropical climates" // plantData.environmentOutdoor
          editMode={editMode}
          setEditMode={setEditMode}
          onChange={handleChange}
        />
        <ProfileField
          label="Disease Identified"
          field="disease"
          value="Leaf blight" // plantData.disease
          editMode={editMode}
          setEditMode={setEditMode}
          onChange={handleChange}
        />
        <ProfileField
          label="Treatment"
          field="treatment"
          value="Trim affected leaves, apply fungicide" // plantData.treatment
          editMode={editMode}
          setEditMode={setEditMode}
          onChange={handleChange}
        />
        <ProfileField
          label="Date of Last Checkup"
          field="lastCheckup"
          value="2025-07-28" // plantData.lastCheckup
          editMode={editMode}
          setEditMode={setEditMode}
          onChange={handleChange}
          type="date"
        />
      </div>
    </div>
    </div>
  );
}