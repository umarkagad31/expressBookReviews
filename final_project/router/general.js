const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// Internal route to provide book data
public_users.get('/api/books-data', function (req, res) {
  return res.status(200).json(books);
});


// Get all books using Axios and async/await
async function getAllBooks() {
  const response = await axios.get('http://localhost:5000/api/books-data');
  return response.data;
}


// Register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (isValid(username)) {
      return res.status(400).json({message: "Username already exists"});
    }

    users.push({username: username, password: password});
    return res.status(200).json({message: "User successfully registered"});
  }

  return res.status(400).json({message: "Username and password are required"});
});


// Get all books using Axios and async/await
public_users.get('/', async function (req, res) {
  try {
    const allBooks = await getAllBooks();
    return res.status(200).json(allBooks);
  } catch (error) {
    return res.status(500).json({message: "Error fetching books"});
  }
});


// Get book by ISBN using Axios and async/await
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const allBooks = await getAllBooks();
    const isbn = req.params.isbn;

    if (allBooks[isbn]) {
      return res.status(200).json(allBooks[isbn]);
    }

    return res.status(404).json({message: "Book not found"});
  } catch (error) {
    return res.status(500).json({message: "Error fetching books"});
  }
});


// Get books by author using Axios and async/await
public_users.get('/author/:author', async function (req, res) {
  try {
    const allBooks = await getAllBooks();
    const author = req.params.author;

    const result = Object.values(allBooks).filter(
      book => book.author.toLowerCase() === author.toLowerCase()
    );

    if (result.length > 0) {
      return res.status(200).json(result);
    }

    return res.status(404).json({message: "Author not found"});
  } catch (error) {
    return res.status(500).json({message: "Error fetching books"});
  }
});


// Get books by title using Axios and async/await
public_users.get('/title/:title', async function (req, res) {
  try {
    const allBooks = await getAllBooks();
    const title = req.params.title;

    const result = Object.values(allBooks).filter(
      book => book.title.toLowerCase() === title.toLowerCase()
    );

    if (result.length > 0) {
      return res.status(200).json(result);
    }

    return res.status(404).json({message: "Book not found"});
  } catch (error) {
    return res.status(500).json({message: "Error fetching books"});
  }
});


// Get book reviews
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});


module.exports.general = public_users;