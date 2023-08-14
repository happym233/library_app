import { useState } from "react";
import BookModel from "../../models/BookModel";
import { useParams } from "react-router-dom";

export default function BookCheckoutPage() {
  const { bookId } = useParams<{ bookId: string }>();
  const [book, setBook] = useState<BookModel>();
  const [loading, setLoading] = useState(true);
  const [httpError, setHttpError] = useState<string>("");
  return <>{bookId}</>;
}
