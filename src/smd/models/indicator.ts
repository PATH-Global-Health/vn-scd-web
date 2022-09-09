enum ReadType {
  NORMAL = 0,
  RATE = 1,
  PAYMENT = 2,
}

export interface Indicator {
  id: string;
  code: string;
  description: string;
  name: string;
  type: ReadType;
}
export interface IndicatorSummary {
  indicatorId: Indicator['id'];
  indicatorName: Indicator['name'];
  indicatorCode: Indicator['code'];
  value: number;
  packageCode: string;
  packageNumber: number;
  valueType: ReadType | string;
}
