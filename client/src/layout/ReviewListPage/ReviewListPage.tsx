import { useEffect, useState } from "react";
import Review from "../../models/Review";
import { useParams } from "react-router-dom";
import { agent } from "../../api/agent";
import { error } from "console";
import SpinnerLoading from "../../errors/SpinnerLoading";
import ErrorPage from "../../errors/ErrorPage";
import ReviewComponent from "../BookCheckoutPage/components/Review";
import Pagination from "../SearchBooksPage/components/Pagination";

export default function ReviewListPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [reviewsPerPage] = useState(5);
  const [totalAmountOfReviews, setTotalAmountOfReviews] = useState(0);
  const [totalPage, setTotalPages] = useState(0);

  const { bookId } = useParams<{ bookId: string }>();

  useEffect(() => {
    setIsLoading(true);
    agent.Review.getByBookId({
      book_id: parseInt(bookId!),
      page: currentPage - 1,
      size: reviewsPerPage,
    })
      .then(async (response) => {
        const reviewData = await response._embedded.reviews;
        setTotalAmountOfReviews(response.page.totalElements);
        setTotalPages(response.page.totalPages);
        const loadedReviews: Review[] = [];
        reviewData.forEach((review: any) => {
          loadedReviews.push(review);
        });

        setReviews(loadedReviews);
      })
      .catch((error: any) => {
        setHttpError(error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [currentPage]);

  if (isLoading) {
    return <SpinnerLoading />;
  }

  if (httpError) {
    return <ErrorPage message={httpError} />;
  }

  const indexOfFirstReview: number = (currentPage - 1) * reviewsPerPage + 1;
  const indexOfLastReview: number = Math.min(
    currentPage * reviewsPerPage,
    totalAmountOfReviews
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="container m-5">
      <div>
        <h3>Comments: ({reviews.length})</h3>
      </div>
      <p>
        {indexOfFirstReview} to {indexOfLastReview} of {totalAmountOfReviews}{" "}
        items;
      </p>
      <div className="row">
        {reviews.map((review) => (
          <ReviewComponent review={review} key={review.id} />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPage}
        paginate={paginate}
      />
    </div>
  );
}
