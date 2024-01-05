export interface CurrencyResponseModel {
  [key: string]: CurrencyRatesType;
}

export type CurrencyRatesType = Record<string, number>;
