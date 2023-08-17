import { useEffect, useState } from "react";
import BookModel from "../../models/BookModel";
import { useParams } from "react-router-dom";
import { agent } from "../../api/agent";
import NotFound from "../../errors/NotFound";
import SpinnerLoading from "../../errors/SpinnerLoading";
import ErrorPage from "../../errors/ErrorPage";
import StarsReview from "../../components/StarsReview";
import CheckoutAndReviewBox from "./CheckoutAndReviewBox";
import Review from "../../models/Review";
import { error } from "console";
import { set } from "lodash";
import ReviewComponent from "./components/Review";
import LastestReviews from "./LatestReviews";

export default function BookCheckoutPage() {
  const { bookId } = useParams<{ bookId: string }>();
  const [book, setBook] = useState<BookModel>();
  const [loading, setLoading] = useState(true);
  const [httpError, setHttpError] = useState<string>("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [totalStarts, setTotalStars] = useState(0);
  const [isLoadingReview, setIsLoadingReview] = useState(true);

  useEffect(() => {
    setLoading(true);
    agent.Book.getById(parseInt(bookId!))
      .then(async (reponse) => {
        const responseData = await reponse;
        const loadedBook: BookModel = {
          id: responseData.id,
          title: responseData.title,
          author: responseData.author,
          description: responseData.description,
          copies: responseData.copies,
          copiesAvailable: responseData.copiesAvailable,
          category: responseData.category,
          img: responseData.img,
        };
        setBook(loadedBook);
      })
      .catch((error: any) => {
        setHttpError(error.message);
      })
      .finally(() => {
        setLoading(false);
        window.scrollTo(0, 0);
      });
  }, []);

  useEffect(() => {
    setIsLoadingReview(true);
    agent.Review.getByBookId({ book_id: parseInt(bookId!) })
      .then(async (response) => {
        const reviewData = await response._embedded.reviews;
        const loadedReviews: Review[] = [];
        let weightedStarReviews: number = 0;
        reviewData.forEach((review: any) => {
          loadedReviews.push(review);
          weightedStarReviews += review.rating;
        });
        if (loadedReviews) {
          const round = (
            Math.round((weightedStarReviews / loadedReviews.length) * 2) / 2
          ).toFixed(1);
          setTotalStars(Number(round));
          setReviews(loadedReviews);
        }
      })
      .catch((error: any) => {
        setHttpError(error.message);
      })
      .finally(() => {
        setIsLoadingReview(false);
      });
  }, []);

  if (!bookId) return <ErrorPage message="Book not found" />;

  if (loading || isLoadingReview) return <SpinnerLoading />;

  if (httpError) return <ErrorPage message={httpError} />;

  if (!book) return <ErrorPage message="Book not found" />;

  return (
    <div>
      <div className="container d-none d-lg-block">
        <div className="row mt-5">
          <div className="col-sm-2 col-md-2">
            <img
              src={
                book?.img ??
                require("./../../images/BooksImages/book-luv2code-1000.png")
              }
              width="226"
              height="349"
              alt="Book"
            />
          </div>
          <div className="col-4 col-md-4 container">
            <div className="ml-2">
              <h2>{book?.title}</h2>
              <h5 className="text-primary">{book?.author}</h5>
              <p className="lead">{book?.description}</p>
            </div>
          </div>
          <CheckoutAndReviewBox book={book} mobile={false} />
        </div>
        <hr />
        <LastestReviews
          reviews={reviews}
          bookId={parseInt(bookId)}
          mobile={false}
        />
      </div>
      <div className="container d-lg-none mt-5">
        <div className="d-flex justify-content-center align-items-center">
          <img
            src={
              book?.img ??
              require("./../../images/BooksImages/book-luv2code-1000.png")
            }
            width="226"
            height="349"
            alt="Book"
          />
        </div>
        <div className="mt-4">
          <div className="ml-2">
            <h2>{book?.title}</h2>
            <h5 className="text-primary">{book?.author}</h5>
            <p className="lead">{book?.description}</p>
            <StarsReview rating={4} size={24} />
          </div>
        </div>

        <CheckoutAndReviewBox book={book} mobile={true} />
        <hr />
        <LastestReviews
          reviews={reviews}
          bookId={parseInt(bookId)}
          mobile={true}
        />
      </div>
    </div>
  );
}
