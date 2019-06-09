import React, { Component } from "react";
import Media from "react-bootstrap/Media";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import underscore from "underscore";
import axios from "axios";
import "./App.css";

const prodUrl = "http://ec2-52-70-122-182.compute-1.amazonaws.com:3001";
//const devUrl = "http://localhost:3001";

function App() {
  return (
    <div className="App">
      <h1>Indie Books!</h1>
      <AdditionForm />
      <BookList />
    </div>
  );
}

class AdditionForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      validated: true
    };
  }

  handleSubmit(event) {
    event.preventDefault();
    const goodreadsUrl = new FormData(event.target).get("goodreadsLink");

    var regex = RegExp("^.*goodreads\\.com\\/book\\/show\\/\\d+.*");
    if (regex.test(goodreadsUrl)) {
      var str = goodreadsUrl;
      var reg = new RegExp("\\d+");
      var matches = str.match(reg);
      axios({
        method: "post",
        url: prodUrl + "/addbook",
        data: {
          bookId: goodreadsUrl.slice(
            matches.index,
            matches.index + matches[0].length
          )
        }
      });
      this.setState({
        validated: true
      });
    } else {
      this.setState({
        validated: false
      });
    }
  }

  getForm() {
    const { validated } = this.state;
    const error = validated ? (
      <div />
    ) : (
      <Col>
        {" "}
        That was not a valid goodreads book link. Example goodreads link is:
        https://www.goodreads.com/book/show/386162.The_Hitchhiker_s_Guide_to_the_Galaxy
      </Col>
    );
    return (
      <Form onSubmit={event => this.handleSubmit(event)}>
        <Form.Row>
          <Col>
            <Form.Control
              type="text"
              name="goodreadsLink"
              placeholder="Enter goodreads link to suggest a book!"
            />
          </Col>
          {error}
          <Col>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Col>
        </Form.Row>
      </Form>
    );
  }

  render() {
    const innerContents = this.getForm();

    return <div className="newBookAddition">{innerContents}</div>;
  }
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
    const serviceUrl = prodUrl;

    axios.get(serviceUrl + "/getallbooks").then(
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
          {this.state.books.map(item => {
            const book = JSON.parse(item).GoodreadsResponse.book;
            return <GetBookInfo book={book} key={book.id} />;
          })}
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
    const bookDescription =
      book.description && !underscore.isEmpty(book.description)
        ? book.description.split(regex).join("\n")
        : "";
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
