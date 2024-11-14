'use client';
import { newRequest } from '@/lib/newRequest';
import { useAppSelector } from '@/lib/redux/hooks';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import {
  FaGithub,
  FaTwitter,
  FaLinkedin,
  FaEdit,
  FaCheck,
  FaTimes,
  FaFacebook,
  FaInstagram,
} from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';

interface UpdateUserResponse {
  success: boolean;
  data: {
    full_name: string;
    email: string;
    bio: string;
    phone: string;
    image_url: string;
    github: string;
    facebook: string;
    instagram: string;
  };
  message: string;
}

interface ValidationError {
  status: number;
  message: string;
  error?: {
    [key: string]: string;
  };
}

interface ProfileData {
  full_name: string;
  email: string;
  bio: string;
  phone: string;
  profilePicture: string;
  socialLinks: {
    github: string;
    facebook: string;
    instagram: string;
  };
}

const ProfilePage = () => {
  const user = useAppSelector((state) => state.auth.user);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    full_name: user?.full_name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    phone: user?.phone || '',
    profilePicture: user?.image_url || '',
    socialLinks: {
      github: user?.github || '',
      facebook: user?.facebook || '',
      instagram: user?.instagram || '',
    },
  });

  const [editedData, setEditedData] = useState<ProfileData>(profileData);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData(profileData);
  };

  const handleSave = async () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!editedData.email) {
      alert('Email is required.');
      return;
    }
    if (!emailPattern.test(editedData.email)) {
      alert('Please enter a valid email address.');
      return;
    }
    if (!editedData.full_name) {
      alert('Full name is required.');
      return;
    }

    try {
      const formData = new FormData();

      formData.append('full_name', editedData.full_name.trim());
      formData.append('email', editedData.email.toLowerCase().trim());
      formData.append('bio', editedData.bio?.trim() || '');
      formData.append('phone', editedData.phone?.trim() || '');

      formData.append('github', editedData.socialLinks.github?.trim() || '');
      formData.append(
        'facebook',
        editedData.socialLinks.facebook?.trim() || '',
      );
      formData.append(
        'instagram',
        editedData.socialLinks.instagram?.trim() || '',
      );

      if (selectedFile) {
        formData.append('image', selectedFile);
      }

      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      const response = await newRequest.put<UpdateUserResponse>(
        `/api/v1/user/update/${user.id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      if (response.data.success) {
        const updatedData = response.data.data;
        setProfileData({
          ...profileData,
          full_name: updatedData.full_name,
          email: updatedData.email,
          bio: updatedData.bio,
          phone: updatedData.phone,
          profilePicture: updatedData.image_url,
          socialLinks: {
            github: updatedData.github,
            facebook: updatedData.facebook,
            instagram: updatedData.instagram,
          },
        });
        setIsEditing(false);
        setEditedData(profileData);
        setSelectedFile(null);
        toast.success('Profile updated successfully!');
      }
    } catch (err: any) {
      console.error('Update failed:', err);

      if (err.response?.data) {
        const errorData = err.response.data as ValidationError;

        if (errorData.error) {
          const errorMessages = Object.entries(errorData.error)
            .map(([field, message]) => `${field}: ${message}`)
            .join('\n');
          toast.error(`Validation Error:\n${errorMessages}`);
        } else {
          toast.error(
            errorData.message || 'Failed to update profile. Please try again.',
          );
        }
      } else {
        toast.error(
          'An error occurred while updating your profile. Please try again.',
        );
      }
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData(profileData);
    setSelectedFile(null);
  };

  const handleChange = (
    field: keyof ProfileData | 'socialLinks',
    value: any,
  ) => {
    setEditedData((prev) => ({
      ...prev,
      [field]:
        field === 'socialLinks' ? { ...prev.socialLinks, ...value } : value,
    }));
  };

  const handleProfilePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedData((prev) => ({
          ...prev,
          profilePicture: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3 p-8 bg-gray-50">
            <div className="relative group">
              <img
                src={editedData.profilePicture || '/default-avatar.png'}
                alt="Profile"
                className="w-48 h-48 rounded-full mx-auto object-cover transition-transform duration-300 group-hover:scale-105"
                data-tooltip-id="profile-picture-tooltip"
                data-tooltip-content="Profile Picture"
              />
              <Tooltip id="profile-picture-tooltip" />
              {isEditing && (
                <div className="mt-4">
                  <label
                    htmlFor="profile-picture"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Change Profile Picture
                  </label>
                  <input
                    id="profile-picture"
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              )}
            </div>

            <div className="mt-8 flex justify-center space-x-4">
              {Object.entries({
                github: <FaGithub />,
                facebook: <FaFacebook />,
                instagram: <FaInstagram />,
              }).map(
                ([platform, icon]) =>
                  profileData.socialLinks[
                    platform as keyof typeof profileData.socialLinks
                  ] && (
                    <a
                      key={platform}
                      href={
                        profileData.socialLinks[
                          platform as keyof typeof profileData.socialLinks
                        ]
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-900 transition-colors"
                      data-tooltip-id={`${platform}-tooltip`}
                      data-tooltip-content={`${
                        platform.charAt(0).toUpperCase() + platform.slice(1)
                      } Profile`}
                    >
                      {React.cloneElement(icon as React.ReactElement, {
                        size: 24,
                      })}
                      <Tooltip id={`${platform}-tooltip`} />
                    </a>
                  ),
              )}
            </div>
          </div>

          <div className="md:w-2/3 p-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                Profile Information
              </h1>
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
                <label
                  htmlFor="full_name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    id="full_name"
                    value={editedData.full_name}
                    onChange={(e) => handleChange('full_name', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                ) : (
                  <p className="mt-1 text-gray-900">{profileData.full_name}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    id="email"
                    value={editedData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                ) : (
                  <p className="mt-1 text-gray-900">{profileData.email}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    id="phone"
                    value={editedData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                ) : (
                  <p className="mt-1 text-gray-900">{profileData.phone}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="bio"
                  className="block text-sm font-medium text-gray-700"
                >
                  Bio
                </label>
                {isEditing ? (
                  <textarea
                    id="bio"
                    value={editedData.bio}
                    onChange={(e) => handleChange('bio', e.target.value)}
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
                    <label
                      htmlFor="github"
                      className="block text-sm font-medium text-gray-700"
                    >
                      GitHub URL
                    </label>
                    <input
                      type="url"
                      id="github"
                      value={editedData.socialLinks.github}
                      onChange={(e) =>
                        handleChange('socialLinks', { github: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="https://github.com/username"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="facebook"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Facebook URL
                    </label>
                    <input
                      type="url"
                      id="facebook"
                      value={editedData.socialLinks.facebook}
                      onChange={(e) =>
                        handleChange('socialLinks', {
                          facebook: e.target.value,
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="https://facebook.com/username"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="instagram"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Instagram URL
                    </label>
                    <input
                      type="url"
                      id="instagram"
                      value={editedData.socialLinks.instagram}
                      onChange={(e) =>
                        handleChange('socialLinks', {
                          instagram: e.target.value,
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="https://instagram.com/username"
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
