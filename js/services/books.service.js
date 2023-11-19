'use strict'

const STORAGE_KEY = 'bookDB'
const PAGE_SIZE = 4

var gBooks
var gCurrPageIdx = 0

var gBookNames = [
    'Hagiraf shegired lo baaf',
    'When Nitche cried',
    'Tfilayla',
    '1984',
]
var gFilterBy = { minRate: 0, bookName: '' }

_createBooks()

function getBooks() {
    console.log('gBooks: ', gBooks)

    var books = gBooks.filter(
        (book) =>
            book.bookName.includes(gFilterBy.bookName) &&
            book.rate >= gFilterBy.minRate
    )

    const startIdx = gCurrPageIdx * PAGE_SIZE
    books = books.slice(startIdx, startIdx + PAGE_SIZE)
    return books
}

function getBookNames() {
    return gBookNames
}

function nextPage() {
    gCurrPageIdx++
}

function prevPage() {
    gCurrPageIdx--
}

function getBooksByPrice() {
    // Fast > 180, Medium > 100, slow: the rest
    // { fast: 3, medium: 8, slow: 6 }

    return gBooks.reduce(
        (priceMap, book) => {
            if (book.price > 180) priceMap.fast++
            else if (book.price > 100) priceMap.medium++
            else priceMap.slow++

            return priceMap
        },
        { fast: 0, medium: 0, slow: 0 }
    )
}

function getBooksByBookName() {
    return gBooks.reduce((bookNameMap, book) => {
        if (!bookNameMap[book.bookName]) bookNameMap[book.bookName] = 1
        else bookNameMap[book.bookName]++

        return bookNameMap
    }, {})
}

function removeBook(bookId) {
    const bookIdx = gBooks.findIndex((book) => bookId === book.id)
    gBooks.splice(bookIdx, 1)

    _saveBooksToStorage()
}

function addBook(bookName) {
    const book = _createBook(bookName)
    gBooks.unshift(book)

    _saveBooksToStorage()
    return book
}

function getBookById(bookId) {
    return gBooks.find((book) => bookId === book.id)
}

function updateBook(bookId, newPrice) {
    const book = gBooks.find((book) => book.id === bookId)
    book.price = newPrice

    _saveBooksToStorage()
    return book
}

function setBookFilter(filterBy) {
    // { minRate: 90 }
    if (filterBy.bookName !== undefined) gFilterBy.bookName = filterBy.bookName
    if (filterBy.minRate !== undefined) gFilterBy.minRate = filterBy.minRate

    return gFilterBy
}

function setBookSort(sortBy = {}) {
    if (sortBy.price !== undefined) {
        gBooks.sort((c1, c2) => (c2.price - c1.price) * sortBy.price)
    } else if (sortBy.bookName !== undefined) {
        gBooks.sort(
            (c1, c2) => c1.bookName.localeCompare(c2.bookName) * sortBy.bookName
        )
    }
}

function isPrevBtnDisabled() {
    return gCurrPageIdx === 0
}

function isNextBtnDisabled() {
    return ((gCurrPageIdx+1) * PAGE_SIZE) >= gBooks.length
}

function _createBook(bookName) {
    return {
        id: makeId(),
        bookName,
        price: getRandomIntInclusive(5, 50),
        imgUrl: `img/${bookName}.png`,
        rate: getRandomIntInclusive(0, 10),
        desc: makeLorem(),
    }
}

function _createBooks() {
    gBooks = loadFromStorage(STORAGE_KEY)
    if (gBooks && gBooks.length) return

    // If no books in storage - generate demo data

    gBooks = []

    for (let i = 0; i < gBookNames.length; i++) {
        var bookName = gBookNames[i]
        gBooks.push(_createBook(bookName))
    }
    _saveBooksToStorage()
}

function _saveBooksToStorage() {
    saveToStorage(STORAGE_KEY, gBooks)
}
