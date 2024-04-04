// server.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');


const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors())

// MongoDB connection
mongoose.connect('mongodb+srv://sudharsa4252:Mongo4252@cluster0.g2cbou0.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'jobportal'
})
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// Mongoose Schema
const dataSchema = new mongoose.Schema({
    companyName:String,
    salaryMin: Number,
    salaryMax: Number,
    designation: String,
    jobLoc : String,
    image : String,
    jobAval: String 


});

const DataModel = mongoose.model('jobslist', dataSchema);

// Middleware
app.use(bodyParser.json());

// REST API endpoints
app.get('/api/data', async (req, res) => {
    try {
        const data = await DataModel.find();
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// post for giving the data through the postman
app.post('/api/data', async (req, res) => {
    try {
        const newDataArray = req.body; // Assuming req.body is an array of data objects

        // Save each data object in the array
        const savedDataArray = await Promise.all(newDataArray.map(async (data) => {
            const newData = new DataModel(data);
            return await newData.save();
        }));

        res.status(201).json(savedDataArray);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});


// Start server
app.listen(PORT, () =>{
 console.log('Server running on port ${PORT}')
});