"use client"
import React, { useState } from "react";
import { FaGithub, FaTwitter, FaLinkedin, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import { Tooltip } from "react-tooltip"; // Import đúng `Tooltip` từ thư viện

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    bio: "Senior Frontend Developer with passion for creating beautiful and accessible web applications.",
    profilePicture: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3",
    socialLinks: {
      github: "https://github.com/johndoe",
      twitter: "https://twitter.com/johndoe",
      linkedin: "https://linkedin.com/in/johndoe"
    }
  });

  const [editedData, setEditedData] = useState(profileData);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData(profileData);
  };

  const handleSave = () => {
    setProfileData(editedData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData(profileData);
  };

  const handleChange = (field, value) => {
    setEditedData(prev => ({
      ...prev,
      [field]: field === "socialLinks" ? { ...prev.socialLinks, ...value } : value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3 p-8 bg-gray-50">
            <div className="relative group">
              <img
                src={profileData.profilePicture}
                alt="Profile"
                className="w-48 h-48 rounded-full mx-auto object-cover transition-transform duration-300 group-hover:scale-105"
                data-tooltip-id="profile-picture-tooltip"
                data-tooltip-content="Profile Picture"
              />
              <Tooltip id="profile-picture-tooltip" />
            </div>

            <div className="mt-8 flex justify-center space-x-4">
              <a
                href={profileData.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors"
                data-tooltip-id="github-tooltip"
                data-tooltip-content="GitHub Profile"
              >
                <FaGithub size={24} />
              </a>
              <Tooltip id="github-tooltip" />

              <a
                href={profileData.socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors"
                data-tooltip-id="twitter-tooltip"
                data-tooltip-content="Twitter Profile"
              >
                <FaTwitter size={24} />
              </a>
              <Tooltip id="twitter-tooltip" />

              <a
                href={profileData.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors"
                data-tooltip-id="linkedin-tooltip"
                data-tooltip-content="LinkedIn Profile"
              >
                <FaLinkedin size={24} />
              </a>
              <Tooltip id="linkedin-tooltip" />
            </div>
          </div>

          <div className="md:w-2/3 p-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Profile Information</h1>
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  aria-label="Edit profile"
                >
                  <FaEdit className="mr-2" /> Edit
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    aria-label="Save changes"
                  >
                    <FaCheck className="mr-2" /> Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    aria-label="Cancel editing"
                  >
                    <FaTimes className="mr-2" /> Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    id="name"
                    value={editedData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                ) : (
                  <p className="mt-1 text-gray-900">{profileData.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    id="email"
                    value={editedData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                ) : (
                  <p className="mt-1 text-gray-900">{profileData.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                  Bio
                </label>
                {isEditing ? (
                  <textarea
                    id="bio"
                    value={editedData.bio}
                    onChange={(e) => handleChange("bio", e.target.value)}
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                ) : (
                  <p className="mt-1 text-gray-900">{profileData.bio}</p>
                )}
              </div>

              {isEditing && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="github" className="block text-sm font-medium text-gray-700">
                      GitHub URL
                    </label>
                    <input
                      type="url"
                      id="github"
                      value={editedData.socialLinks.github}
                      onChange={(e) => handleChange("socialLinks", { github: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="twitter" className="block text-sm font-medium text-gray-700">
                      Twitter URL
                    </label>
                    <input
                      type="url"
                      id="twitter"
                      value={editedData.socialLinks.twitter}
                      onChange={(e) => handleChange("socialLinks", { twitter: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700">
                      LinkedIn URL
                    </label>
                    <input
                      type="url"
                      id="linkedin"
                      value={editedData.socialLinks.linkedin}
                      onChange={(e) => handleChange("socialLinks", { linkedin: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
