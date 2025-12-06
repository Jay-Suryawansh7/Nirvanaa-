import express from 'express';
import cors from 'cors';
import './config/db'; // Connect to DB
import caseRoutes from './routes/caseRoutes';

export const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/cases', caseRoutes);

const PORT = parseInt(process.env.PORT || '5001');

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}
