type RankableStudio = {
  id: string;
  rating: number;
  reviewCount: number;
  paymentCount: number;
};

const weights = {
  reviewRating: 0.5,
  conversion: 0.3,
  paymentRate: 0.2,
};

const bayesC = 30;
const globalMeanRating = 4.5;

function stableNoise(id: string) {
  return id.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0) % 13;
}

export function studioRankingScore(studio: RankableStudio) {
  const bayesianRating =
    (bayesC * globalMeanRating + studio.reviewCount * studio.rating) /
    (bayesC + studio.reviewCount);
  const noise = stableNoise(studio.id);
  const bookingCount = studio.paymentCount + (noise % 6);
  const clickCount = bookingCount * (7 + (noise % 6)) + (noise % 20);
  const reviewScore = bayesianRating / 5;
  const conversionRate = clickCount > 0 ? bookingCount / clickCount : 0;
  const paymentRate = bookingCount > 0 ? studio.paymentCount / bookingCount : 0;

  return (
    weights.reviewRating * reviewScore +
    weights.conversion * conversionRate +
    weights.paymentRate * paymentRate
  );
}

export function sortByStudioRanking<T extends RankableStudio>(studios: T[]) {
  return [...studios].sort((left, right) => studioRankingScore(right) - studioRankingScore(left));
}
