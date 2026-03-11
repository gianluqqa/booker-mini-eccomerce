export interface CreateReviewDto {
  comment: string;
  rating: number;
  title?: string;
  bookId: string;
}

export interface UpdateReviewDto {
  comment?: string;
  rating?: number;
  title?: string;
}

export interface ReviewResponseDto {
  id: string;
  comment: string;
  rating: number;
  title?: string;
  createdAt: Date;
  updatedAt: Date;
  bookId: string;
  userId: string;
  user: {
    id: string;
    name: string;
    surname: string;
  };
  book?: {
    title: string;
    author: string;
  };
}

export interface ReviewListDto {
  reviews: ReviewResponseDto[];
  total: number;
  averageRating: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}
