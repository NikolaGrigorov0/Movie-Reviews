import { jwtDecode } from "jwt-decode";

export const fetchUser = async (userId) => {
    try {
        const response = await fetch(`http://localhost:5213/api/users/${userId}`);
        if (!response.ok) {
            throw new Error("Failed to fetch user data.");
        }
        const data = await response.json();
        return(data);
    } catch (error) {
        console.error("Error fetching user:", error);
    }
};

export const getUserIdFromToken = (token) => {
    try {
        const decoded = jwtDecode(token);
        return decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
    } catch (error) {
        console.error("Invalid token:", error);
        return null;
    }
};
