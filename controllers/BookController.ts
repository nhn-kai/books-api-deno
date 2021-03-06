import { RouterContext, BodyForm } from "../deps.ts";
import {
  getBooksByOwnerId,
  createBook,
  getBookById,
  updateBookById,
  deleteBookById,
} from "../models/Book.ts";
import { ParameterRequired } from "../utils/error.ts";
import { User } from "../models/User.ts";

export default class BookController {
  public async createBook(context: RouterContext<{}, { user: User }>) {
    const { type, value } = (await context.request.body()) as BodyForm;
    const params = await value;

    const title = params.get("title");
    const message = params.get("message");
    const author = params.get("author");
    const url = params.get("url");

    if (title === null || message === null || author === null || url === null) {
      throw new ParameterRequired();
    }

    await createBook(
      { title, message, author, url },
      context.state.user.userId
    );

    context.response.body = { success: true };
  }

  public async getBooks(context: RouterContext<{}, { user: User }>) {
    const books = await getBooksByOwnerId(context.state.user.userId);

    context.response.body = books;
  }

  public async getBook(context: RouterContext<{ id: string }, { user: User }>) {
    const bookId = Number(context.params.id) || null;

    if (bookId === null) {
      throw new ParameterRequired();
    }

    const book = await getBookById(bookId, context.state.user.userId);

    context.response.body = book;
  }

  public async updateBook(
    context: RouterContext<{ id: string }, { user: User }>
  ) {
    const bookId = Number(context.params.id) || null;

    if (bookId === null) {
      throw new ParameterRequired();
    }

    const { type, value } = (await context.request.body()) as BodyForm;
    const params = await value;

    const title = params.get("title");
    const message = params.get("message");
    const author = params.get("author");
    const url = params.get("url");

    if (title === null || message === null || author === null || url === null) {
      throw new ParameterRequired();
    }

    await updateBookById(
      { title, message, author, url },
      bookId,
      context.state.user.userId
    );

    context.response.body = { success: true };
  }

  public async deleteBook(
    context: RouterContext<{ id: string }, { user: User }>
  ) {
    const bookId = Number(context.params.id) || null;

    if (bookId === null) {
      throw new ParameterRequired();
    }

    await deleteBookById(bookId, context.state.user.userId);

    context.response.body = { success: true };
  }
}
