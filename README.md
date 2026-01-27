# Agri-Vision Cotton AI

Agri-Vision Cotton AI is a high-precision agricultural monitoring tool designed for cotton farmers and researchers. Leveraging the power of the **Gemini 3 Flash** model, it provides real-time analysis of cotton plants through computer vision, identifying growth stages and localized health anomalies.

## 🌟 Key Features

- **Automated Phenology Tracking**: Detects the four primary cotton growth phases:
  - **Seedling**: First true leaves appearing.
  - **Squareing**: Development of floral buds.
  - **Bloom**: Visibility of white/pink flowers.
  - **Boll Development**: Formation of green pods and lint.
- **Precision Anomaly Localization**: Identifies and bounds pests (aphids, worms), diseases (wilt, leaf spots), and nutrient deficiencies.
- **Dynamic Severity Gauges**: Visual indicators next to bounding boxes reflect the risk level and confidence of detected issues using a color-coded gradient (Yellow to Red).
- **Health Scoring**: Calculates a global crop health index (0-100) based on stage match and anomaly density.
- **Historical Field Log**: A persistent sidebar history that tracks past analysis results, including timestamps and thumbnails.
- **Interactive Feedback Loop**: Allows users to confirm AI accuracy or report discrepancies to help refine future model performance.

## 🛠️ Technology Stack

- **AI Engine**: [Google Gemini API](https://ai.google.dev/) (`gemini-3-flash-preview`)
- **Frontend**: React 19 (ESM)
- **Styling**: Tailwind CSS
- **Visualization**: Recharts (for health score metrics)
- **Deployment**: Conceptually designed for Replit/Cursor environments with automatic module importing.

## 🚀 Setup & Installation

### Prerequisites
- A Google Gemini API Key.
- A development environment that supports modern ES modules (ESM).

### Environment Configuration
The application requires an API key to communicate with the Gemini models. This key is accessed via:
`process.env.API_KEY`

In most development environments (like Replit or Cursor), you should add this key to your Secrets or Environment Variables configuration.

### Running the Project
1. Ensure `index.html` and `index.tsx` are in the root directory.
2. Open `index.html` using a local development server (e.g., Live Server in VS Code) or the built-in preview in your cloud IDE.
3. The system will automatically import dependencies via the `importmap` defined in `index.html`.

## 📈 Guidelines for Best Results

- **Image Quality**: Use high-resolution, well-lit photos. Avoid blurry images or excessive shadows.
- **Focus**: Ensure the primary plant or leaf of interest is centered in the frame.
- **Angle**: A top-down or 45-degree angle usually provides the best view of squares, blooms, and bolls.
- **Feedback**: Consistent use of the "Report Issue" or "Correct" buttons helps build a dataset for potential future fine-tuning.

## 📝 Privacy & Permissions
- The app requests **Camera** permissions via `metadata.json` for real-time field capture.
- Images uploaded are processed by the Gemini API for analysis purposes.

---

*Part of the Agri-Vision precision agriculture suite.*