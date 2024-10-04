// Modules
const express = require('express')
const path = require('path')

// Server initalization
const app = express()
const port = 3000

app.use(express.static(path.join(__dirname, 'public')))

// GET route for the home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'canvas.html')); 
});

// Server start
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});