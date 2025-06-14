import React, { useState, useEffect } from "react";
import API from "../../services/api.js";

const EditProfile = () => {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    gender: ""
  });

  const [originalProfile, setOriginalProfile] = useState(null);
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/profile/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const { firstName, lastName, email, contact, dob, gender } = res.data;
        const data = {
          firstName,
          lastName,
          email,
          phone: contact,
          dob: dob?.split("T")[0] || "",
          gender,
        };
        setProfile(data);
        setOriginalProfile(data);
      } catch (err) {
        alert("Failed to load profile.");
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    if (!originalProfile) return;
    const changed = Object.keys(originalProfile).some(
      (key) => profile[key] !== originalProfile[key]
    );
    setIsChanged(changed);
  }, [profile, originalProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenderSelect = (gender) => {
    setProfile((prev) => ({ ...prev, gender }));
  };

  const handleSave = async () => {
    try {
      const payload = {
        firstName: profile.firstName,
        lastName: profile.lastName,
        dob: profile.dob,
        email: profile.email,
        contact: profile.phone,
        gender: profile.gender,
      };

      await API.put("/profile/", payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      alert("Profile updated successfully.");
      setOriginalProfile(profile);
      setIsChanged(false);
    } catch (err) {
      alert("Failed to update profile.");
    }
  };

  return (
    <div className="p-6 bg-white rounded-md shadow-md w-full max-w-4xl mx-auto mt-6">
      <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">First Name *</label>
          <input
            type="text"
            name="firstName"
            value={profile.firstName}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={profile.lastName}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Email Id *</label>
        <input
          type="email"
          name="email"
          value={profile.email}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div className="mb-4 flex justify-between items-center gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Mobile Number *</label>
          <input
            type="tel"
            name="phone"
            value={profile.phone}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <button
          type="button"
          className="text-blue-500 font-semibold mt-6"
          onClick={() => alert("Phone number change flow not implemented")}
        >
          CHANGE
        </button>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">DOB</label>
        <input
          type="date"
          name="dob"
          value={profile.dob}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
        <p className="text-sm text-gray-500 mt-1">
          Share your DOB to get special gifts on the 1st day of your birthday month
        </p>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Gender</label>
        <div className="flex gap-4">
          {["Male", "Female", "Other"].map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => handleGenderSelect(g)}
              className={`border rounded px-4 py-2 ${
                profile.gender === g
                  ? "bg-yellow-400 text-white"
                  : "bg-white text-black"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      <button
        className={`font-semibold px-6 py-2 rounded transition ${
          isChanged
            ? "bg-yellow-500 text-white hover:bg-yellow-600"
            : "bg-gray-300 text-white cursor-not-allowed"
        }`}
        disabled={!isChanged}
        onClick={handleSave}
      >
        SAVE CHANGES
      </button>
    </div>
  );
};

export default EditProfile;
