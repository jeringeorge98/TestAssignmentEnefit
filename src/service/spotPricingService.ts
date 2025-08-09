export interface SpotPrice {
  rate: number;
  curreny: string;
  lastUpdated: string;
}

export class SpotPricingService {
  private static averageRate = 0.45;
  static async getSpotPrice(): Promise<SpotPrice> {
    await new Promise((resolve) => setTimeout(resolve, 500)); // 5 sec delay
    const randomFactor = 0.25 + Math.random() * 0.4;
    const currentPrice = this.averageRate * randomFactor; //jus random number
    return {
      rate: Math.round(currentPrice * 100) / 100,
      curreny: "EUR",
      lastUpdated: new Date().toISOString(),
    };
  }
}
