import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export function ViewProfile() {
    const { email } = useParams();
    const [profile, setProfile] = useState(null);
    const [coordinates, setCoordinates] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedProfile, setEditedProfile] = useState({});
    const [loadingLocation, setLoadingLocation] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/userprofile/${email}`);
                if (response.status === 200) {
                    setProfile(response.data);
                    setEditedProfile(response.data);
                    fetchCoordinates(response.data);
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        };
        fetchProfile();
    }, [email]);

    const fetchCoordinates = async (profileData) => {
        if (!profileData?.city || !profileData?.state || !profileData?.country) return;
        setLoadingLocation(true);
        try {
            const response = await axios.get("https://nominatim.openstreetmap.org/search", {
                params: {
                    city: profileData.city,
                    state: profileData.state,
                    country: profileData.country,
                    postalcode: profileData.pincode,
                    format: "json",
                },
            });
            if (response.data.length > 0) {
                const { lat, lon } = response.data[0];
                setCoordinates({ lat: parseFloat(lat), lon: parseFloat(lon) });
            }
        } catch (error) {
            console.error("Error fetching coordinates:", error);
        } finally {
            setLoadingLocation(false);
        }
    };

    const handleEditClick = () => setIsEditing(true);
    const handleChange = (e) => setEditedProfile({ ...editedProfile, [e.target.name]: e.target.value });
    
    const handleSave = async () => {
        try {
            const response = await axios.put(`http://localhost:4000/userprofile/${email}`, editedProfile);
            if (response.status === 200) {
                setProfile(editedProfile);
                setIsEditing(false);
                fetchCoordinates(response.data.profile);
            }
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    if (!profile) return <p style={styles.loadingText}>Loading profile...</p>;

    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>Profile Details</h1>
            <div style={styles.profileCard}>
                {isEditing ? (
                    <>
                        <input type="text" name="name" value={editedProfile.name || ""} onChange={handleChange} />
                        <input type="number" name="age" value={editedProfile.age || ""} onChange={handleChange} />
                        <input type="text" name="phoneNo" value={editedProfile.phoneNo || ""} onChange={handleChange} />
                        <input type="text" name="addressline" value={editedProfile.addressline || ""} onChange={handleChange} />
                        <input type="text" name="city" value={editedProfile.city || ""} onChange={handleChange} />
                        <input type="text" name="state" value={editedProfile.state || ""} onChange={handleChange} />
                        <input type="text" name="country" value={editedProfile.country || ""} onChange={handleChange} />
                        <input type="number" name="pincode" value={editedProfile.pincode || ""} onChange={handleChange} />
                        <button onClick={handleSave}>Save</button>
                    </>
                ) : (
                    <>
                        <p><strong>Name:</strong> {profile.name}</p>
                        <p><strong>Age:</strong> {profile.age}</p>
                        <p><strong>Email:</strong> {profile.email}</p>
                        <p><strong>Phone:</strong> {profile.phoneNo}</p>
                        <p><strong>Address:</strong></p>
                        <p>{profile.addressline}, {profile.city}, {profile.state}, {profile.country}, {profile.pincode}</p>
                        <button onClick={handleEditClick}>Edit</button>
                    </>
                )}
            </div>

            {loadingLocation ? (
                <p style={styles.loadingText}>Loading coordinates...</p>
            ) : coordinates ? (
                <div style={styles.mapContainer}>
                    <h3>Location:</h3>
                    <p><strong>Latitude:</strong> {coordinates.lat}</p>
                    <p><strong>Longitude:</strong> {coordinates.lon}</p>
                    <MapContainer center={[coordinates.lat, coordinates.lon]} zoom={13} style={styles.map}>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; OpenStreetMap contributors'
                        />
                        <Marker position={[coordinates.lat, coordinates.lon]}>
                            <Popup>{`${profile.name} is located here`}</Popup>
                        </Marker>
                    </MapContainer>
                </div>
            ) : (
                <p style={styles.loadingText}>Location data unavailable</p>
            )}
        </div>
    );
}

const styles = {
    container: {
        maxWidth: "800px",
        margin: "20px auto",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#fff",
        fontFamily: "Arial, sans-serif",
        textAlign: "center",
    },
    heading: {
        fontSize: "24px",
        color: "#333",
        marginBottom: "20px",
    },
    profileCard: {
        backgroundColor: "#f9f9f9",
        padding: "15px",
        borderRadius: "10px",
        boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
        marginBottom: "20px",
        textAlign: "left",
    },
    mapContainer: {
        marginTop: "20px",
        textAlign: "center",
    },
    map: {
        height: "400px",
        width: "100%",
        borderRadius: "10px",
    },
    loadingText: {
        fontSize: "16px",
        color: "#555",
        textAlign: "center",
        marginTop: "20px",
    },
};

export default ViewProfile;
