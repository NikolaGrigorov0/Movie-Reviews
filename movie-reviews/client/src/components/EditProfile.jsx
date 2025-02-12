import { useState, useEffect } from "react";
import { fetchUser, getUserIdFromToken } from "../services/userService";
import { ToastContainer, toast } from 'react-toastify';

const EditProfile = () => {
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [profilePhoto, setProfilePhoto] = useState("");
    const [error, setError] = useState("");
    const [validationErrors, setValidationErrors] = useState({});

    const token = localStorage.getItem("token");
    const userId = getUserIdFromToken(token);

    useEffect(() => {
        const fetchData = async () => {
            if (userId) {
                const data = await fetchUser(userId);
                setUser(data);
                setUsername(data.username);
                setEmail(data.email);
                setProfilePhoto(data.profilePhoto);
            }
        };

        fetchData();
    }, [userId]);

    const errorToast = (errormessage) => toast(errormessage);

    const validateForm = () => {
        const errors = {};

        if (!username.trim()) {
            errors.username = "Username is required.";
        } else if (username.length < 3 || username.length > 20) {
            errors.username = "Username must be between 3 and 20 characters.";
        }

        if (newPassword && !oldPassword) {
            errors.oldPassword = "Old password is required to set a new password.";
        }
        if (newPassword && newPassword.length < 8) {
            errors.newPassword = "New password must be at least 8 characters long.";
        }

        if (profilePhoto && profilePhoto.size > 5 * 1024 * 1024) { 
            errors.profilePhoto = "Profile photo must be less than 5MB.";
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleUpdate = async () => {
        if (!userId) {
            alert("User not found. Please log in.");
            return;
        }

        if (!validateForm()) {
            return;
        }

        const updatedUser = {};

        if (username && username !== user.username) {
            updatedUser.username = username;
        }
        if (profilePhoto && profilePhoto !== user.profilePhoto) {
            updatedUser.profilePhoto = profilePhoto;
        }
        if (oldPassword && newPassword) {
            updatedUser.oldPassword = oldPassword;
            updatedUser.newPassword = newPassword;
        }

        console.log("Sending request body:", JSON.stringify(updatedUser));

        try {
            const response = await fetch(`http://localhost:5213/api/users/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedUser),
            });

            const responseText = await response.text(); 

            if (!response.ok) {
                toast(responseText);
                throw new Error(responseText);
            }

            const updatedData = await fetchUser(userId);
            setUser(updatedData);
            setUsername(updatedData.username);
            setProfilePhoto(updatedData.profilePhoto);

            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
            errorToast(error.message);
        }
    };

    const handleProfilePhotoChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setValidationErrors((prev) => ({
                    ...prev,
                    profilePhoto: "Profile photo must be less than 5MB.",
                }));
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePhoto(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    if (!userId) {
        return <p className="text-center text-white">Please log in to view your profile.</p>;
    }

    return user ? (
        <div className="min-h-screen flex items-center justify-center bg-black text-white p-6">
            <div className="bg-gray-900 p-8 rounded-2xl shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold text-purple-400 text-center mb-6">Profile</h1>
                <div className="flex justify-center mb-4 relative">
                    <label htmlFor="profilePhotoInput" className="cursor-pointer">
                        <img 
                            src={profilePhoto}
                            alt="Profile" 
                            className="w-24 h-24 rounded-full border-4 border-purple-500"
                        />
                    </label>
                    <input 
                        type="file" 
                        id="profilePhotoInput" 
                        accept="image/*" 
                        className="hidden"
                        onChange={handleProfilePhotoChange} 
                    />
                </div>
                <div className="space-y-4">
                    <p>Username:</p>
                    <input 
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        className="w-full p-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" 
                        placeholder="New username" 
                    />
                    {validationErrors.username && (
                        <p className="text-red-500 text-sm">{validationErrors.username}</p>
                    )}

                    <p>Email:</p>
                    <input 
                        type="text" 
                        value={email} 
                        className="w-full p-2 bg-gray-800 rounded-lg focus:outline-none cursor-not-allowed" 
                        placeholder="email" 
                        readOnly 
                    />

                    <p>Password:</p>
                    <input 
                        type="password" 
                        value={oldPassword} 
                        onChange={(e) => setOldPassword(e.target.value)} 
                        className="w-full p-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" 
                        placeholder="Old password" 
                    />
                    {validationErrors.oldPassword && (
                        <p className="text-red-500 text-sm">{validationErrors.oldPassword}</p>
                    )}

                    <input 
                        type="password" 
                        value={newPassword} 
                        onChange={(e) => setNewPassword(e.target.value)} 
                        className="w-full p-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" 
                        placeholder="New password" 
                    />
                    {validationErrors.newPassword && (
                        <p className="text-red-500 text-sm">{validationErrors.newPassword}</p>
                    )}

                    {validationErrors.profilePhoto && (
                        <p className="text-red-500 text-sm">{validationErrors.profilePhoto}</p>
                    )}

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <button 
                        onClick={handleUpdate} 
                        className="w-full bg-purple-600 hover:bg-purple-700 transition-all text-white py-2 rounded-lg font-bold"
                    >
                        Update Profile
                    </button>
                </div>
            </div>
        </div>
    ) : (
        <p className="text-center text-white">Loading...</p>
    );
};

export default EditProfile;