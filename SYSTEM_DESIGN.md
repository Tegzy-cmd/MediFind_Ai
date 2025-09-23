### **CHAPTER FOUR: SYSTEM DESIGN AND IMPLEMENTATION**

This chapter details the technical design and implementation of the MediFind web application. It covers the system's architecture, data structures, algorithms, and the technological environment in which it operates.

#### **4.1 System Input and Output Design**

**System Inputs:**

1.  **User Location:**
    *   **Automatic:** The user can grant permission for the application to access their device's GPS coordinates (latitude and longitude) via the browser's Geolocation API.
    *   **Manual:** The user can type an address or place name into a search bar. This text string is sent to the Google Geocoding API to be converted into geographic coordinates.
2.  **User Symptoms:**
    *   The user enters a natural language description of their medical symptoms into a textarea (e.g., "severe chest pain and shortness of breath").
3.  **Hospital Data (Admin Input):**
    *   Administrators input hospital information through a dedicated form in the `/admin` section. This includes the hospital's name, address, contact number, coordinates, and comma-separated lists of specialties and services.
4.  **User Interaction:**
    *   Clicks on hospitals in the list or on the map to view details.
    *   Clicks on buttons for navigation, calling, or getting directions.

**System Outputs:**

1.  **Ranked Hospital List:**
    *   The primary output is a list of nearby hospitals, sorted based on an AI-generated ranking that considers the user's symptoms and the hospital's specialties. For users who do not input symptoms, the list is sorted by proximity.
    *   Each list item displays the hospital's name, distance, AI rank (if applicable), and key specialties.
2.  **Interactive Map:**
    *   A map displaying markers for the user's location and all nearby hospitals. Selected hospitals are highlighted with a distinct marker.
3.  **Hospital Details View:**
    *   A detailed view (pop-up sheet) for a selected hospital, showing its name, address, contact info, distance, AI-generated ranking and reasoning, and full lists of specialties and services.
4.  **Directions and Communication:**
    *   The application generates links that open Google Maps for turn-by-turn directions and initiates phone calls to the hospital or emergency services.
5.  **Admin Dashboard:**
    *   An administrative interface displaying a table of all hospitals in the database, with options to edit or delete each entry.

---

#### **4.2 System Architecture in terms of tiers**

The MediFind application is built upon a modern, distributed, three-tier architecture that leverages serverless and client-side technologies.

1.  **Presentation Tier (Client-Side):**
    *   This tier runs in the user's web browser. It is built with **Next.js** and **React**, creating a highly interactive and responsive single-page application (SPA).
    *   **ShadCN UI** and **Tailwind CSS** are used for styling and component-based design, ensuring a modern and consistent user interface.
    *   **Google Maps API** is integrated for all mapping and geocoding functionalities.
    *   This tier is responsible for rendering the UI, capturing all user inputs, and managing client-side state (e.g., user location, selected hospital).

