import { useState, useEffect } from "react";
import { fetchUser, getUserIdFromToken } from "../services/userService";



const EditProfile = () => {
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [password, setPassword] = useState("");
    const [profilePhoto, setProfilePhoto] = useState("");

    const token = localStorage.getItem("token");
    const userId = getUserIdFromToken(token);

    useEffect(async () => {
        if (userId) {
            const data = await fetchUser(userId);
            setUser(data);
            setUsername(data.username);
            setEmail(data.email)
            setProfilePhoto(data.profilePhoto);
        }
    }, [userId]);


    const handleUpdate = async () => {
        if (!userId) {
            alert("User not found. Please log in.");
            return;
        }

        const updatedUser = {
            username: username,
            password: password,
            profilePhoto: profilePhoto
        };

        try {
            const response = await fetch(`http://localhost:5213/api/users/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedUser)
            });

            if (!response.ok) throw new Error("Failed to update profile");

            fetchUser(); 
        } catch (error) {
            console.error("Error updating profile:", error);
        }
        window.location.reload(); 
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
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
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

export default EditProfile;
