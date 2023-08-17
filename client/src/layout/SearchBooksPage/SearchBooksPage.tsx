import { useEffect, useState } from "react";
import BookModel from "../../models/BookModel";
import { agent } from "../../api/agent";
import SpinnerLoading from "../../errors/SpinnerLoading";
import ErrorPage from "../../errors/ErrorPage";
import SearchBook from "./components/SearchBook";
import Pagination from "./components/Pagination";
import { URLPageParams } from "../../models/URLOffsetPageParam";
import debounce from "lodash";
import BookNotFound from "./components/BookNotFound";

export default function SearchBooksPage() {
  const [books, setBooks] = useState<BookModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [httpError, setHttpError] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(4);
  const [urlParams, setUrlParams] = useState<URLPageParams>({
    page: currentPage - 1,
    size: booksPerPage,
  });
  const [totalAmountOfBooks, setTotalAmountOfBooks] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState<string>("");
  const [category, setCategory] = useState<string>("Category");
  const categoryMap = new Map<string, string>();
  categoryMap.set("all", "Category");
  categoryMap.set("fe", "Front End");
  categoryMap.set("be", "Back End");
  categoryMap.set("data", "Data");
  categoryMap.set("devops", "Devops");

  useEffect(() => {
    updateBooks();
  }, [urlParams]);

  if (isLoading) return <SpinnerLoading />;

  if (httpError) return <ErrorPage message={httpError} />;

  const indexOfFirstBook: number = (currentPage - 1) * booksPerPage + 1;
  const indexOfLastBook: number = Math.min(
    booksPerPage * currentPage,
    totalAmountOfBooks
  );

  function searchHandleChange() {
    if (search === "") {
      setUrlParams((prevState) => {
        return {
          ...prevState,
          page: 0,
          title: null,
        };
      });
    } else {
      setUrlParams((prevState) => {
        return {
          ...prevState,
          page: 0,
          title: search,
        };
      });
    }
  }

  function updateBooks() {
    setIsLoading(true);
    agent.Book.listsWithURL(urlParams)
      .then(async (reponse) => {
        const responseData = await reponse;
        const books = responseData._embedded.books;
        const loadedBooks: BookModel[] = [];
        books.forEach((book: any) => {
          loadedBooks.push({
            id: book.id,
            title: book.title,
            author: book.author,
            description: book.description,
            copies: book.copies,
            copiesAvailable: book.copiesAvailable,
            category: book.category,
            img: book.img,
          });
        });
        setBooks(loadedBooks);
        console.log(responseData.page.number + 1);
        setTotalAmountOfBooks(responseData.page.totalElements);
        setCurrentPage(responseData.page.number + 1);
        setTotalPages(responseData.page.totalPages);
        setIsLoading(false);
      })
      .catch((error: any) => {
        setHttpError(error.message);
      })
      .finally(() => {
        setIsLoading(false);
        window.scrollTo(0, 0);
      });
  }

  function paginate(pageNumber: number) {
    setUrlParams((prevState) => {
      return {
        ...prevState,
        page: pageNumber - 1,
      };
    });
  }

  function categoryField(value: string) {
    if (value.toLowerCase() === "all") {
      setUrlParams((prevState) => {
        return {
          ...prevState,
          category: null,
        };
      });
    } else {
      setUrlParams((prevState) => {
        return {
          ...prevState,
          category: value,
        };
      });
    }
    setCategory(categoryMap.get(value)!);
  }

  return (
    <div>
      <div className="container">
        <div>
          <div className="row mt-5">
            <div className="col-6">
              <div className="d-flex">
                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="Search"
                  aria-labelledby="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button
                  className="btn btn-outline-success"
                  onClick={() => searchHandleChange()}
                >
                  Search
                </button>
              </div>
            </div>
            <div className="col-4">
              <div className="dropdown">
                <button
                  className="btn btn-secondary dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton1"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {category}
                </button>
                <ul
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuButton1"
                >
                  <li key="All" onClick={() => categoryField("all")}>
                    <a className="dropdown-item" href="#">
                      All
                    </a>
                  </li>
                  <li key="FrontEnd" onClick={() => categoryField("fe")}>
                    <a className="dropdown-item" href="#">
                      Front End
                    </a>
                  </li>
                  <li key="BackEnd" onClick={() => categoryField("be")}>
                    <a className="dropdown-item" href="#">
                      Back End
                    </a>
                  </li>
                  <li key="Data" onClick={() => categoryField("data")}>
                    <a className="dropdown-item" href="#">
                      Data
                    </a>
                  </li>
                  <li key="DevOps" onClick={() => categoryField("devops")}>
                    <a className="dropdown-item" href="#">
                      DevOps
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {totalAmountOfBooks <= 0 ? (
            <BookNotFound />
          ) : (
            <>
              <div className="mt-3">
                <h5>Number of results: ({totalAmountOfBooks})</h5>
              </div>
              <p>
                {indexOfFirstBook} to {indexOfLastBook} of {totalAmountOfBooks}{" "}
                items:
              </p>
              {books.map((book) => (
                <SearchBook book={book} key={book.id} />
              ))}

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                paginate={paginate}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
