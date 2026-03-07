export interface ICCOption {
  label: string;
  value: number;
}

export interface ICCDomain {
  id: string;
  name: string;
  description: string;
  options: ICCOption[];
}

export interface ICCThreshold {
  label: string;
  min: number;
  max: number;
  color: string;
}

export interface ICCConfig {
  domains: ICCDomain[];
  thresholds: ICCThreshold[];
}

export interface PatientRecord {
  id: string;
  patientId: string;
  unit: string;
  bed: string;
  date: string;
  scores: Record<string, number>;
  totalScore: number;
  category: string;
  alerts: {
    vm: boolean;
    fuga: boolean;
    aislamiento: boolean;
    lpp: boolean;
  };
  createdAt: string;
}

export interface UnitStats {
  unit: string;
  patientCount: number;
  avgScore: number;
  categories: Record<string, number>;
  alerts: {
    vm: number;
    fuga: number;
    aislamiento: number;
    lpp: number;
  };
}
