  const jwt = require('jsonwebtoken');
  const bcrypt = require('bcrypt');
  const User = require('../models/user');
  const dotenv = require('dotenv');

  dotenv.config();


  const generateJWT = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: '5d',
    });
  };


  const login = async (req, res) => {
    try {
      const { username, password } = req.body;


      const user = await User.findOne({ username });

      if (!user) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }


      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      
      const token = generateJWT(user._id);

    
      res.status(200).json({ token, user });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: error.message });
    }
  };


  const signup = async (req, res) => {
    try {
      const { username, email, password } = req.body;

    
      const hashedPassword = await bcrypt.hash(password, 10);

    
      const newUser = new User({ username, email, password: hashedPassword });

      await newUser.save();

      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ error: error.message });
    }
  };

  module.exports = { login, signup };
