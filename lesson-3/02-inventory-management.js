// Inventory Management exercise

// Keeping track of products in hardware store's inventory

// Primitive data values about items:
let scissorsId = 0;
let scissorsName = 'Scissors';
let scissorsStock = 8;
let scissorsPrice = 10;

let drillId = 1;
let drillName = 'Cordless Drill';
let drillStock = 15;
let drillPrice = 45;

// To objects that contain data for each product in one entity:
let scissorsData = {
  id: 0,
  name: 'Scissors',
  stock: 8,
  price: 10,
};

let drillData = {
  id: 1,
  name: 'Cordless Drill',
  stock: 15,
  price: 45,
};

// Taking advantage of conventions in the product objects => a function that
// can change the price of a supplied object to a supplied non-negative price
function setProductPrice(product, newPrice) {
  if (newPrice >= 0) {
    product.price = newPrice;
  } else {
    alert('Invalid price!');
  }
}

// Function to ouput descriptions of a product
function describeProduct(product) {
  console.log(`Name: ${product.name}`);
  console.log(`ID: ${product.id}`);
  console.log(`Price: $${product.price}`);
  console.log(`Stock: ${product.stock}`);
}

describeProduct(scissorsData);
// => Name: Scissors
// => ID: 0
// => Price: $10
// => Stock: 8

//

// Placing functions that manipulate data of an object into the object literal
// as methods
let scissorsLiteral = {
  id: 0,
  name: 'Scissors',
  stock: 8,
  price: 10,

  setPrice(newPrice) {
    if (newPrice >= 0) {
      this.price = newPrice;
    } else {
      alert('Invalid price!');
    }
  },

  describe() {
    console.log(`Name: ${this.name}`);
    console.log(`ID: ${this.id}`);
    console.log(`Price: $${this.price}`);
    console.log(`Stock: ${this.stock}`);
  },
};

let drillLiteral = {
  id: 1,
  name: 'Cordless Drill',
  stock: 15,
  price: 45,

  setPrice(newPrice) {
    if (newPrice >= 0) {
      this.price = newPrice;
    } else {
      alert('Invalid price!');
    }
  },

  describe() {
    console.log(`Name: ${this.name}`);
    console.log(`ID: ${this.id}`);
    console.log(`Price: $${this.price}`);
    console.log(`Stock: ${this.stock}`);
  },
};

//

// Factory function to create new product objects without manually duplicating
// methods for each one
function createProduct(id, name, stock, price) {
  return {
    id,
    name,
    stock,
    price,

    setPrice(newPrice) {
      if (newPrice >= 0) {
        this.price = newPrice;
      } else {
        alert('Invalid price!');
      }
    },

    describe() {
      console.log(`Name: ${this.name}`);
      console.log(`ID: ${this.id}`);
      console.log(`Price: $${this.price}`);
      console.log(`Stock: ${this.stock}`);
    },
  };
}

// Recreating products using the factory function
let scissors = createProduct(0, 'Scissors', 8, 10);
let drill = createProduct(1, 'Cordless Drill', 15, 45);
let saw = createProduct(2, 'Circular Saw', 12, 95);
let hammer = createProduct(3, 'Sledge Hammer', 78, 45);

/* eslint max-lines-per-function:, no-unused-vars: */
