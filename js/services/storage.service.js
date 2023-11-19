'use strict'

function saveToStorage(key, value) {
    const strVal = JSON.stringify(value)
    localStorage.setItem(key, strVal)
}

function loadFromStorage(key) {
    var strVal = localStorage.getItem(key)
    return JSON.parse(strVal)
}

function removeFromStorage(key) {
    var strVal = localStorage.removeItem(key)
    return JSON.parse(strVal)
}