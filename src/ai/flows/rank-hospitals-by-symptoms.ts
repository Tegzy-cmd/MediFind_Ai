'use server';
/**
 * @fileOverview Ranks hospitals based on user-provided symptoms.
 *
 * - rankHospitalsBySymptoms - A function that ranks hospitals based on symptoms.
 * - RankHospitalsBySymptomsInput - The input type for the rankHospitalsBySymptoms function.
 * - RankHospitalsBySymptomsOutput - The output type for the RankHospitalsBySymptoms function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RankHospitalsBySymptomsInputSchema = z.object({
  symptoms: z
    .string()
    .describe('The symptoms described by the user (e.g., chest pain, difficulty breathing).'),
  hospitals: z
    .array(z.object({name: z.string(), specialties: z.array(z.string())}))
    .describe('A list of nearby hospitals with their names and specialties.'),
});

export type RankHospitalsBySymptomsInput = z.infer<
  typeof RankHospitalsBySymptomsInputSchema
>;

const RankHospitalsBySymptomsOutputSchema = z.array(z.object({
  hospital: z.string().describe('The name of the hospital.'),
  rank: z.number().describe('The rank of the hospital (1 being the highest).'),
  reason: z.string().describe('The reason for the ranking.'),
}));

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
  prompt: `You are an expert medical assistant tasked with ranking hospitals based on their relevance to a patient's symptoms.\
  Given the following symptoms: {{{symptoms}}}, rank the following hospitals based on how well their specialties align with the symptoms.\
  Provide a numbered JSON list in the format:\
  [{\"hospital\": \"Hospital Name\", \"rank\": 1, \"reason\": \"Explanation for the ranking\"}, ...].  The list must include ALL hospitals.
  Hospitals: {{#each hospitals}}{{\n    name: name, specialties: specialties\n  }}{{/each}}\n  Ensure that the ranks are consecutive integers starting from 1, and each hospital has a unique rank.\
  The reason should be short and concise.\
  Rank the hospitals and include a detailed explanation for each ranking.\
  `,
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
