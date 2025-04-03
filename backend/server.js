const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId} = require('mongodb');
const cors = require('cors');
require('dotenv').config()
const uri=process.env.MONGO_URI
const app = express();
const PORT = process.env.PORT || 4000

const corsOptions = {
    origin: 'http://localhost:5173',
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

let users;


//mongodb connection
async function connect() {
    try {
        const client = await MongoClient.connect(
            uri
        );
        const myDB = client.db("Profiles");
        users = myDB.collection("users");
        console.log("Connected to the database");
    } catch (err) {
        console.error('Error connecting to the database:', err);
    }
}

connect().then();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


app.get("/",async (req,res)=>{
    res.send(`server running`)
})

app.post("/addProfile", async (req, res) => {
    try {
        console.log(req.body);
        const { name, email, age, phoneNo, addressline, city, state, country, pincode } = req.body;

        if (!users) {
            return res.status(500).json({ error: "Database not connected yet" });
        }

        // Check if user already exists
        const existingUser = await users.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with the same email" });
        }

        // Insert new user
        const result = await users.insertOne(req.body);
        res.status(201).json({ message: "Profile added successfully", insertedId: result.insertedId });

    } catch (err) {
        console.error("Error adding profile:", err);
        res.status(500).json({ error: "Failed to add profile" });
    }
});

app.get("/allProfiles", async (req, res) => {
    try {
        const profiles = await users.find({}).toArray();
        res.status(200).json(profiles);
    } catch (err) {
        console.error("Error fetching profiles:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

app.get("/userprofile/:email", async (req, res) => {
    try {
        const { email } = req.params;
        const user = await users.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).send(user);
    } catch (err) {
        console.error("Error fetching user profile:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


app.put("/userprofile/:email", async (req, res) => {
    try {
        const { email } = req.params;
        const updateData = { ...req.body };

        // Ensure _id is not part of the update data
        delete updateData._id;

        const updatedProfile = await users.findOneAndUpdate(
            { email }, 
            { $set: updateData }, 
            { new: true } // Return the updated document
        );

        if (!updatedProfile) {
            return res.status(404).json({ error: "Profile not found" });
        }

        res.json(updatedProfile);
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


app.delete('/deleteProfile/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      // Check if the provided ID is a valid ObjectId
      if (!ObjectId.isValid(id)) {
        return res.status(400).send('Invalid profile ID');
      }
  
      const result = await users.deleteOne({ _id: new ObjectId(id) });
  
      if (result.deletedCount > 0) {
        res.status(200).send('deleted successfully');
      } else {
        res.status(404).send('Profile not found');
      }
    } catch (error) {
      console.error('Error deleting profile:', error);
      res.status(500).send('Failed to delete profile');
    }
  });

