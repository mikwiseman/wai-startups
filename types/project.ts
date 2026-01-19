export type EmployeeRange = "<10" | "11-50" | "51-200" | "200+";

export type FundingStage =
  | "Pre-seed"
  | "Seed"
  | "Series A"
  | "Series B"
  | "Series C"
  | "Growth";

export interface Project {
  id: string;
  name: string;
  website?: string;
  description: string;

  // Classification
  industry: string;
  industryCategory: string;

  // Geography
  country: string;
  region: string;

  // Team & Size
  foundingYear: number;
  foundingTeam?: string;
  employees: number;
  employeeRange: EmployeeRange;

  // Financials
  stage: FundingStage;
  funding: number;
  fundingDisplay: string;

  // Technology
  techStack: string[];
  aiUseCase?: string;

  // Metadata
  tags: string[];
}

export interface ProjectFilters {
  industries: string[];
  countries: string[];
  regions: string[];
  stages: FundingStage[];
  employeeRanges: EmployeeRange[];
  search: string;
}

export type SortField = "name" | "funding" | "employees" | "foundingYear";
export type SortDirection = "asc" | "desc";

export interface ProjectSort {
  field: SortField;
  direction: SortDirection;
}
