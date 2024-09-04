const crypto = require('crypto');
const dbClient = require('../utils/db');

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }

    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    try {
      // Access the users collection through the dbClient
      const usersCollection = dbClient.db.collection('users');

      // Check if the email already exists
      const user = await usersCollection.findOne({ email });
      if (user) {
        return res.status(400).json({ error: 'Already exist' });
      }

      // Hash the password with SHA1
      const sha1 = crypto.createHash('sha1');
      const hashedPassword = sha1.update(password).digest('hex');

      // Insert the new user
      const result = await usersCollection.insertOne({
        email,
        password: hashedPassword,
      });

      // Return the newly created user (without the password)
      return res.status(201).json({ id: result.insertedId, email });
    } catch (error) {
      console.error('Error occurred while creating a new user:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = UsersController;
