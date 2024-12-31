const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser()); // To handle cookies


// MySQL Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Replace with your MySQL username
    password: 'Shikhar123', // Replace with your MySQL password
    database: 'smart_city',
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database.');
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));



// Signup Route
app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Hashed Password:', hashedPassword); // Debugging

        // Insert new user into database
        const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
        db.query(query, [username, email, hashedPassword], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).send('User already exists.');
                }
                console.error('Database Error:', err);
                return res.status(500).send('Error creating user.');
            }
            res.redirect('login.html');
        });
    } catch (error) {
        console.error('Unexpected Error:', error);
        res.status(500).send('Error creating user.');
    }
});

// Login Route
app.post('/login', async (req, res) => {
    console.log('Request Body:', req.body); // Debugging
    const { email, password } = req.body;

    try {
        // Find user in the database
        const query = 'SELECT * FROM users WHERE LOWER(email) = ?';
        db.query(query, [email.toLowerCase()], async (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).send('Error logging in.');
            }

            console.log('Query Results:', results); // Debugging

            if (results.length === 0) {
                console.log('Email not found:', email);
                return res.status(401).send('Invalid credentials.');
            }

            const user = results[0];
            console.log('Stored Hash:', user.password); // Debugging
            console.log('Provided Password:', password); // Debugging

            // Compare hashed password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            console.log('Password Valid:', isPasswordValid); // Debugging

            if (!isPasswordValid) {
                return res.status(401).send('Invalid credentials.');
            }

            // Store username in a cookie
            res.cookie('username', user.username, { httpOnly: true });

            res.redirect('/home.html'); // Ensure home.html is served as a static file
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        res.status(500).send('Error logging in.');
    }
});

// API to get logged-in user's name
app.get('/api/username', (req, res) => {
    const username = req.cookies.username;
    if (username) {
        res.json({ username });
    } else {
        res.status(401).send('Not logged in.');
    }
});

app.post('/api/logout', (req, res) => {
    res.clearCookie('username'); // Clear any cookies
    res.status(200).send('Logged out');
});


// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


