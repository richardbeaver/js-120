class Animal {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  greet() {
    return `Hello, my name is ${this.name}.`;
  }

  move() {
    return "Moving";
  }
}

// =============================

class Dog extends Animal {
  constructor(name, age, master) {
    super(name, age);
    this.master = master;
  }

  bark() {
    return "Woof";
  }

  getMaster() {
    return this.master;
  }
}

// =============================

class Cat extends Animal {
  meow() {
    return "Meow";
  }
}

// =============================

let doug = new Dog('Doug', 3, 'Matt');
let katie = new Cat('Katie', 5);

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
