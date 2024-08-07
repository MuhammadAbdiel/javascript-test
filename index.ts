function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (Array.isArray(obj)) {
    const arrCopy = [] as any[];
    for (let item of obj) {
      arrCopy.push(deepClone(item));
    }
    return arrCopy as unknown as T;
  }

  const objCopy = {} as { [key: string]: any };
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      objCopy[key] = deepClone((obj as { [key: string]: any })[key]);
    }
  }
  return objCopy as T;
}

function throttle(fn: Function, wait: number) {
  let lastTime = 0;
  return function (this: any, ...args: any[]) {
    const now = new Date().getTime();
    if (now - lastTime >= wait) {
      lastTime = now;
      fn.apply(this, args);
    }
  };
}

async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retries = 3,
  backoff = 300
): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error("Fetch failed");
      return response;
    } catch (error) {
      if (i < retries - 1) {
        await new Promise((resolve) =>
          setTimeout(resolve, backoff * Math.pow(2, i))
        );
      } else {
        throw error;
      }
    }
  }
  throw new Error("Max retries reached");
}

// Example usage

// deepClone function
interface Person {
  name: string;
  age: number;
  address: {
    street: string;
    city: string;
  };
  hobbies: string[];
}

const original: Person = {
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
function logMessage(message: string) {
  console.log(message, new Date().toISOString());
}

const throttledLogMessage = throttle(logMessage, 2000);

setInterval(() => throttledLogMessage("Throttled message"), 500);
// This will log "Throttled message" at most once every 2 seconds
// End throttle function

// fetchWithRetry function
async function fetchData() {
  try {
    const response = await fetchWithRetry(
      "https://jsonplaceholder.typicode.com/posts"
    );
    const data = await response.json();
    console.log(data.slice(0, 5));
  } catch (error) {
    console.error("Fetch failed after 3 retries", error);
  }
}

fetchData();
// End fetchWithRetry function
