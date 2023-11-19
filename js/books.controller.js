'use strict'

function onInit() {
    renderFilterByQueryParams()
    renderBookNames()
    renderBooks()
}
//table
// function renderBooks() {
//     var books = getBooks()
//     console.log('books: ', books)

//     var strHtmls = books.map(
//         (book) => `
//         <article class="book-preview">
//             <button title="Delete book" class="btn-remove" onclick="onRemoveBook('${book.id}')">X</button>
            
//             <h2>${book.bookName}</h2>
//             <p>Price: <span>${book.price}$</span> </p>
//             <p>Rate: <span>${book.rate}</span> </p>
            
//             <button onclick="onReadBook('${book.id}')">Details</button>
//             <button onclick="onUpdateBook('${book.id}')">Update</button>

//             <img title="Photo of ${book.bookName}" 
//                 src="img/${book.bookName}.png" 
//                 alt="Book by ${book.bookName}"
//                 onerror="this.src='img/default.png'">
//         </article> 
//     `
//     )
//     document.querySelector('.books-container').innerHTML = strHtmls.join('')
//     renderPagesBtn()
// }

//cards
// function renderBooks() {
//     var books = getBooks()
//     console.log('books: ', books)

//     var strHtmls = books.map(
//         (book) => `



//         <article class="book-preview">
//             <button title="Delete book" class="btn-remove" onclick="onRemoveBook('${book.id}')">X</button>
            
//             <h2>${book.bookName}</h2>
//             <p>Price: <span>${book.price}$</span> </p>
//             <p>Rate: <span>${book.rate}</span> </p>
            
//             <button onclick="onReadBook('${book.id}')">Details</button>
//             <button onclick="onUpdateBook('${book.id}')">Update</button>

//             <img title="Photo of ${book.bookName}" 
//                 src="img/${book.bookName}.png" 
//                 alt="Book by ${book.bookName}"
//                 onerror="this.src='img/default.png'">
//         </article> 
//     `
//     )
//     document.querySelector('.books-container').innerHTML = strHtmls.join('')
//     renderPagesBtn()
// }

function renderPagesBtn() {
    var elPrevPage = document.querySelector('.prevPage')
    var elNextPage = document.querySelector('.nextPage')

    elPrevPage.disabled = isPrevBtnDisabled()
        
    elNextPage.disabled = isNextBtnDisabled()
       
}

function renderBookNames() {
    const bookNames = getBookNames()
    const strHtmls = bookNames.map((bookName) => `<option>${bookName}</option>`)

    strHtmls.unshift(`<option value="">Select BookName</option>`)

    const elSelect = document.querySelector('.filter-by select')
    elSelect.innerHTML = strHtmls.join('')
}

function onNextPage() {
    nextPage()
    renderBooks()
}
function onPrevPage() {
    prevPage()
    renderBooks()
}

function onRemoveBook(bookId) {
    removeBook(bookId)
    renderBooks()
    flashMsg(`Book Deleted`)
}

function onAddBook() {
    var bookName = prompt('bookName?')
    if (!bookName) return

    const book = addBook(bookName)
    renderBooks()
    flashMsg(`Book Added (id: ${book.id})`)
}

function onUpdateBook(bookId) {
    const book = getBookById(bookId)

    var newPrice = +prompt('Price?', book.price)
    if (!newPrice || book.price === newPrice) return

    const updatedBook = updateBook(bookId, newPrice)
    renderBooks()
    flashMsg(`Price updated to: ${updatedBook.price}`)
}

function onReadBook(bookId) {
    const book = getBookById(bookId)
    const elModal = document.querySelector('.modal')

    elModal.querySelector('h3').innerText = book.bookName
    elModal.querySelector('.modalPrice span').innerText = book.price
    elModal.querySelector('.modalRate span').innerText = book.rate
    elModal.querySelector('p').innerText = book.desc

    elModal.classList.add('open')
}

function onSetFilterBy(filterBy) {
    filterBy = setBookFilter(filterBy)
    renderBooks()

    const queryParams = `?bookName=${filterBy.bookName}&minRate=${filterBy.minRate}`
    const newUrl =
        window.location.protocol +
        '//' +
        window.location.host +
        window.location.pathname +
        queryParams

    window.history.pushState({ path: newUrl }, '', newUrl)
}

function onCloseModal() {
    document.querySelector('.modal').classList.remove('open')
}

function flashMsg(msg) {
    const elUserMsg = document.querySelector('.user-msg')

    elUserMsg.innerText = msg
    elUserMsg.classList.add('open')
    setTimeout(() => elUserMsg.classList.remove('open'), 3000)
}

function renderFilterByQueryParams() {
    const queryParams = new URLSearchParams(window.location.search)
    const filterBy = {
        bookName: queryParams.get('bookName') || '',
        minRate: +queryParams.get('minRate') || 0,
    }

    if (!filterBy.bookName && !filterBy.minRate) return

    document.querySelector('.filter-by select').value = filterBy.bookName
    document.querySelector('.filter-by input').value = filterBy.minRate

    setBookFilter(filterBy)
}

function onSetSortBy() {
    const prop = document.querySelector('.sort-by select').value
    const isDesc = document.querySelector('.sort-by .sort-desc').checked

    console.log('prop: ', prop)
    console.log('isDesc: ', isDesc)

    if (!prop) return

    const sortBy = {}
    sortBy[prop] = isDesc ? -1 : 1

    setBookSort(sortBy)
    renderBooks()
}
