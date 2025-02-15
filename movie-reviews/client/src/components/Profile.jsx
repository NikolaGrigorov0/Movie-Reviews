import { useState, useEffect } from "react";
import { fetchUser, getUserIdFromToken } from "../services/userService";
import { useNavigate } from "react-router-dom";


const Profile = () => {
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [profilePhoto, setProfilePhoto] = useState("");
    const navigate = useNavigate();

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

    const handleEdit = () => {
        navigate('/editProfile');

    }


    if (!userId) {
        return <p className="text-center text-white">Please log in to view your profile.</p>;
    }

    return user ? (
        <div className="min-h-screen flex items-center justify-center bg-black text-white p-6">
            <div className="bg-gray-900 p-8 rounded-2xl shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold text-violet-600 text-center mb-6">Profile</h1>
                <div className="flex justify-center mb-4 relative">
                    <label htmlFor="profilePhotoInput" className="cursor-pointer">
                        <img 
                            src={profilePhoto}
                            alt="Profile" 
                            className="w-24 h-24 rounded-full border-0"
                        />
                    </label>
                </div>
                <div className="space-y-4">
                    <p>Username:</p>
                    <input 
                        type="text" 
                        value={username} 
                        className="w-full p-2 bg-gray-800 rounded-lg focus:outline-none cursor-not-allowed" 
                        placeholder="New username" 
                        readOnly
                    />
                    <p>Email:</p>
                <input 
                    type="text" 
                    value={email} 
                    className="w-full p-2 bg-gray-800 rounded-lg focus:outline-none cursor-not-allowed" 
                    placeholder="email" 
                    readOnly 
                />
                   
                    <button 
                        onClick={handleEdit} 
                        className="w-full bg-violet-800 hover:bg-violet-600 transition-all text-white py-2 rounded-lg font-bold"
                    >
                        Edit profile
                    </button>
                </div>
            </div>
        </div>
    ) : (
        <p className="text-center text-white">Loading...</p>
    );
};

export default Profile;
