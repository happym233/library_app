import { useEffect, useState } from "react";
import BookModel from "../../models/BookModel";
import { useNavigate, useParams } from "react-router-dom";
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
import { useOktaAuth } from "@okta/okta-react";
import ReviewRequest from "../../models/ReviewRequest";

export default function BookCheckoutPage() {
  const navigate = useNavigate();
  const { authState } = useOktaAuth();
  const { bookId } = useParams<{ bookId: string }>();
  const [book, setBook] = useState<BookModel>();
  const [loading, setLoading] = useState(false);
  const [httpError, setHttpError] = useState<string>("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [totalStarts, setTotalStars] = useState(0);
  const [isLoadingReview, setIsLoadingReview] = useState(false);
  const [currentLoansCount, setCurrentLoansCount] = useState(0);
  const [isLoadingCurrentLoansCount, setIsLoadingCurrentLoansCount] =
    useState(false);
  const [isCheckedOut, setIsCheckedOut] = useState(false);
  const [isLoadingCheckedOut, setIsLoadingBookCheckedOut] = useState(false);

  const [isReviewLeft, setIsReviewLeft] = useState(false);
  const [isLoadingUserReview, setIsLoadingUserReview] = useState(false);

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
  }, [isCheckedOut]);

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

  useEffect(() => {
    if (!authState || !authState.isAuthenticated) return;
    setIsLoadingCurrentLoansCount(true);
    agent.Book.getCurrentLoansCount({
      Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
      "Content-Type": "application/json",
    })
      .then(async (response) => {
        setCurrentLoansCount(parseInt(response));
      })
      .catch((error: any) => {
        if (error.response.status === 401) navigate("/login");
        setHttpError(error.message);
      })
      .finally(() => {
        setIsLoadingCurrentLoansCount(false);
      });
  }, [authState, isCheckedOut]);

  useEffect(() => {
    if (!bookId) return;
    if (authState && authState.isAuthenticated) {
      setIsLoadingBookCheckedOut(true);
      agent.Book.getUserCheckedOut(
        {
          bookId: bookId,
        },
        {
          Authorization: `Bearer ${authState.accessToken?.accessToken}`,
          "Content-Type": "application/json",
        }
      )
        .then((response) => {
          setIsCheckedOut(response);
        })
        .catch((error) => {
          setHttpError(error.message);
        })
        .finally(() => {
          setIsLoadingBookCheckedOut(false);
        });
    }
  }, [authState, bookId, isCheckedOut]);

  useEffect(() => {
    if (!authState || !authState.isAuthenticated) return;
    setIsLoadingUserReview(true);
    agent.Review.getReviewBookByUser(parseInt(bookId!), authState)
      .then((response) => {
        setIsReviewLeft(response);
      })
      .catch((error) => {
        setHttpError(error.message);
      })
      .finally(() => {
        setIsLoadingUserReview(false);
      });
  }, [authState]);

  const checkoutBook = async () => {
    if (!bookId) return;
    agent.Book.checkOutBook(parseInt(bookId!), authState)
      .then((response) => {
        setIsCheckedOut(true);
      })
      .catch((error) => {
        console.log(error.message);
      })
      .finally(() => {});
  };

  async function submitReview(starInput: number, reviewDescription: string) {
    let bookId: number = 0;
    if (book?.id) {
      bookId = book.id;
    }
    const reviewRequest = new ReviewRequest(
      starInput,
      bookId,
      reviewDescription
    );
    agent.Review.postReview(reviewRequest, authState)
      .then((response) => {
        setIsReviewLeft(true);
      })
      .catch((error: any) => {
        console.log(error);
      });
  }

  if (!bookId) return <ErrorPage message="Book not found" />;

  if (
    loading ||
    isLoadingReview ||
    isLoadingCurrentLoansCount ||
    isLoadingCheckedOut ||
    isLoadingUserReview
  )
    return <SpinnerLoading />;

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
          <CheckoutAndReviewBox
            book={book}
            mobile={false}
            currentLoanCount={currentLoansCount}
            isAuthenticated={authState?.isAuthenticated}
            isCheckedOut={isCheckedOut}
            checkoutBook={checkoutBook}
            isReviewLeft={isReviewLeft}
            submitReview={submitReview}
          />
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
            <StarsReview rating={totalStarts} size={24} />
          </div>
        </div>

        <CheckoutAndReviewBox
          book={book}
          mobile={true}
          currentLoanCount={currentLoansCount}
          isAuthenticated={authState?.isAuthenticated}
          isCheckedOut={isCheckedOut}
          checkoutBook={checkoutBook}
          isReviewLeft={isReviewLeft}
          submitReview={submitReview}
        />
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
