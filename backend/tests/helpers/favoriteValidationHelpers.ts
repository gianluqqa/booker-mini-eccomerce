export const validateBookContract = (book: any) => {
  expect(book).toHaveProperty("id");
  expect(book).toHaveProperty("title");
  expect(book).toHaveProperty("author");
  expect(book).toHaveProperty("price");
  expect(book).toHaveProperty("stock");
  expect(book).toHaveProperty("genre");
  expect(book).toHaveProperty("description");
};

export const validateFavoriteListContract = (body: any) => {
  expect(body).toHaveProperty("success", true);
  expect(body).toHaveProperty("data");
  expect(Array.isArray(body.data)).toBe(true);
};

export const validateToggleFavoriteResponse = (body: any) => {
  expect(body).toHaveProperty("success", true);
  expect(body).toHaveProperty("message");
  expect(body).toHaveProperty("data");
  expect(body.data).toHaveProperty("isFavorite");
  expect(typeof body.data.isFavorite).toBe("boolean");
};
