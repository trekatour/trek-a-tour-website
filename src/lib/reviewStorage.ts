export interface CustomerReview {
  id: string;
  tripId: string;
  customerName: string;
  rating: number;
  reviewText: string;
  photos: string[];
  youtubeLinks: string[];
  reviewDate: string;
  isActive: boolean;
}

export interface TripRating {
  tripId: string;
  rating: number;
  reviewCount: number;
}

const REVIEWS_STORAGE_KEY = 'customerReviews';
const RATINGS_STORAGE_KEY = 'tripRatings';

// Customer Reviews Management
export const getCustomerReviews = (tripId?: string): CustomerReview[] => {
  const reviews = JSON.parse(localStorage.getItem(REVIEWS_STORAGE_KEY) || '[]');
  return tripId ? reviews.filter((r: CustomerReview) => r.tripId === tripId && r.isActive) : reviews;
};

export const saveCustomerReview = (review: Omit<CustomerReview, 'id'>): CustomerReview => {
  const reviews = getCustomerReviews();
  const newReview: CustomerReview = {
    ...review,
    id: Date.now().toString(),
  };
  reviews.push(newReview);
  localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
  return newReview;
};

export const updateCustomerReview = (reviewId: string, updates: Partial<CustomerReview>): void => {
  const reviews = getCustomerReviews();
  const index = reviews.findIndex(r => r.id === reviewId);
  if (index !== -1) {
    reviews[index] = { ...reviews[index], ...updates };
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
  }
};

export const deleteCustomerReview = (reviewId: string): void => {
  const reviews = getCustomerReviews();
  const filteredReviews = reviews.filter(r => r.id !== reviewId);
  localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(filteredReviews));
};

// Trip Ratings Management
export const getTripRating = (tripId: string): TripRating => {
  const ratings = JSON.parse(localStorage.getItem(RATINGS_STORAGE_KEY) || '[]');
  const existing = ratings.find((r: TripRating) => r.tripId === tripId);
  return existing || { tripId, rating: 4.8, reviewCount: 124 };
};

export const saveTripRating = (rating: TripRating): void => {
  const ratings = JSON.parse(localStorage.getItem(RATINGS_STORAGE_KEY) || '[]');
  const index = ratings.findIndex((r: TripRating) => r.tripId === rating.tripId);
  
  if (index !== -1) {
    ratings[index] = rating;
  } else {
    ratings.push(rating);
  }
  
  localStorage.setItem(RATINGS_STORAGE_KEY, JSON.stringify(ratings));
};

export const getAllTripRatings = (): TripRating[] => {
  return JSON.parse(localStorage.getItem(RATINGS_STORAGE_KEY) || '[]');
};
