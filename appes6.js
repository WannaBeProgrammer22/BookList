class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

class UI {

    addBook(book) {
        const row = document.createElement('tr');
        const bookList = document.querySelector('#book-list');
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class='delete'>x</a></td>
        `;
        bookList.appendChild(row);

        return true;
    }

    removeBook(target) {
        target.parentElement.parentElement.remove();
        return true;
    }

    showAlert(msg, className) {
        const div = document.createElement('div');
        div.className = `alert ${className}`;
        div.appendChild(document.createTextNode(msg));

        const parent = document.querySelector('.container');
        const form = document.querySelector('#book-form');

        parent.insertBefore(div, form);

        setTimeout(function () {
            document.querySelector('.alert').remove();
        }, 4000);
    }

    clearFields() {
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('isbn').value = '';
    }

}

class Store {
    static getBooks() {
        let books;

        if (localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static addBook(book) {
        const books = Store.getBooks();

        books.push(book);

        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = Store.getBooks();
        books.forEach(function (book, i) {
            if (book.isbn === isbn) {
                books.splice(i, 1);
            }
        });
        localStorage.setItem('books', JSON.stringify(books));
    }

    static displayBooks() {
        const books = Store.getBooks();
        const ui = new UI;
        books.forEach(function (book) {
            ui.addBook(book);
        });
    }

}

document.addEventListener('DOMContentLoaded', Store.displayBooks);

document.getElementById('book-form').addEventListener('submit', function (e) {
    const title = document.getElementById('title').value,
        author = document.getElementById('author').value,
        isbn = document.getElementById('isbn').value;

    const book = new Book(title, author, isbn);
    const ui = new UI();


    if (title === '' || author === '' || isbn === '') {
        ui.showAlert('Please fill in all fields.', 'error');
    } else {

        if (ui.addBook(book)) {
            Store.addBook(book);
            ui.showAlert('Book added.', 'success');
            ui.clearFields();
        }
    }

    e.preventDefault();
});

document.getElementById('book-list').addEventListener('click', function (e) {
    const ui = new UI();

    if (e.target.className === 'delete') {
        if (ui.removeBook(e.target) === true) {
            Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
            ui.showAlert('Book removed.', 'success');
        }
    }

    e.preventDefault();
})

