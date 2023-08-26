import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import MessageModel from "../../../models/Message";
import SpinnerLoading from "../../../errors/SpinnerLoading";
import ErrorPage from "../../../errors/ErrorPage";
import { agent } from "../../../api/agent";
import { error } from "console";
import Pagination from "../../SearchBooksPage/components/Pagination";
import AdminMessage from "./AdminMessage";
import AdminMessageRequest from "../../../models/AdminMessageRequest";

export default function () {
  const { authState } = useOktaAuth();

  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [httpError, setHttpError] = useState(null);

  const [messages, setMessages] = useState<MessageModel[]>([]);
  const [messagesPerPage] = useState(5);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [btnSubmit, setBtnSubmit] = useState(false);

  useEffect(() => {
    if (!authState || !authState.isAuthenticated) return;
    setIsLoadingMessages(true);
    agent.Message.findByClosed(
      {
        closed: false,
        page: currentPage - 1,
        size: messagesPerPage,
      },
      authState
    )
      .then((response) => {
        setMessages(response._embedded.messages);
        setTotalPages(response.page.totalPages);
        setCurrentPage(response.page.currentPage + 1);
      })
      .catch((error) => {
        setHttpError(error);
      })
      .finally(() => {
        setIsLoadingMessages(false);
      });
    window.scrollTo(0, 0);
  }, [authState, currentPage, btnSubmit]);

  if (isLoadingMessages) {
    return <SpinnerLoading />;
  }

  if (httpError) {
    return <ErrorPage message={httpError} />;
  }

  async function submitResponseToQuestion(id: number, response: string) {
    if (
      authState &&
      authState.isAuthenticated &&
      id !== null &&
      response !== ""
    ) {
      const messageAdminRequest: AdminMessageRequest = new AdminMessageRequest(
        id,
        response
      );
      agent.Message.putAdminMessage(messageAdminRequest, authState).then(
        (response) => {
          setBtnSubmit(!btnSubmit);
        }
      );
    }
  }

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  return (
    <div className="mt-3">
      {messages.length > 0 ? (
        <>
          <h5>Pending Q/A: </h5>
          {messages.map((message) => (
            <AdminMessage
              message={message}
              submitResponseToQuestion={submitResponseToQuestion}
              key={message.id}
            />
          ))}
        </>
      ) : (
        <h5>No pending Q/A</h5>
      )}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          paginate={paginate}
        />
      )}
    </div>
  );
}
