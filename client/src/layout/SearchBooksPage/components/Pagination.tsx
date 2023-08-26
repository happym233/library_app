import { useEffect, useState } from "react";

interface Props {
  currentPage: number;
  totalPages: number;
  paginate: any;
}

export default function Pagination({
  currentPage,
  totalPages,
  paginate,
}: Props) {
  const [pagesArr, setPagesArr] = useState<number[]>([]);

  useEffect(() => {
    let minPageNum = 1,
      maxPageNum = 5;
    if (currentPage <= 5) {
      minPageNum = 1;
      maxPageNum = Math.min(5, totalPages);
    } else if (currentPage >= totalPages - 4) {
      minPageNum = totalPages - 4;
      maxPageNum = totalPages;
    } else {
      minPageNum = currentPage - 2;
      maxPageNum = currentPage + 2;
    }
    const tmpArr = [];
    for (let i = minPageNum; i <= maxPageNum; i++) {
      tmpArr.push(i);
    }
    setPagesArr(tmpArr);
  }, []);

  function resetPageArrToLow() {
    let minPageNum = 1,
      highPageNum = Math.min(totalPages, 5);
    const tmpArr = [];
    for (let i = minPageNum; i <= highPageNum; i++) {
      tmpArr.push(i);
    }
    setPagesArr(tmpArr);
    paginate(1);
  }

  function resetPageArrMinus() {
    if (currentPage === 1) return;
    let minPageNum = pagesArr[0],
      highPageNum = pagesArr[pagesArr.length - 1];
    if (minPageNum > 1) {
      minPageNum = minPageNum - 1;
      highPageNum = highPageNum - 1;
      const tmpArr = [];
      for (let i = minPageNum; i <= highPageNum; i++) {
        tmpArr.push(i);
      }

      setPagesArr(tmpArr);
    }
    paginate(currentPage - 1);
  }

  function resetPageArrAdd() {
    if (currentPage === pagesArr.length) return;
    let minPageNum = pagesArr[0],
      highPageNum = pagesArr[pagesArr.length - 1];
    if (highPageNum < totalPages) {
      minPageNum = minPageNum + 1;
      highPageNum = highPageNum + 1;
      const tmpArr = [];
      for (let i = minPageNum; i <= highPageNum; i++) {
        tmpArr.push(i);
      }

      setPagesArr(tmpArr);
    }
    paginate(currentPage + 1);
  }

  function resetPageArrToHigh() {
    let minPageNum = Math.max(1, totalPages - 4),
      highPageNum = totalPages;
    const tmpArr = [];
    for (let i = minPageNum; i <= highPageNum; i++) {
      tmpArr.push(i);
    }
    setPagesArr(tmpArr);
    paginate(totalPages);
  }

  function checkLowDisable() {
    if (pagesArr.length === 0) return true;
    if (pagesArr[0] === 1) return true;
    return false;
  }

  function checkHighDisable() {
    if (pagesArr.length === 0) return true;
    if (pagesArr[pagesArr.length - 1] === totalPages) return true;
    return false;
  }

  return (
    <div>
      <nav className="mt-4 d-flex align-items-center" aria-label="...">
        <ul className="pagination">
          <li
            key={"pp"}
            className={"page-item  " + (checkLowDisable() ? "disabled" : "")}
            onClick={resetPageArrToLow}
          >
            <button className="page-link">
              <span aria-hidden="true">&laquo;</span>
            </button>
          </li>
          <li
            key={"p"}
            className={"page-item " + (currentPage === 1 ? "disabled" : "")}
            onClick={resetPageArrMinus}
          >
            <button className="page-link">
              <span aria-hidden="true">Previous</span>
            </button>
          </li>
          {pagesArr.map((i) => (
            <li
              key={i}
              className={"page-item " + (currentPage === i ? "active" : " ")}
              onClick={() => paginate(i)}
            >
              <button className="page-link">{i}</button>
            </li>
          ))}

          <li
            key={"n"}
            className={
              "page-item " + (currentPage === totalPages ? "disabled" : "")
            }
            onClick={resetPageArrAdd}
          >
            <button className="page-link">
              <span aria-hidden="true">Next</span>
            </button>
          </li>
          <li
            key={"nn"}
            className={"page-item " + (checkHighDisable() ? "disabled" : "")}
            onClick={resetPageArrToHigh}
          >
            <button className="page-link">
              <span aria-hidden="true">&raquo;</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
