import axios, { AxiosResponse } from "axios";
import { PageParams } from "../models/PageParams";
import { ReviewPageParams, URLPageParams } from "../models/URLOffsetPageParam";
import { url } from "inspector";
import ReviewRequest from "../models/ReviewRequest";
import MessageModel from "../models/Message";
import AdminMessageRequest from "../models/AdminMessageRequest";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

const responseBody = ( response: AxiosResponse ) => response.data;

const requests = {
    get: (url: string, params?: any, headers?: any) => axios.get(url, { params:  params, headers:  headers }).then(responseBody),
    post: (url: string, body: {}, params?: any, headers?: any) => axios.post(url, body, {params: params, headers: headers}).then(responseBody),
    put: (url: string, body: {}, params?: any, headers?: any) => axios.put(url, body, {params: params, headers: headers }).then(responseBody),
    delete: (url: string) => axios.delete(url).then(responseBody),
}

const Book = {
    lists: (params?: PageParams) => requests.get("books", params),
    getById: (id: number) => requests.get("books/" + id),
    listsWithURL: (params?: URLPageParams) => requests.get("books/search/findByTitleCategory", params),
    getCurrentLoansCount: (headers: any) => requests.get("books/secure/currentLoans/count",  {}, headers),
    getUserCheckedOut: (params: any, headers: any) => requests.get("books/secure/isCheckedout/byUser", params, headers),
    checkOutBook: (bookId: number, authState: any) => requests.put("books/secure/checkout", {},  { bookId: bookId }, {
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        'Content-Type': 'application/json'
    }),
    fetchUserCurrentLoans: (authState: any) => requests.get("books/secure/currentLoans", {}, {
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        'Content-Type': 'application/json'
    }),
    returnBook: (bookId: number, authState: any) => requests.put("books/secure/return", {}, { bookId }, {
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        'Content-Type': 'application/json'
    }),
    renewLoan: (bookId: number, authState: any) => requests.put("books/secure/renew/loan", {}, { bookId }, {
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        'Content-Type': 'application/json'
    }),
    findHistoryByEmail: (params: any, authState: any) => requests.get("histories/search/findBooksByUserEmail/", params, {
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        'Content-Type': 'application/json'
    }),
}

const Review = {
    getByBookId: (params?: ReviewPageParams) => requests.get("reviews/search/findByBookId", params),
    getReviewBookByUser: (bookId: number, authState: any) => requests.get("reviews/secure/user/book", { bookId: bookId }, {
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        'Content-Type': 'application/json'
    }),
    postReview: (reviewRequest: ReviewRequest, authState: any) => requests.post("reviews/secure", JSON.stringify(reviewRequest), {}, {
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        'Content-Type': 'application/json'
    }),
}

const Message = {
    addMessage: (messageRequestModel: MessageModel, authState: any) => requests.post("messages/secure/add/message", messageRequestModel, {}, {
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        'Content-Type': 'application/json'
    }),
    fetchUserMessages: (params: any, authState: any) => requests.get("messages/search/findByUserEmail", params, {
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        'Content-Type': 'application/json'
    }),
    findByClosed: (params: any, authState: any) => requests.get("messages/search/findByClosed", params, {
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        'Content-Type': 'application/json'
    }),
    putAdminMessage: (messageAdminRequestData: AdminMessageRequest, authState: any) => requests.put("messages/secure/admin/message", JSON.stringify(messageAdminRequestData), {}, {
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        'Content-Type': 'application/json'
    })
}

export const agent = { Book, Review, Message };