2.  **Application Tier (Server-Side Logic):**
    *   This tier consists of serverless functions and backend logic hosted on the **Firebase App Hosting** platform.
    *   **Next.js Server Components and Server Actions** handle initial page rendering and secure communication with the backend.
    *   **Genkit (Google's Generative AI Toolkit)** forms a critical part of this tier. It hosts the AI "flow" (`rankHospitalsBySymptoms`) that communicates with a **Google Gemini Large Language Model (LLM)** to process user symptoms and rank hospitals. This AI logic is exposed as a secure server-side function.

3.  **Data Tier (Backend Storage):**
    *   This tier is implemented entirely using **Google Firebase** services.
    *   **Firestore**, a NoSQL document database, is used to store all hospital data (names, locations, specialties, etc.) and user profiles. Its real-time capabilities and scalable nature make it ideal for this application.
    *   **Firebase Authentication** is used to manage user accounts, providing a secure way to distinguish between regular users and administrators.

---

#### **4.3 Structured Programming Environment**

The application is developed using a structured and strongly-typed programming environment centered around **TypeScript**.

*   **Language:** TypeScript is used for both the frontend (React/Next.js) and backend (Genkit AI flows), ensuring type safety, improved developer tooling, and reduced runtime errors.
*   **Framework:** **Next.js** provides the core structure, including file-based routing (App Router), server and client components, and an optimized build process.
*   **Component-Based Architecture:** The UI is broken down into reusable **React components** (e.g., `HospitalList`, `MapView`, `SymptomChecker`), promoting modularity and maintainability.
*   **State Management:** Client-side state is managed using React hooks (`useState`, `useEffect`, `useCallback`), a standard and structured approach for functional components.
*   **AI Flows:** Generative AI logic is encapsulated within **Genkit flows**. These are structured, testable functions that define inputs, outputs, and the specific prompts sent to the AI model, separating AI logic from the main application code.

---

#### **4.4 Data Dictionary**

This dictionary defines the key data entities and their attributes used within the MediFind system.

| Field Name | Data Type | Description | Example |
| :--- | :--- | :--- | :--- |
| **Hospital** | `Object` | Represents a single medical facility. | |
| `id` | `String` | Unique identifier generated by Firestore. | `k3j4h5g6f7d8s9a0` |
| `name` | `String` | The official name of the hospital. | `General Hospital` |
| `address` | `String` | The full street address of the hospital. | `123 Main St, Calabar, Nigeria` |
| `contact` | `String` | The primary phone number for the hospital. | `+234-80-1234567` |
| `coordinates` | `Object` | Geographic coordinates. | `{ lat: 4.9765, lng: 8.3473 }` |
| `specialties` | `Array<String>`| List of medical specialties available. | `["Cardiology", "Neurology"]` |
| `services` | `Array<String>` | List of medical services offered. | `["MRI", "X-Ray", "Emergency Room"]`|
| | | | |
| **UserProfile** | `Object` | Represents a user of the application. | |
| `uid` | `String` | Unique user ID from Firebase Auth. | `xYz1a2B3c4D5e6F7g8` |
| `email` | `String` | The user's email address. | `admin@medifind.com` |
| `role` | `String` | User's permission level. | `admin` or `viewer` |
| `createdAt` | `Timestamp` | The date the user profile was created. | `2024-10-27T10:00:00Z` |

---

#### **4.5 Database File Format**

The application uses **Google Firestore**, a NoSQL document-oriented database. Data is not stored in traditional file formats but in collections of documents.

*   **Collections:** The database is organized into collections, which are containers for documents. The primary collections are `hospitals` and `users`.
*   **Documents:** Each entry in a collection is a document, which is a set of key-value pairs. Each hospital and each user profile is stored as a separate document.
*   **Data Format:** The data within documents is stored in a JSON-like format, supporting strings, numbers, booleans, arrays, objects (maps), and timestamps. This flexible schema allows for easy storage and retrieval of complex objects like the `Hospital` and `UserProfile` entities.

There is no physical file format; data is accessed exclusively through the Firebase SDKs, which handle the underlying data storage and retrieval mechanisms.

---

#### **4.6 Program Algorithm**

The core algorithm of the MediFind application is the **AI-Powered Hospital Ranking**.

1.  **Initialization:**
    *   The application fetches a complete list of all available hospitals from the Firestore database upon loading.

2.  **Input Gathering:**
    *   The system obtains the user's geographic location (latitude, longitude), either automatically or through manual input.
    *   The system captures the's symptoms as a text string from the Symptom Checker form.

3.  **Data Preparation:**
    *   The application prepares an input object for the Genkit AI flow. This object contains:
        *   `symptoms`: The raw text string from the user.
        *   `hospitals`: An array of simplified hospital objects, containing only their `name` and `specialties`.

4.  **AI Processing (Genkit Flow):**
    *   The input object is sent to the `rankHospitalsBySymptoms` server-side flow.
    *   Inside the flow, a prompt is constructed that instructs the Gemini LLM to act as an expert medical assistant.
    *   The prompt includes the user's `symptoms` and the list of `hospitals` with their specialties.
    *   The LLM analyzes the symptoms and evaluates how well each hospital's specialties match the potential medical needs.
    *   The model is instructed to return a structured JSON array, where each object contains the `hospital` name, a `rank`, and a `reason` for the ranking.

5.  **Result Merging and Sorting:**
    *   The application receives the ranked list from the AI flow.
    *   It merges this AI-generated data (rank and reason) with the full hospital data from the initial Firestore fetch.
    *   It calculates the Haversine distance from the user's location to each hospital.
    *   The final list of hospitals is sorted first by the AI `rank` (ascending), and then by `distance` (ascending) as a tie-breaker.

6.  **Output Display:**
    *   The sorted and enriched list of hospitals is displayed to the user in the UI and plotted on the map.

---

#### **4.7 Program Flowcharts**

*(Due to the text-based format, a visual flowchart cannot be created. The following is a textual representation of the main user flow.)*

**Main User Flow (Symptom Check)**

```
START
  |
  |--> [User opens MediFind application]
  |
  |--> [App Fetches All Hospitals from Firestore]
  |
  |--> [User provides location (auto or manual)]
  |
  |--> [User enters symptoms into textarea]
  |
  |--> [User clicks "Find Best Facility"]
  |
  |--> [Client prepares data: {symptoms, hospital_list}]
  |
  |--> [Client sends data to `rankHospitalsBySymptoms` AI Flow]
  |      /                                          \
  |     /--(AI Flow sends prompt with data to Gemini)--\
  |      \                                          /
  |--> [AI Flow receives structured JSON {rank, reason}]
  |
  |--> [Client receives ranked data from AI Flow]
  |
  |--> [Client merges AI ranks and reasons with full hospital data]
  |
  |--> [Client calculates distance to each hospital]
  |
  |--> [Client sorts hospitals by AI Rank, then by Distance]
  |
  |--> [Display sorted list and map markers to the user]
  |
  `--> END
```

**Admin User Flow (Add Hospital)**

```
START
  |
  |--> [Admin navigates to /admin route]
  |
  |--> [Admin clicks "Add Hospital" button]
  |
  |--> [Display "Add New Hospital" form/dialog]
  |
  |--> [Admin fills out hospital details (name, address, etc.)]
  |
  |--> [Admin clicks "Save Hospital"]
  |
  |--> [Client-side validation of form data]
  |      |
  |      `-- (If Invalid) --> [Display error messages]
  |      |
  |--> (If Valid) --> [App sends data to `addHospital` Firestore function]
  |
  |--> [Data is written to the 'hospitals' collection in Firestore]
  |
  |--> [UI refreshes to show the new hospital in the table]
  |
  `--> END
```

---

#### **4.8 Hardware Requirements**

The MediFind application is a web-based platform, meaning the primary hardware requirements are on the user's end device.

*   **Client Device:**
    *   A modern computer, smartphone, or tablet with a web browser.
    *   An active internet connection.
    *   (Optional) A functioning GPS receiver for automatic location detection.
*   **Server Hardware:**
    *   None. The application is built on a **serverless** architecture. All backend infrastructure, including compute resources for the Next.js application, AI model execution, and the database, is managed automatically by Google Cloud and Firebase.

---

#### **4.9 Software Requirements**

*   **Client Software:**
    *   A modern web browser that supports HTML5, CSS3, JavaScript (ES6+), and the Geolocation API.
    *   **Examples:** Google Chrome (latest version), Mozilla Firefox (latest version), Apple Safari (latest version), Microsoft Edge (latest version).
*   **Server/Development Software:**
    *   **Node.js:** A JavaScript runtime environment required for running Next.js and Genkit.
    *   **Next.js:** The core React framework.
    *   **TypeScript:** For static typing.
    *   **Firebase SDK:** For interaction with Firestore and Firebase Auth.
    *   **Genkit AI SDK:** For defining and running generative AI flows.
    *   **Google Cloud Project:** Required to provision and manage Firebase services and Google AI models.

---

### **CHAPTER FIVE: SUMMARY, CONCLUSION AND RECOMMENDATION**

#### **5.1 Summary**

The MediFind project is a modern web application designed to address a critical need: rapidly locating the most suitable medical facility during an emergency. The system empowers users by providing an intuitive map-based interface to find nearby hospitals. Its key innovation lies in the integration of a generative AI model, which analyzes a user's described symptoms to provide an intelligent ranking of facilities based on their medical specialties. This goes beyond simple proximity-based searches, offering a crucial layer of decision support when time is of the essence.

The system also includes a secure administrative dashboard for managing the hospital database, ensuring the information presented to users is accurate and up-to-date. The technical architecture is built on a robust, scalable, and modern stack, utilizing Next.js for the frontend, Firebase for the backend and database, and Google's Genkit for orchestrating the AI capabilities.

#### **5.2 Conclusion**

The MediFind application has been successfully designed and implemented to meet its core objectives. It effectively integrates location services, database management, and advanced artificial intelligence to create a powerful and user-friendly tool. The system successfully demonstrates the practical application of Large Language Models (LLMs) in providing real-world assistance, transforming a simple directory into an intelligent recommendation engine. The serverless architecture ensures high availability and scalability with minimal operational overhead, making it a cost-effective and reliable solution. The final product is a testament to how modern web and AI technologies can be combined to build applications with significant societal value.

#### **5.3 Recommendation**

While the current system is fully functional, several enhancements could further increase its value and utility. The following are recommended for future development:

1.  **Real-Time Hospital Status:** Integrate with hospital API's (where available) to provide real-time information on emergency room wait times and bed availability. This would be the single most impactful future enhancement.
2.  **User Authentication for Public:** Implement a user authentication system for the general public to allow features like saving a personal profile (e.g., blood type, allergies), favorite hospitals, and search history.
3.  **Expanded AI Capabilities:**
    *   **Multi-Language Support:** Allow users to enter symptoms in multiple languages.
    *   **Triage Severity:** Enhance the AI to provide a preliminary assessment of symptom severity (e.g., "This sounds serious, please call 911 immediately") while reinforcing that it is not a substitute for professional medical advice.
4.  **Offline Functionality:** Implement Progressive Web App (PWA) features, allowing users to load the application and access cached hospital data even with an unstable internet connection.
5.  **Native Mobile Application:** Develop native iOS and Android applications to provide a more seamless user experience, better integration with device hardware (GPS, phone), and push notification capabilities.