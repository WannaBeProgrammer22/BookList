// ES5
// book constructor - CRUD book object
function Book(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
}

// UI constructor - set prototype methods add book to the list, delete, show alert have to do a UI
function UI() { }

// add books to list
UI.prototype.addBookToList = function (book) {
    const list = document.getElementById('book-list');
    // create tr element
    const row = document.createElement('tr');
    // insert cols
    row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="delete">x</a></td>
    `;
    list.appendChild(row);
}

// show alert
UI.prototype.showAlert = function (msg, className) {
    // create div
    const div = document.createElement('div');
    // add class
    div.className = `alert ${className}`;
    // add text
    div.appendChild(document.createTextNode(msg));
    // get parent
    const container = document.querySelector('.container');
    const form = document.querySelector('#book-form');
    // insert alert
    container.insertBefore(div, form);

    // timeout after 3 sec
    setTimeout(function () {
        document.querySelector('.alert').remove();
    }, 5000);
}

// delete book
UI.prototype.deleteBook = function (target) {
    if (target.className === 'delete') {
        target.parentElement.parentElement.remove();
    }
}

// clear fields
UI.prototype.clearFields = function () {
    document.getElementById('title').value = "";
    document.getElementById('author').value = "";
    document.getElementById('isbn').value = "";
}

// local storage
function Store() { }

Store.getBooks = function () {
    let books;

    if (localStorage.getItem('books') === null) {
        books = [];
    } else {
        books = JSON.parse(localStorage.getItem('books'));
    }

    return books;
}

Store.displayBooks = function () {
    const books = Store.getBooks();
    const ui = new UI;
    books.forEach(function (book) {
        ui.addBookToList(book);
    })
}

Store.addBook = function (book) {
    const books = Store.getBooks();

    books.push(book);

    localStorage.setItem('books', JSON.stringify(books));

}

Store.removeBook = function (isbn) {
    const books = Store.getBooks();

    books.forEach(function (book, i) {
        if (book.isbn === isbn) {
            books.splice(i, 1);
        }
    });

    localStorage.setItem('books', JSON.stringify(books));

}

// after dom loaded display all books
document.addEventListener('DOMContentLoaded', Store.displayBooks);

// event listeners for add book
document.getElementById('book-form').addEventListener('submit', function (e) {
    // get form values
    const title = document.getElementById('title').value,
        author = document.getElementById('author').value,
        isbn = document.getElementById('isbn').value;

    // instantiate book object
    const book = new Book(title, author, isbn);

    // Instantiate UI
    const ui = new UI();

    // Validate
    if (title === '' || author === '' || isbn === '') {
        // error alert
        ui.showAlert('Please fill in all fields', 'error');
    } else {
        // add book to list
        ui.addBookToList(book);

        // add book to local storage
        Store.addBook(book);

        // show success
        ui.showAlert('Book added', 'success');

        // Clear fields
        ui.clearFields();
    }

    e.preventDefault();
});

// event listener for delete book
document.getElementById('book-list').addEventListener('click', function (e) {
    // Instantiate UI
    const ui = new UI();

    // delete book
    ui.deleteBook(e.target);

    // delete book in local storage using isbn
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    // show alert
    ui.showAlert('Book removed!', 'success');

    e.preventDefault();
});