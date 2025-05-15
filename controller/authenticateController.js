const db = require("../models/dbConnection");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

//login
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const results = await db.queryPromise('SELECT * FROM admin WHERE email = ?', [email])
    
      // Check if a user with the provided email exists
      if (results.length === 0) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
      }

      // Compare the provided password with the stored password hash (you may use bcrypt)
      const user = results[0];
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
          res.status(401).json({ message: 'Invalid Password' });
          return;
      }

      // Generate a JWT token
      const token = jwt.sign({ userId: user.id, email }, 'Bearar');

      // Successful login
      res.status(200).json({ message: 'Login successful', email: user.email, token });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
}

//signup
exports.signup = async (req, res) => {
  const { name, mobile, email, password } = req.body;

  try {
    // Hash the password using bcryptjs
    bcrypt.hash(password, 10, async (err, hashedPassword) => {
      if (err) {
        res.status(500).json({ error: err, message: "Internal Server Error" });
        return;
      }
      let form_data = { email, password: hashedPassword, name, mobile }

      //check if already exist
      const r = await db.queryPromise('SELECT * FROM admin WHERE email = ?', [email])
      
      if(r.length>0) {
        res.status(409).json({ message : 'Email Already Exist'});
        return 
      }
  
      //insert data in admin table
      const results = await db.queryPromise('INSERT INTO admin SET ?', form_data)

      //check if already exist
      const user = await db.queryPromise('SELECT * FROM admin WHERE id = ?', [results.insertId])

      // Generate a JWT token
      const token = jwt.sign({ userId: results.insertId, email }, 'Bearar', );
      // create account successfully
      res.status(200).json({ message: 'Account created successfully', email: user[0].email, created_at: user[0].created_at, updated_at: user[0].updated_at, token });
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

//reset password
exports.resetPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user_id = req.user.userId; // Assuming you've stored userId in the token

  try {

    // Hash the password using bcryptjs
    bcrypt.hash(newPassword, 10, async (err, hashedPassword) => {
      if (err) {
        res.status(500).json({ error: err, message: "Internal Server Error" });
      return;
      }

      //user is exist or not
      const result = await db.queryPromise('SELECT * FROM admin WHERE id = ?', [user_id])

      // Check if a user not exist
      if (result.length === 0) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      // Check if the old password is correct
      const passwordMatch = await bcrypt.compare(oldPassword, result[0].password);

      //if old password not matched
      if (!passwordMatch) {
        res.status(401).json({ message: 'Old Password is Incorrect' });
        return;
      }

      // If both password and user_id are valid, reset the password
      await db.queryPromise('UPDATE admin SET password = ? WHERE id = ?', [hashedPassword, user_id])
      res.status(200).json({ message: 'Password has been succesfully changed'});
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

