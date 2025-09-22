# **App Name**: MediFind AI

## Core Features:

- Emergency Banner: Display a prominent 'Emergency' banner with a call to action button using a destructive color scheme.
- Location Input with Autocomplete: Enable users to enter their location manually with Google Maps Places Autocomplete and also auto-detect location using browser Geolocation API.
- AI Symptom Analysis & Hospital Ranking: Analyze user-provided symptoms and rank nearby hospitals based on their relevance using the `rankHospitalsBySymptomsFlow` Genkit flow.  This ranking tool should provide a score and justification.
- Interactive Hospital Map: Display an interactive map with user location and hospital markers, highlighting the selected hospital.
- Hospital Details Sheet: Show detailed hospital information in a slide-over panel including contact details, services, and navigation links.
- Admin Page with Authentication: Implement a secure admin page using Firebase Authentication and CRUD form using react-hook-form to manage database effectively with server actions.
- Admin Dashboard: Create an admin dashboard to handle database CRUD gracefully.

## Style Guidelines:

- Primary color: A vibrant shade of off-white (#FAFAFA) for clear text on the main UI elements. Hex code was derived from the spec provided foreground color in Dark Mode.
- Background color: A very dark shade of blue/gray (#232738) provides a modern and calm backdrop. Derived from the Dark Mode background color.
- Accent color: A cooler tone (#4494d5) analogous to off-white offers a vibrant and contrasted user experience with a significant change in both saturation and brightness.
- Font: 'Poppins', a geometric sans-serif font, should be used for a modern and precise look.
- lucide-react: Icons from lucide-react library to ensure consistency.
- Responsive layout using Tailwind CSS for seamless adaptation across devices.
- Subtle animations for loading states, counters, and scroll transitions to enhance the user experience.