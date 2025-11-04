

const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    // Fork workers
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
    });
} else {
    const express = require('express');
    const cors = require('cors');
    const bodyParser = require('body-parser');
    const apiRoutes = require('./routes/apiRoutes');
    require('dotenv').config();  // For environment variables
    const path = require('path');
    const app = express();
    const port = process.env.PORT || 5000;
    const authenticateToken = require('./auth');

    app.use(cors());
    app.use(express.json());
    app.use(bodyParser.json());

    // Serve static files from React app's build folder
    app.use(express.static(path.join(__dirname, 'public')));
    // Middleware

    // API routes
    app.use('/api', apiRoutes);

    // Fallback route to serve React's index.html for unknown routes
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });

    // Protected route example
    app.get('/protected', authenticateToken, (req, res) => {
        res.json({ message: 'Protected route accessed', user: req.user });
    });

    // Start the server
    app.listen(port, () => {
        console.log(`Worker ${process.pid} running on port ${port}`);
    });
}