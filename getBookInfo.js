function insertBooks() {
	document.getElementById("insertedBooks").innerHTML = generateBookList(books);
}

function generateBookList(booksList) {
	let list = "<ul>"
	for (index in booksList) {
		list += getBookInfo(index, booksList)
	}
	return list + "</ul>"
}

function getBookInfo(index, list) {
	const book = list[index];
	return "<li>" 
		+ book.title 
		+ " by " 
		+ book.author
		+ "</li>"
}