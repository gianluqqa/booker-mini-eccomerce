export const validateReviewContract = (review: any) => {
  expect(review).toHaveProperty("id");
  expect(review).toHaveProperty("comment");
  expect(review).toHaveProperty("rating");
  expect(review).toHaveProperty("createdAt");
  expect(review).toHaveProperty("updatedAt");
  expect(review).toHaveProperty("bookId");
  expect(review).toHaveProperty("userId");
  expect(review).toHaveProperty("user");
  expect(review.user).toHaveProperty("id");
  expect(review.user).toHaveProperty("name");
  expect(review.user).toHaveProperty("surname");
};

export const validateReviewListContract = (body: any) => {
  expect(body).toHaveProperty("success", true);
  expect(body).toHaveProperty("data");
  expect(Array.isArray(body.data)).toBe(true);
  expect(body).toHaveProperty("meta");
  expect(body.meta).toHaveProperty("total");
  expect(body.meta).toHaveProperty("page");
  expect(body.meta).toHaveProperty("limit");
  expect(body).toHaveProperty("summary");
  expect(body.summary).toHaveProperty("averageRating");
  expect(body.summary).toHaveProperty("ratingDistribution");
};
