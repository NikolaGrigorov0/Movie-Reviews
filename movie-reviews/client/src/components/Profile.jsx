import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const getUserIdFromToken = (token) => {
    try {
        const decoded = jwtDecode(token);
        return decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
    } catch (error) {
        console.error("Invalid token:", error);
        return null;
    }
};

const Profile = () => {
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [profilePhoto, setProfilePhoto] = useState("");

    const token = localStorage.getItem("token");
    const userId = getUserIdFromToken(token);

    useEffect(() => {
        if (userId) {
            fetchUser();
        }
    }, [userId]);

    const fetchUser = async () => {
        try {
            const response = await fetch(`http://localhost:5213/api/users/${userId}`);
            if (!response.ok) {
                throw new Error("Failed to fetch user data.");
            }
            const data = await response.json();
            setUser(data);
            setUsername(data.username);
            setProfilePhoto(data.profilePhoto);
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    };

    const handleUpdate = async () => {
        if (!userId) {
            alert("User ID not found. Please log in.");
            return;
        }

        const updatedUser = {
            username: username,
            oldPassword: oldPassword,
            newPassword: newPassword,
            profilePhoto: profilePhoto
        };

        try {
            const response = await fetch(`http://localhost:5213/api/users/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(updatedUser)
            });

            if (!response.ok) throw new Error("Failed to update profile");

            alert("Profile updated successfully!");
            fetchUser(); // Refresh user data
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    const handleProfilePhotoChange = (event) => {
        const file = event.target.files[0];
        if (file) {
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
                            src="https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"
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
                    <input 
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        className="w-full p-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" 
                        placeholder="New username" 
                    />
                    <input 
                        type="password" 
                        value={oldPassword} 
                        onChange={(e) => setOldPassword(e.target.value)} 
                        className="w-full p-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" 
                        placeholder="Old password" 
                    />
                    <input 
                        type="password" 
                        value={newPassword} 
                        onChange={(e) => setNewPassword(e.target.value)} 
                        className="w-full p-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" 
                        placeholder="New password" 
                    />
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

export default Profile;
