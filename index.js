"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function deepClone(obj) {
    if (obj === null || typeof obj !== "object") {
        return obj;
    }
    if (Array.isArray(obj)) {
        const arrCopy = [];
        for (let item of obj) {
            arrCopy.push(deepClone(item));
        }
        return arrCopy;
    }
    const objCopy = {};
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            objCopy[key] = deepClone(obj[key]);
        }
    }
    return objCopy;
}
function throttle(fn, wait) {
    let lastTime = 0;
    return function (...args) {
        const now = new Date().getTime();
        if (now - lastTime >= wait) {
            lastTime = now;
            fn.apply(this, args);
        }
    };
}
function fetchWithRetry(url_1) {
    return __awaiter(this, arguments, void 0, function* (url, options = {}, retries = 3, backoff = 300) {
        for (let i = 0; i < retries; i++) {
            try {
                const response = yield fetch(url, options);
                if (!response.ok)
                    throw new Error("Fetch failed");
                return response;
            }
            catch (error) {
                if (i < retries - 1) {
                    yield new Promise((resolve) => setTimeout(resolve, backoff * Math.pow(2, i)));
                }
                else {
                    throw error;
                }
            }
        }
        throw new Error("Max retries reached");
    });
}
const original = {
    name: "John",
    age: 30,
    address: {
        street: "123 Main St",
        city: "Anytown",
    },
    hobbies: ["reading", "gaming"],
};
const cloned = deepClone(original);
console.log(cloned);
console.log(cloned !== original);
console.log(cloned.address !== original.address);
console.log(cloned.hobbies !== original.hobbies);
// End deepClone function
// Throttle function
function logMessage(message) {
    console.log(message, new Date().toISOString());
}
const throttledLogMessage = throttle(logMessage, 2000);
setInterval(() => throttledLogMessage("Throttled message"), 500);
// This will log "Throttled message" at most once every 2 seconds
// End throttle function
// fetchWithRetry function
function fetchData() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetchWithRetry("https://jsonplaceholder.typicode.com/posts");
            const data = yield response.json();
            console.log(data.slice(0, 5));
        }
        catch (error) {
            console.error("Fetch failed after 3 retries", error);
        }
    });
}
fetchData();
// End fetchWithRetry function
