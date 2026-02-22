export type ReportHandler = (metric: any) => void;

declare const reportWebVitals: (onPerfEntry?: ReportHandler) => void;

export default reportWebVitals;
