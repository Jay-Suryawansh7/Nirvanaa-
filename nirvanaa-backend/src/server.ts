import express from 'express';
import cors from 'cors';
import './config/db'; // Connect to DB
import caseRoutes from './routes/caseRoutes';

import authRoutes from './routes/authRoutes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes); // Mount auth routes
app.use('/api/cases', caseRoutes);

const PORT = parseInt(process.env.PORT || '5001');

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}
