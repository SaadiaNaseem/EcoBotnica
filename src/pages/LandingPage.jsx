import React from "react";
import ModuleGrid from "../compononts/landingPage/ModuleGrid";
import HeroSection from "../compononts/landingPage/HeroSection";
import FeatureHeader from "../compononts/landingPage/FeatureHeader";
import { assets } from "../assets/assets";

export default function LandingPage() {
  const modules = [
    {
      title: "Plant Identification using AI",
      description: "Upload or snap a photo to discover your plant species instantly.",
      image: assets.Identify,
      path: "/plantidentification",
    },
    {
      title: "Disease Diagnosis & Treatment",
      description: "Detect plant diseases and get tailored treatments in seconds.",
      image: assets.Disease,
      path: "/plantDoctor",
    },
    {
      title: "Plantation Guide",
      description: "AI-generated step-by-step planting guides for every plant lover.",
      image: assets.Plantation,
      path: "/plantationGuide",
    },
    {
      title: "AR Guided Companion Planting",
      description: "See your plant’s compatibility in augmented reality.",
      image: assets.Companion,
      path: "/companionPlanting",
    },
    {
      title: "Plant Care Assistant",
      description: "Smart reminders, weather insights, and care tips — all in one place.",
      image: assets.Care,
      path: "/plantCare",
    },
    {
      title: "Community",
      description: "Join plant lovers, share issues, and get verified solutions.",
      image: assets.Community,
      path: "/CommunityChat",
    },
    {
      title: "E-commerce Marketplace",
      description: "Buy, sell, and review plant-related products with ease.",
      image: assets.Ecom,
      path: "/Ecom",
    },
    {
      title: "Dashboard",
      description: "Track plant growth, progress, and your green journey analytics.",
      image: assets.Dashboard,
      path: "/UserDashboard",
    },
    {
      title: "User Profile Management",
      description: "Manage your account securely and personalize your Eco experience.",
      image: assets.Profile,
      path: "/profilePage",
    },
  ];

  return (
    <main className="bg-white w-full m-0 mt-16 p-0 text-black">
      <HeroSection />
      <FeatureHeader />
      <ModuleGrid modules={modules} />
    </main>
  );
}
