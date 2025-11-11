import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { registerEndpoint } from './routes/register';
import { listEndpoints } from './routes/list';
import { useService } from './routes/useService';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// API Routes
app.post('/api/register', registerEndpoint);
app.get('/api/list', listEndpoints);
app.post('/api/use', useService);

app.get('/health', (req: express.Request, res: express.Response) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});

