import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import errorHandler from './middleware/errorHandler';
import { authRouter } from './routes/auth';
import { tradersRouter } from './routes/traders';
import { twilioWebhookRouter } from './webhooks/twilio';


const app = express();

app.use(helmet());

const corsOptions = {
  origin: function (origin: any, callback: any) {
    if (!origin || [
      "http://localhost:5173",
      "https://market-padi-gold.vercel.app"
    ].indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});
app.use(globalLimiter);

app.get('/', (_req, res) => {
    res.json({ status: 'ok', message: "MarketPadi API" });
});
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const v1 = express.Router();
v1.use('/auth', authRouter);
v1.use('/traders', tradersRouter);
app.use('/api/v1', v1);


app.use('/webhook', express.urlencoded({ extended: false }), twilioWebhookRouter);

app.use(errorHandler);

export { app };
