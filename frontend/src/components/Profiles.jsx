import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export function Profiles() {
    const navigate = useNavigate();
    const [filters, setFilters] = useState({
        name: "",
        city: "",
        state: "",
        country: "",
    });
    const [profiles, setProfiles] = useState([]);

    // Fetch profiles from API
    useEffect(() => {
        const fetchProfiles = async () => {
            try {
                const response = await axios.get("http://localhost:4000/allProfiles");
                if (response.status === 200) {
                    setProfiles(response.data);
                } else {
                    alert("Error loading profiles");
                }
            } catch (error) {
                console.error("Error fetching profiles:", error);
                alert("Error fetching profiles");
            }
        };

        fetchProfiles();
    }, []); // Empty dependency array ensures this runs only once when the component mounts.

    // Handle input change for filters
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value.toLowerCase() }));
    };

    // Filter profiles based on input fields
    const filteredProfiles = profiles.filter((profile) =>
        Object.keys(filters).every((key) =>
            filters[key] === "" || (profile[key] && profile[key].toLowerCase().includes(filters[key]))
        )
    );

    function handleProfile(email) {
        navigate(`/viewProfile/${email}`);
    }

    async function handleDeleteProfile(id) {
        try {
            const response = await axios.delete(`http://localhost:4000/deleteProfile/${id}`);
            if (response.status === 200) {
                console.log("Profile deleted successfully:", response.data);
                // Optionally, update the profiles state to remove the deleted profile
                setProfiles(profiles.filter((profile) => profile._id !== id));
            } else {
                alert("Error deleting profile");
            }
        } catch (error) {
            console.error("Error deleting profile:", error);
            alert("Error deleting profile");
        }
    }

    return (
        <div style={containerStyle}>
            {/* Search Inputs */}
            <div style={searchContainer}>
                {["name", "city", "state", "country"].map((field) => (
                    <div style={searchoption}>
                    <label>{field}</label>
                    <input
                        key={field}
                        type="text"
                        name={field}
                        placeholder={`Enter ${field}...`}
                        value={filters[field]}
                        onChange={handleInputChange}
                        style={inputStyle}
                    />
                    </div>
                ))}
            </div>

            {/* Profile Cards */}
            <div style={cardsContainer}>
                {filteredProfiles.length > 0 ? (
                    filteredProfiles.map((profile) => (
                        <div key={profile._id} style={cardStyle}>
                            <p style={nameStyle}>{profile.name}</p>
                            <p><strong>Age:</strong> {profile.age}</p>
                            <p><strong>Email:</strong> {profile.email}</p>
                            <p><strong>Address:</strong></p>
                            <p>{profile.addressline}, {profile.city}, {profile.state}, {profile.country}, {profile.pincode}</p>
                            <button style={buttonStyle} onClick={() => handleProfile(profile.email)}>View Profile</button>
                            <button style={buttonStyle} onClick={() => handleDeleteProfile(profile._id)}>Delete</button>
                        </div>
                    ))
                ) : (
                    <p style={noProfilesStyle}>No profiles found.</p>
                )}
            </div>
        </div>
    );
}

// **Styles**
const containerStyle = { padding: "20px", fontFamily: "Arial, sans-serif" };
const searchContainer = { display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "20px" };
const searchoption={display:"flex",flexDirection:"column"}
const inputStyle = { padding: "10px", width: "200px", border: "1px solid #ccc", borderRadius: "5px", fontSize: "14px" };
const cardsContainer = { display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "start" };
const cardStyle = {
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0px 4px 8px rgba(230, 105, 255, 0.1)",
    padding: "15px",
    width: "250px",
    textAlign: "center",
    border: "1px solid #ddd",
    transition: "transform 0.2s ease-in-out",
};
const nameStyle = { fontSize: "18px", fontWeight: "bold", color: "#333" };
const buttonStyle = {
    backgroundColor: "#007BFF",
    color: "#fff",
    padding: "8px 12px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    marginTop: "10px",
    transition: "background 0.3s",
};
const noProfilesStyle = { fontSize: "16px", fontWeight: "bold", color: "#777" };

export default Profiles;