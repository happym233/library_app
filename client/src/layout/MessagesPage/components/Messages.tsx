import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import MessageModel from "../../../models/Message";
import SpinnerLoading from "../../../errors/SpinnerLoading";
import ErrorPage from "../../../errors/ErrorPage";
import { agent } from "../../../api/agent";
import { error } from "console";
import Pagination from "../../SearchBooksPage/components/Pagination";

export default function Messages() {
  const { authState } = useOktaAuth();
  const [isLoadingMessage, setIsLoadingMessage] = useState(false);
  const [httpError, setHttpError] = useState(null);

  const [messages, setMessages] = useState<MessageModel[]>([]);
  const [messagesPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    setIsLoadingMessage(true);
    if (!authState || !authState.isAuthenticated) return;
    agent.Message.fetchUserMessages(
      {
        userEmail: authState.accessToken?.claims.sub,
        page: currentPage - 1,
        size: messagesPerPage,
      },
      authState
    )
      .then((response) => {
        setMessages(response._embedded.messages);
        setTotalPages(response.page.totalPages);
        setCurrentPage(response.page.number + 1);
      })
      .catch((error: any) => {
        setHttpError(error.message);
      })
      .finally(() => {
        setIsLoadingMessage(false);
        window.scrollTo(0, 0);
      });
  }, [authState, currentPage]);

  if (isLoadingMessage) {
    return <SpinnerLoading />;
  }

  if (httpError) {
    return <ErrorPage message={httpError} />;
  }

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="mt-2">
      {messages.length > 0 ? (
        <>
          <h5>Current Q/A: </h5>
          {messages.map((message) => (
            <div key={message.id}>
              <div className="card mt-2 shadow p-3 bg-body rounded">
                <h5>
                  Case #{message.id}: {message.title}
                </h5>
                <h6>{message.userEmail}</h6>
                <p>{message.question}</p>
                <hr />
                <div>
                  <h5>Response: </h5>
                  {message.response && message.adminEmail ? (
                    <>
                      <h6>{message.adminEmail} (admin)</h6>
                      <p>{message.response}</p>
                    </>
                  ) : (
                    <p>
                      <i>
                        Pending response from administration. Please be patient.
                      </i>
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </>
      ) : (
        <h5>All questions you submit will be shown here</h5>
      )}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        paginate={paginate}
      />
    </div>
  );
}
