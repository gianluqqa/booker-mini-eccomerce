import { IPropsId } from "@/types/Props";
import BookDetail from "@/components/book/BookDetail";
import React from "react";

const BookForIdPage = ({ params }: IPropsId) => {
  return (
    <div>
      <BookDetail params={params} />
    </div>
  );
};

export default BookForIdPage;
