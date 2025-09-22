'use server';

/**
 * @fileOverview Ranks hospitals based on user symptoms and provides a reason for the ranking.
 *
 * - rankHospitalsBySymptoms - A function that ranks hospitals based on symptoms.
 * - RankHospitalsBySymptomsInput - The input type for the rankHospitalsBySymptoms function.
 * - RankHospitalsBySymptomsOutput - The return type for the rankHospitalsBySymptoms function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RankHospitalsBySymptomsInputSchema = z.object({
  symptoms: z
    .string()
    .describe('The symptoms described by the user (e.g., chest pain, difficulty breathing).'),
  hospitals: z
    .array(z.string())
    .describe(
      'A list of nearby hospitals. Should contain the hospital names and their specialties.'
    ),
});
export type RankHospitalsBySymptomsInput = z.infer<
  typeof RankHospitalsBySymptomsInputSchema
>;

const RankHospitalsBySymptomsOutputSchema = z.array(
  z.object({
    hospital: z.string().describe('The name of the hospital.'),
    rank: z.number().describe('The rank of the hospital (lower is better).'),
    reason: z.string().describe('The reason for the ranking.'),
  })
);
export type RankHospitalsBySymptomsOutput = z.infer<
  typeof RankHospitalsBySymptomsOutputSchema
>;

export async function rankHospitalsBySymptoms(
  input: RankHospitalsBySymptomsInput
): Promise<RankHospitalsBySymptomsOutput> {
  return rankHospitalsBySymptomsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'rankHospitalsBySymptomsPrompt',
  input: {schema: RankHospitalsBySymptomsInputSchema},
  output: {schema: RankHospitalsBySymptomsOutputSchema},
  prompt: `You are an expert medical assistant.

You will analyze the symptoms described by the user and rank the provided hospitals based on their relevance to the symptoms.

Return a JSON array where each object contains the hospital name, its rank (lower is better), and a short reason for the ranking.

Symptoms: {{{symptoms}}}
Hospitals: {{#each hospitals}}{{{this}}}\n{{/each}}`,
});

const rankHospitalsBySymptomsFlow = ai.defineFlow(
  {
    name: 'rankHospitalsBySymptomsFlow',
    inputSchema: RankHospitalsBySymptomsInputSchema,
    outputSchema: RankHospitalsBySymptomsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
