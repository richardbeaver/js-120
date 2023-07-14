let AnimalPrototype = {
  init(name, age) {
    this.name = name;
    this.age = age;
    return this;
  },

  greet() {
    return `Hello, my name is ${this.name}.`;
  },

  move() {
    return "Moving";
  },
};

// =============================

let DogPrototype = {
  init(name, age, master) {
    let superClass = Object.getPrototypeOf(DogPrototype);
    superClass.init.call(this, name, age);

    // AnimalPrototype.init.call(this, name, age);
    this.master = master;
    return this;
  },

  bark() {
    return "Woof";
  },

  getMaster() {
    return this.master;
  },
};

Object.setPrototypeOf(DogPrototype, AnimalPrototype);

// Or:

// let DogPrototype = Object.create(AnimalPrototype);

// DogPrototype.init = function(...) {
//   ...
// }

// DogPrototype.bark = function() {
//   ...
// }

// ...

// =============================

let CatPrototype = {
  meow() {
    return "Meow";
  }
};

Object.setPrototypeOf(CatPrototype, AnimalPrototype);

// =============================

let doug = Object.create(DogPrototype).init('Doug', 3, 'Matt');
let katie = Object.create(CatPrototype).init('Katie', 5);

// =============================

console.log(doug.move());
console.log(doug.greet());
console.log(doug.bark());
console.log(doug.getMaster());

console.log(katie.move());
console.log(katie.greet());
console.log(katie.meow());

// Expected Output:
// Moving
// Hello, my name is Doug.
// Woof
// Matt
// Moving
// Hello, my name is Katie.
// Meow
