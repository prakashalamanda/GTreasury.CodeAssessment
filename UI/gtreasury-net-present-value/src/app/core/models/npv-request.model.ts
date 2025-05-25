export interface NpvRequest {
  cashFlows: number[];
  lowerBoundRate: number;
  upperBoundRate: number;
  incrementRate: number;
}