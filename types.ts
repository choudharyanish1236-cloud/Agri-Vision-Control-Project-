
export type GrowthStage = 'Phase 1: Seedling' | 'Phase 2: Squareing' | 'Phase 3: Bloom' | 'Phase 4: Boll Development';

export interface AnalysisResult {
  stage: GrowthStage;
  stage_conf: number;
  is_anomaly: boolean;
  anomaly_prob: number;
  health_score: number;
  description: string;
  detected_regions: DetectedRegion[];
}

export interface DetectedRegion {
  box_2d: [number, number, number, number]; // [ymin, xmin, ymax, xmax]
  label: string;
  is_anomaly: boolean;
  confidence: number; // 0-1 value representing the model's certainty or severity
}

export type FeedbackStatus = 'none' | 'accurate' | 'incorrect';

export interface AnalysisHistoryItem extends AnalysisResult {
  id: string;
  timestamp: number;
  imageUrl: string;
  feedback?: {
    status: FeedbackStatus;
    issue?: string;
  };
}
