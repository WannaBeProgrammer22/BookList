function Book(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
}

function UI() { }

UI.prototype.addBook = function (book) {
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

UI.prototype.removeBook = function (target) {
    target.parentElement.parentElement.remove();
    return true;
}

UI.prototype.showAlert = function (msg, className) {
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

UI.prototype.clearFields = function () {
    document.getElementById('title').value = '';
    author = document.getElementById('author').value = '';
    isbn = document.getElementById('isbn').value = '';
}

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
            ui.showAlert('Book removed.', 'success');
        }
    }

    e.preventDefault();
})