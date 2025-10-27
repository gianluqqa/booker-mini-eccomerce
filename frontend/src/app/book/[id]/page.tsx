import { IPropsId } from "@/interfaces/IProps";
import BookDetail from "@/views/BookDetail";
import React from "react";

const BookForIdPage = ({ params }: IPropsId) => {
  return (
    <div>
      <BookDetail params={params} />
    </div>
  );
};

export default BookForIdPage;
