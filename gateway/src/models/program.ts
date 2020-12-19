export interface Program {
  id: number;
  name: string;
  description?: string;
  mainUrl: string;
  affiliateUrl: string;
  uniqueCode: string;
  status: string;
  productsCount: number;
  currency: string;
  workingCurrencyCode: string;
  defaultLeadCommissionAmount: null | string;
  defaultLeadCommissionType: null | string;
  defaultSaleCommissionRate: null | string;
  defaultSaleCommissionType: DefaultSaleCommissionType | null;
  averagePaymentTime: number;
  logoPath: string;
  category: string;
  sellingCountries: SellingCountry[];
  source: string;
  order: number;
}

export enum DefaultSaleCommissionType {
  Percent = 'percent',
  Variable = 'variable',
}

export interface SellingCountry {
  name: string;
  code: string;
  currency: string;
}
