import { Link } from "react-router-dom";
import BookModel from "../../models/BookModel";
import { useState } from "react";
import { agent } from "../../api/agent";
import { useOktaAuth } from "@okta/okta-react";
import { error } from "console";
import LeaveAReview from "../../components/LeaveAReview";

interface Props {
  book: BookModel;
  mobile: boolean;
  currentLoanCount: number;
  isAuthenticated: any;
  isCheckedOut: boolean;
  checkoutBook: any;
  isReviewLeft: boolean;
  submitReview: any;
}

export default function CheckoutAndReviewBox({
  book,
  mobile,
  currentLoanCount,
  isAuthenticated,
  isCheckedOut,
  checkoutBook,
  isReviewLeft,
  submitReview,
}: Props) {
  const { authState } = useOktaAuth();
  const [buttonLoading, setButtonLoading] = useState(false);

  async function checkBook() {
    setButtonLoading(true);
    await checkoutBook();
    setButtonLoading(false);
  }

  function reviewRender() {
    if (isAuthenticated && !isReviewLeft) {
      return (
        <p>
          <LeaveAReview submitReview={submitReview} />
        </p>
      );
    } else if (isAuthenticated && isReviewLeft) {
      return (
        <p>
          <b>Thank you for your review!</b>
        </p>
      );
    }
    return (
      <div>
        <hr /> <p>Sign in to be able to leave a review.</p>
      </div>
    );
  }

  function buttonRender() {
    if (isAuthenticated) {
      if (isCheckedOut) {
        return (
          <p>
            <b>Book checked out. Enjoy!</b>
          </p>
        );
      } else {
        if (currentLoanCount < 5) {
          return (
            <button
              className="btn btn-success btn-lg"
              disabled={buttonLoading}
              onClick={() => checkBook()}
            >
              Check Out
            </button>
          );
        } else {
          return (
            <>
              <p className="text-danger">Too many books checked out.</p>
              <button className="btn btn-success btn-lg" disabled>
                Check Out
              </button>
            </>
          );
        }
      }
    }
    return (
      <Link to={"/login"} className="btn btn-success btn-lg">
        Sign in
      </Link>
    );
  }

  return (
    <div
      className={
        mobile ? "card d-flex mt-5" : "card col-3 container d-flex mb-5"
      }
    >
      <div className="card-body container">
        <div className="mt-3">
          <p>
            <b>{currentLoanCount}/5 </b>
            books checked out
          </p>
          <hr />
          {book && book.copiesAvailable && book.copiesAvailable > 0 ? (
            <h4 className="text-success">Available</h4>
          ) : (
            <h4 className="text-danger">Wait List</h4>
          )}
          <div className="row">
            <p className="col-6 lead">
              <b>{book.copies} </b>
              copies
            </p>
            <p className="col-6 lead">
              <b>{book.copiesAvailable} </b>
              available
            </p>
          </div>
        </div>
        {buttonRender()}
        <hr />
        <p className="mt-3">
          This number can change until placing order has been complete.
        </p>
        {reviewRender()}
      </div>
    </div>
  );
}
