const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
//const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

mongoose.connect('mongodb://localhost:27017/ALTAMEERDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoCreate: false,
});

//app.use(bodyParser.json());
app.use(express.json());
// Serve static files from the current directory
app.use(express.static(path.join(__dirname)));
// Serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/ACD.html');
});

// Get all collections with optional search term
app.get('/collections', async (req, res) => {
  try {
    // Fetch all collections from the database
    const allCollections = await mongoose.connection.db.listCollections().toArray();
    // Extract the collection names
    const allCollectionNames = allCollections.map(collection => collection.name);
    // Check if a search term is provided in the query parameters
    const searchTerm = req.query.search;
    // If there's a search term, filter the collection names
    const filteredCollections = searchTerm
    ? allCollectionNames.filter(collection => collection.toLowerCase().includes(searchTerm.toLowerCase())) : allCollectionNames;
    res.json(filteredCollections);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Get documents from a specific collection with optional search term
app.get('/collection/:name', async (req, res) => {
  try {
    const collectionName = req.params.name;
    const searchTerm = req.query.search;

    const collection = mongoose.connection.db.collection(collectionName);

    let documents;
    if (searchTerm) {
      // If there's a search term, filter documents based on the search
      documents = await collection.find({ $text: { $search: searchTerm } }).toArray();
    } else {
      // If no search term, retrieve all documents
      documents = await collection.find().toArray();
    }

    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Additional route to specifically handle /collections/CompaniesCollection
app.get('/collections/ProjectsCollection', async (req, res) => {
  try {
    const searchTerm = req.query.search;
    const collection = mongoose.connection.db.collection('ProjectsCollection');
    let documents;
    if (searchTerm) {
      // If there's a search term, filter documents based on the Company Name field
      documents = await collection.find({ 'Project Name': { $regex: new RegExp(searchTerm, 'i') } }).toArray();
    } else {
      // If no search term, retrieve all documents
      documents = await collection.find().toArray();
    }
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Additional route to specifically handle /collections/CompaniesCollection
app.get('/collections/CompaniesCollection', async (req, res) => {
  try {
    const searchTerm = req.query.search;
    const collection = mongoose.connection.db.collection('CompaniesCollection');
    let documents;
    if (searchTerm) {
      // If there's a search term, filter documents based on the Company Name field
      documents = await collection.find({ 'Company Name': { $regex: new RegExp(searchTerm, 'i') } }).toArray();
    } else {
      // If no search term, retrieve all documents
      documents = await collection.find().toArray();
    }
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new document in the specified collection
app.post('/create-document', async (req, res) => {
  try {
    const { collectionName, document } = req.body;

    // Get the collection
    const collection = mongoose.connection.db.collection(collectionName);

    // Insert the new document into the collection
    await collection.insertOne(document);

    res.json({ success: true, message: 'New document created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Add a new route to handle fetching documents from MembersCollection
app.get('/collections/MembersCollection', async (req, res) => {
  try {
    const searchTerm = req.query.search;
    const collection = mongoose.connection.db.collection('MembersCollection');
    let documents;
    if (searchTerm) {
      documents = await collection.find({ 'Member Name': { $regex: new RegExp(searchTerm, 'i') } }).toArray();
    } else {
      documents = await collection.find().toArray();
    }
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new route to handle creating a document in MembersCollection
app.post('/create-member-document', async (req, res) => {
  try {
    const { document } = req.body;
    const collection = mongoose.connection.db.collection('MembersCollection');
    await collection.insertOne(document);
    res.json({ success: true, message: 'New member document created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  });
