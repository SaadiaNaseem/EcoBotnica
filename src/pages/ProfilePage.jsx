import React from "react";
import ProfileForm from "../compononts/ProfileForm";

const ProfilePage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-gray-800">Welcome To Ecobotanica</h1>
        <p className="text-sm text-gray-600 mt-1">Today is {new Date().toDateString()}</p>
      </div>
      <ProfileForm />
    </div>
  );
};

export default ProfilePage;