import React, { Component } from "react";
import Media from "react-bootstrap/Media";
import axios from "axios";
import "./App.css";

function App() {
  return (
    <div className="App">
      <h1>A List of Indie Books!</h1>
      <BookList />
    </div>
  );
}

class BookList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      books: []
    };
  }

  componentDidMount() {
    axios
      .get("http://ec2-52-70-122-182.compute-1.amazonaws.com:3001/getallbooks")
      .then(
        result => {
          this.setState({
            isLoaded: true,
            books: result.data
          });
        },
        error => {
          console.log(error);
          this.setState({
            isLoaded: false
          });
        }
      );
  }

  render() {
    if (this.state.isLoaded) {
      return (
        <ul>
          {this.state.books.map(item => (
            <GetBookInfo
              book={JSON.parse(item).GoodreadsResponse.book}
              key={item.goodreads_id}
            />
          ))}
        </ul>
      );
    }
    return <div />;
  }
}

class GetBookInfo extends Component {
  render() {
    const book = this.props.book;
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

  getImage() {
    return (
      <img
        className="align-self-center mr-3"
        src={this.props.book.image_url}
        alt={this.props.book.title}
      />
    );
  }
}

export default App;
