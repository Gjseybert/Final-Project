const apiUrl = 'https://6521897aa4199548356d5792.mockapi.io/Code';

// Function to fetch books from the API and populate the list
function fetchBooks() {
    $.get(apiUrl, function(data) {
        const bookList = $('#bookList');
        bookList.empty(); // Clear the existing list
        console.log(data);
        for (const book of data) {
            addBookToList(book);
        }
    });
}

// Function to add a book to the API
function addBook(title, author, year) {
    const bookData = {
        title: title,
        author: author,
        year: year
    };

    $.post(apiUrl, bookData, function(data) {
        fetchBooks(); // Refresh the list after adding
    });
}

// Function to update a book in the API
function updateBook(id, title, author, year) {
    const bookData = {
        title: title,
        author: author,
        year: year
    };

    $.ajax({
        url: `${apiUrl}/${id}`,
        type: 'PUT',
        data: bookData,
        success: function() {
            fetchBooks(); // Refresh the list after updating
        },
    });
}

// Function to remove a book from the API
function removeBook(id) {
    $.ajax({
        url: `${apiUrl}/${id}`,
        type: 'DELETE',
        success: function() {
            fetchBooks(); // Refresh the list after deleting
        },
    });
}

// Function to create and append a list item for a book
function addBookToList(book) {
    const bookList = $('#bookList');
    const listItem = $(`<li class="list-group-item">${book.title} by ${book.author}, Year: ${book.year}</li>`);

    // Add edit and delete buttons
    const editButton = $('<button class="btn btn-primary btn-sm mx-2">Edit</button>');
    const deleteButton = $('<button class="btn btn-danger btn-sm">Delete</button>');

    // Edit button click event
    editButton.click(function() {
        const newTitle = prompt('Enter the new title:', book.title);
        if (newTitle !== null) {
            const newAuthor = prompt('Enter the new author:', book.author);
            const newYear = prompt('Enter the new year:', book.year);
            updateBook(book.id, newTitle, newAuthor, newYear);
        }
    });

    // Delete button click event
    deleteButton.click(function() {
        const confirmDelete = confirm('Are you sure you want to delete this book?');
        if (confirmDelete) {
            removeBook(book.id);
        }
    });

    listItem.append(editButton);
    listItem.append(deleteButton);

    bookList.append(listItem);
}

// Handle form submissions
const bookForm = $('#bookForm');
bookForm.submit(function(e) {
    e.preventDefault();
    const title = $('#title').val();
    const author = $('#author').val();
    const year = $('#year').val();

    addBook(title, author, year);

    // Clear the form fields
    $('#title').val('');
    $('#author').val('');
    $('#year').val('');
});

// Initial fetch of books from the API
fetchBooks();

// Event listener for adding a review
$('#addReview').click(function() {
    const rating = $('#rating').val();
    const review = $('#review').val();
    if (rating >= 1 && rating <= 5 && review.length <= 300) {
        const bookId = $('#bookDetails').data('bookId');
        addReview(bookId, rating, review);
    } else {
        alert('Please provide a valid rating (1-5) and a review of up to 300 characters.');
    }
});

// Event listener for adding a review
$('#addReview').click(function() {
    const rating = $('#rating').val();
    const review = $('#review').val();
    if (rating >= 1 && rating <= 5 && review.length <= 300) {
        const bookId = $('#bookDetails').data('bookId');
        addReview(bookId, rating, review);
    } else {
        alert('Please provide a valid rating (1-5) and a review of up to 300 characters.');
    }
});

// Function to add a review
function addReview(bookId, rating, review) {
    const reviewData = {
        rating: rating,
        review: review
    };

    $.ajax({
        url: `${apiUrl}/${bookId}/reviews`,
        type: 'POST',
        data: reviewData,
        success: function() {
            fetchBookDetails(bookId);
            // Clear the review input fields
            $('#rating').val('');
            $('#review').val('');
        },
    });
}

// Function to fetch a book's details, including reviews
function fetchBookDetails(id) {
    $.get(`${apiUrl}/${id}`, function(book) {
        // Clear the book details container
        $('#bookDetails').empty();

        // Create a container for book details
        const detailsContainer = $('<div>');

        // Set the bookId as data attribute
        detailsContainer.data('bookId', id);

        // Display book information
        const bookInfo = $(`<p>${book.title} by ${book.author}, Year: ${book.year}</p>`);
        detailsContainer.append(bookInfo);

        // Create a form to add a review
        const reviewForm = $('#bookReviews');

        detailsContainer.append(reviewForm);

        // Display book reviews
        if (book.reviews && book.reviews.length > 0) {
            const reviewsList = $('<ul>');
            for (const review of book.reviews) {
                const reviewItem = $(`<li>${review.rating} stars - ${review.review}</li>`);
                reviewsList.append(reviewItem);
            }
            detailsContainer.append(reviewsList);
        }

        // Append book details to the book details container
        $('#bookDetails').append(detailsContainer);
    });
}