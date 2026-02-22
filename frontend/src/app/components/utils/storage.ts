import { AssessmentResult } from "../types/health";

const STORAGE_KEY = "cvd_assessments";

export function saveAssessment(assessment: AssessmentResult): void {
  const assessments = getAssessments();
  assessments.unshift(assessment);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(assessments));
}

export function getAssessments(): AssessmentResult[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function getLatestAssessment(): AssessmentResult | null {
  const assessments = getAssessments();
  return assessments.length > 0 ? assessments[0] : null;
}

export function clearAssessments(): void {
  localStorage.removeItem(STORAGE_KEY);
}
