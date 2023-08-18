import { useEffect, useState } from "react";
import ReturnBook from "./ReturnBook";
import BookModel from "../../../models/BookModel";
import { agent } from "../../../api/agent";
import ErrorPage from "../../../errors/ErrorPage";
import SpinnerLoading from "../../../errors/SpinnerLoading";
import { Link } from "react-router-dom";

export default function Carousel() {
  const [books, setBooks] = useState<BookModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [httpError, setHttpError] = useState<string>("");

  useEffect(() => {
    setIsLoading(true);
    agent.Book.lists({ page: 0, size: 9 })
      .then(async (reponse) => {
        const responseData = await reponse._embedded.books;
        const loadedBooks: BookModel[] = [];
        for (const key in responseData) {
          loadedBooks.push({
            id: responseData[key].id,
            title: responseData[key].title,
            author: responseData[key].author,
            description: responseData[key].description,
            copies: responseData[key].copies,
            copiesAvailable: responseData[key].copiesAvailable,
            category: responseData[key].category,
            img: responseData[key].img,
          });
        }
        setBooks(loadedBooks);
        // console.log(books);
        setIsLoading(false);
      })
      .catch((error: any) => {
        setHttpError(error.message);
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <SpinnerLoading />;

  if (httpError) return <ErrorPage message={httpError} />;

  return (
    <div className="container mt-5" style={{ height: 550 }}>
      <div className="homepage-carousel-title">
        <h3>Find your next "I stayed up too late reading" book.</h3>
      </div>
      <div
        id="carouselExampleControls"
        className="carousel carousel-dark slide mt-5
          d-none d-lg-block"
        data-bs-interval="false"
      >
        {/*Desktop*/}
        <div className="carousel-inner">
          <div className="carousel-item active">
            <div className="row d-flex justify-content-center align-items-center">
              {books &&
                books
                  .slice(0, 3)
                  .map((book) => <ReturnBook book={book} key={book.id} />)}
            </div>
          </div>

          <div className="carousel-item">
            <div className="row d-flex justify-content-center align-items-center">
              {books &&
                books
                  .slice(3, 6)
                  .map((book) => <ReturnBook book={book} key={book.id} />)}
            </div>
          </div>

          <div className="carousel-item">
            <div className="row d-flex justify-content-center align-items-center">
              {books &&
                books
                  .slice(6, 9)
                  .map((book) => <ReturnBook book={book} key={book.id} />)}
            </div>
          </div>
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleControls"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>

        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleControls"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      {/* Mobile*/}
      <div className="d-lg-none mt-3">
        <div className="row d-flex justify-content-center align-items-center">
          {books && books.length > 0 && <ReturnBook book={books[0]} />}
        </div>
      </div>
      <div className="homepage-carousel-title mt-3">
        <Link className="btn btn-outline-secondary btn-lg" to="/search">
          View More
        </Link>
      </div>
    </div>
  );
}
