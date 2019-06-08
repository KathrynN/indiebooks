import React, { Component } from "react";
import "./App.css";
import bookdata from "./data/books.json";

function App() {
  return (
    <div className="App">
      <h1>A List of Indie Books!</h1>
      {generateBookList(bookdata.books)}
    </div>
  );
}

function generateBookList(booksList) {
  return (
    <ul>
      {" "}
      {booksList.map(item => (
        <GetBookInfo book={item} />
      ))}{" "}
    </ul>
  );
}

class GetBookInfo extends Component {
  render() {
    const book = this.props.book;
    return (
      <li>
        {book.title}" by "{book.author}
      </li>
    );
  }
}

export default App;
