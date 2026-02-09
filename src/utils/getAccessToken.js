export const getAccessToken = async () => {
    try {
        const token = localStorage.getItem("authToken");
        return `Bearer ${token}`; 
    } catch (error) {
        console.error("getAccessToken error:", error);
        return null; 
    }
};
