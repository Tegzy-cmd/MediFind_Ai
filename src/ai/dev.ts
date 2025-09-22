import { config } from 'dotenv';
config();

import '@/ai/flows/explain-hospital-ranking.ts';
import '@/ai/flows/rank-hospitals-by-symptoms.ts';