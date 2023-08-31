import { useEffect, useState } from "react";
import BookModel from "../../../models/BookModel";
import { useOktaAuth } from "@okta/okta-react";
import { agent } from "../../../api/agent";
import { error } from "console";

interface Props {
  book: BookModel;
  deleteBook: any;
}

export default function ChangeQuantityOfBook({ book, deleteBook }: Props) {
  const { authState } = useOktaAuth();
  const [quantity, setQuantity] = useState<number>(0);
  const [remaining, setRemaining] = useState<number>(0);

  useEffect(() => {
    const fetchBookInState = () => {
      book.copies ? setQuantity(book.copies) : setQuantity(0);
      book.copiesAvailable
        ? setRemaining(book.copiesAvailable)
        : setRemaining(0);
    };
    fetchBookInState();
  }, []);

  async function increaseQuantity() {
    agent.Admin.increaseQuantity(book.id, authState)
      .then((response) => {
        setQuantity(quantity + 1);
        setRemaining(remaining + 1);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function decreaseQuantity() {
    if (!quantity || quantity == 0 || !remaining || remaining == 0) return;
    agent.Admin.decreaseQuantity(book.id, authState)
      .then((response) => {
        setQuantity(quantity - 1);
        setRemaining(remaining - 1);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function removeBook() {
    agent.Admin.deleteBook(book.id, authState)
      .then((response) => {
        deleteBook();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <>
      <div className="mt-3 col-md-2"></div>
      <div className="mt-3 col-md-6 p-3">
        <div className="d-flex justify-content-start align-items-center">
          <p>
            Total Quantity: <b>{quantity}</b>
          </p>
        </div>
        <div className="d-flex justify-content-start align-items-center">
          <p>
            Books Remaining: <b>{remaining}</b>
          </p>
        </div>
      </div>
      <div className="mt-3 col-md-4">
        <div className="d-flex justify-content-center">
          <button className="m-1 btn btn-md btn-danger" onClick={removeBook}>
            Delete
          </button>
        </div>
      </div>
      <button
        className="m1 btn btn-md main-color text-white"
        onClick={increaseQuantity}
      >
        Add Quantity
      </button>
      <button
        className="m1 btn btn-md btn-warning"
        onClick={decreaseQuantity}
        disabled={!quantity || quantity == 0 || !remaining || remaining == 0}
      >
        Decrease Quantity
      </button>
    </>
  );
}
