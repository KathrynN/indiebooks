import React, { Component } from "react";
import Media from "react-bootstrap/Media";
import axios from "axios";
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
      {booksList.map(item => (
        <GetBookInfo goodreads_id={item.goodreads_id} key={item.goodreads_id} />
      ))}
    </ul>
  );
}

class GetBookInfo extends Component {
  state = {
    isBookLoaded: false,
    book: {}
  };

  componentDidMount() {
    this.getBookInfo(this.props.goodreads_id);
  }

  render() {
    const { isBookLoaded, book } = this.state;
    if (isBookLoaded) {
      const regex = /<br\s*[/]?>/gi;
      const bookDescription = book.description.split(regex).join("\n");
      return (
        <Media as="li">
          {this.getImage()}
          <Media.Body>
            <a href={book.link} target="_blank" rel="noopener noreferrer">
              <h5>
                {book.title} by {book.authors.author.name}
              </h5>
            </a>
            <p>{bookDescription}</p>
          </Media.Body>
        </Media>
      );
    }
    return <div />;
  }

  getImage() {
    const { isBookLoaded, book } = this.state;
    if (isBookLoaded) {
      return (
        <img
          className="align-self-center mr-3"
          src={book.image_url}
          alt={book.title}
        />
      );
    }
  }

  getBookInfo(goodreads_id) {
    axios
      .get(
        "http://ec2-52-70-122-182.compute-1.amazonaws.com:3001/getbookinfo?grid=" +
          goodreads_id
      )
      .then(
        result => {
          this.setState({
            isBookLoaded: true,
            book: JSON.parse(result.data).GoodreadsResponse.book
          });
        },
        error => {
          console.log(error);
          this.setState({
            isBookLoaded: false
          });
        }
      );
  }
}

export default App;
