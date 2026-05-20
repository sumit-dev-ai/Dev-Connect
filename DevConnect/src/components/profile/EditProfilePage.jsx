import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthContext from "@/context/authContext";
import toast from "react-hot-toast";
import { editProfileDetails } from "@/services/AuthServices";

export default function EditProfilePage() {
  const [loading , setLoading]=useState(false);
  const { user, setUser } = useAuthContext();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userName: user?.userName || "",
    fullName: user?.fullName || "",
    bio: user?.bio || "",
    location: user?.location || "",
    website: user?.website || "",
  });


  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      console.log(formData)
      const data = await editProfileDetails(formData);
      setUser(data.data.user)
      
      

      toast.success("Profile updated successfully");
      navigate("/profile");
    } catch (error) {
      console.log(error);
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      
      {/* Header */}
      <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Username */}
        <div>
          <label className="text-sm font-medium">Username</label>
          <input
            type="text"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-md"
          />
        </div>

        {/* Full Name */}
        <div>
          <label className="text-sm font-medium">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-md"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="text-sm font-medium">Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-md"
            rows="3"
          />
        </div>

        {/* Location */}
        <div>
          <label className="text-sm font-medium">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-md"
          />
        </div>

        {/* Website */}
        <div>
          <label className="text-sm font-medium">Website</label>
          <input
            type="text"
            name="website"
            value={formData.website}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-md"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="bg-black text-white px-4 py-2 rounded-md cursor-pointer"
          >
            Save Changes
          </button>

          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="px-4 py-2 border rounded-md"
          >
            Cancel
          </button>
        </div>

      </form>
    </div>
  );
}