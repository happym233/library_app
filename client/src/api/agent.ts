import axios, { AxiosResponse } from "axios";
import { PageParams } from "../models/PageParams";
import { URLPageParams } from "../models/URLOffsetPageParam";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
// axios.defaults.withCredentials = true;

const responseBody = ( response: AxiosResponse ) => response.data;

const requests = {
    get: (url: string, params?: PageParams) => axios.get(url, {params}).then(responseBody),
    post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
    put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
    delete: (url: string) => axios.delete(url).then(responseBody),
}

const Book = {
    lists: (params?: PageParams) => requests.get("books", params),
    getById: (id: number) => requests.get("books/" + id),
    listsWithURL: (params?: URLPageParams) => requests.get("books/search/findByTitleCategory", params)
}

export const agent = { Book };
