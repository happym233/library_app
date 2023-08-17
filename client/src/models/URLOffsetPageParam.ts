import { PageParams } from "./PageParams";

export interface URLPageParams extends PageParams {
    title?: string | null;
    category?: string | null;
}

export interface ReviewPageParams extends PageParams { 
    book_id: number;
}