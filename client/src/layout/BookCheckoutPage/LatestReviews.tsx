import { Link } from "react-router-dom";
import Review from "../../models/Review";
import ReviewComponent from "./components/Review";

interface Props {
  reviews: Review[];
  bookId: number;
  mobile: boolean;
}

export default function LastestReviews({ reviews, bookId, mobile }: Props) {
  return (
    <div className={mobile ? "mt-3" : "row mt-5"}>
      <div className={mobile ? "" : "col-sm-2 col-md-2"}>
        <h2>Latest Reviews: </h2>
      </div>
      <div className="col-sm-10 col-md-10">
        {reviews.length > 0 ? (
          <>
            {reviews.slice(0, 3).map((eachReview: Review) => (
              <ReviewComponent
                review={eachReview}
                key={eachReview.id}
              ></ReviewComponent>
            ))}

            <div className="m-3">
              <Link
                type="button"
                className="btn main-color btn-md text-white"
                to="#"
              >
                Reach all reviews.
              </Link>
            </div>
          </>
        ) : (
          <div className="m-3">
            <p className="lead">Currently there are no reviews for this book</p>
          </div>
        )}
      </div>
    </div>
  );
}
