
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function analyzeCottonImage(base64Image: string): Promise<AnalysisResult> {
  const model = "gemini-3-flash-preview";

  const prompt = `
    You are a specialized agricultural AI model for cotton plants (Gossypium hirsutum). 
    Analyze the provided image and return a precise JSON response evaluating growth stage and plant health.
    
    Growth Stages to consider:
    - Phase 1: Seedling (First true leaves appearing)
    - Phase 2: Squareing (Small floral buds appearing)
    - Phase 3: Bloom (White/pink flowers visible)
    - Phase 4: Boll Development (Green pods/white lint visible)
    
    Check for anomalies like:
    - Pests (Aphids, Bollworms)
    - Diseases (Wilt, Blight)
    - Nutritional stress (Yellowing leaves, stunted growth)
    
    Calculate the health_score using this formula: 100 * (stage_confidence * (1 - anomaly_probability)).
  `;

  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image.split(",")[1],
            },
          },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          stage: {
            type: Type.STRING,
            description: "The current growth stage of the cotton plant.",
          },
          stage_conf: {
            type: Type.NUMBER,
            description: "Confidence level of stage detection (0-1).",
          },
          is_anomaly: {
            type: Type.BOOLEAN,
            description: "Whether a health anomaly is detected.",
          },
          anomaly_prob: {
            type: Type.NUMBER,
            description: "Probability of an anomaly being present (0-1).",
          },
          health_score: {
            type: Type.INTEGER,
            description: "Calculated health score (0-100).",
          },
          description: {
            type: Type.STRING,
            description: "A detailed summary of the AI findings.",
          },
          detected_regions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                box_2d: {
                  type: Type.ARRAY,
                  items: { type: Type.NUMBER },
                },
                label: { type: Type.STRING },
              },
              required: ["box_2d", "label"],
            },
          },
        },
        required: ["stage", "stage_conf", "is_anomaly", "anomaly_prob", "health_score", "description", "detected_regions"],
      },
    },
  });

  try {
    const text = response.text;
    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("Invalid AI response format");
  }
}
