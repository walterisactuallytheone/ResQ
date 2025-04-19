const mongoose = require('mongoose');
require('dotenv').config();

console.log('Testing MongoDB connection...');
console.log('Connection string (masked):', process.env.MONGODB_URI.replace(/:[^:]*@/, ':****@'));

async function testConnection() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000
    });
    
    console.log('Connected to MongoDB successfully!');
    
    // Test creating a collection
    const testSchema = new mongoose.Schema({
      name: String,
      date: { type: Date, default: Date.now }
    });
    
    const TestModel = mongoose.model('Test', testSchema);
    
    // Create a test document
    const testDoc = new TestModel({ name: 'Test Document' });
    await testDoc.save();
    console.log('Created test document successfully!');
    
    // Retrieve the document
    const foundDoc = await TestModel.findOne({ name: 'Test Document' });
    console.log('Retrieved document:', foundDoc);
    
    // Clean up - delete the test document
    await TestModel.deleteOne({ _id: foundDoc._id });
    console.log('Deleted test document successfully!');
    
    mongoose.connection.close();
    console.log('Connection closed successfully');
    
  } catch (error) {
    console.error('MongoDB Test Error:', error);
    process.exit(1);
  }
}

testConnection(); 