export interface RawUniversityData {
  name: string;
  abbreviation: string;
  year: number;
  admitted: number;
  presented: number;
  passedCutoff: number;
  placesAwarded: number;
  percentagePresentedOverAdmitted: number;
  percentagePlacesOverPresented: number;
  percentagePlacesOverPassed: number;
}

export interface UniversityData extends RawUniversityData {
  withoutPlaceAbsolute: number;
  percentageWithoutPlaceOverPresented: number;
  rank: number;
}

export type ViewMode = 'COMPARISON' | 'EVOLUTION';

export interface Metric {
  key: keyof UniversityData;
  label: string;
  isPercentage: boolean;
}