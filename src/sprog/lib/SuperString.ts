
const proxifyString = (str: any) => {
  const obj = { value: str };
  return new Proxy(obj, {
    get(target, prop) {
      // Intercept string retrieval
      if (prop === 'value') {
        console.log(`String retrieval: ${target[prop]}`);
        return target[prop];
      }
    },
    set(target: any, prop, value) {
      // Intercept string assignment
      if (prop === 'value' && typeof value === 'string') {
        console.log(`String assignment: ${value}`);
      }
      target[prop] = value;
      return true;
    }
  });
};

// Usage example
let myVariable;
myVariable = proxifyString(myVariable);

myVariable.value = 'Hello, World!'; // Output: String assignment: Hello, World!

console.log(myVariable.value);
