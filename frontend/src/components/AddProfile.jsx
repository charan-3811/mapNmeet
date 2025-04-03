import { useState } from "react";
import axios from "axios"
import { useNavigate } from "react-router-dom";

export function AddProfile() {
    const navigate=useNavigate()
    const [formdata, setFormdata] = useState({
        name: "",
        email: "",
        age: "",
        phoneNo: "",
        addressline: "",
        city: "",
        state: "",
        country: "",
        pincode: ""
    });

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormdata({ ...formdata, [name]: value });
    };


    // Handle form submission
    async function handleSubmit(e) {
        e.preventDefault(); // Prevent page reload
        try {
            const response = await axios.post("http://localhost:4000/addProfile", formdata); 
            if(response.status===201)
            {
                alert("Profile added successfully")
                navigate("/profiles")
            }
        } catch (error) {
            console.error("Error adding profile:", error);
        }
    }
    
    return (
            <div style={formContainer}>
                <h1>Add profile</h1>
                <form onSubmit={handleSubmit} style={formStyle}>
                    <label>Name:</label>
                    <input type="text" name="name" value={formdata.name} onChange={handleChange} required />

                    <label>Email:</label>
                    <input type="email" name="email" value={formdata.email} onChange={handleChange} required />

                    <label>Age:</label>
                    <input type="number" name="age" value={formdata.age} onChange={handleChange} required />

                    <label>Phone No:</label>
                    <input type="text" name="phoneNo" value={formdata.phoneNo} onChange={handleChange} required />

                    <label>Address Line:</label>
                    <input type="text" name="addressline" value={formdata.addressline} onChange={handleChange} required />

                    <label>City:</label>
                    <input type="text" name="city" value={formdata.city} onChange={handleChange} required />

                    <label>State:</label>
                    <input type="text" name="state" value={formdata.state} onChange={handleChange} required />

                    <label>Country:</label>
                    <input type="text" name="country" value={formdata.country} onChange={handleChange} required />

                    <label>Pincode:</label>
                    <input type="text" name="pincode" value={formdata.pincode} onChange={handleChange} required />

                    <button type="submit" style={buttonStyle}>Add Profile</button>
                </form>
            </div>
    );
}

/* Styles */

const formContainer = {
    display: "flex",
    flexDirection:"column",
    justifyContent: "center",
    alignItems: "center",
    width:"100%",
};

const formStyle = {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    width: "300px",
};

const buttonStyle = {
    backgroundColor: "#007BFF",
    color: "white",
    padding: "10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "10px",
};

export default AddProfile;
