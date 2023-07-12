function Animal(name, age) {
  this.name = name;
  this.age = age;
}

Animal.prototype.greet = function() {
  return `Hello, my name is ${this.name}.`;
};

Animal.prototype.move = function() {
  return "Moving";
};

// =============================

function Dog(name, age, master) {
  Animal.call(this, name, age);
  this.master = master;
}

Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.bark = function() {
  return "Woof";
};

Dog.prototype.getMaster = function() {
  return this.master;
};

// =============================

function Cat(name, age) {
  Animal.call(this, name, age);
}

Cat.prototype = Object.create(Animal.prototype);
Cat.prototype.constructor = Cat;

Cat.prototype.meow = function() {
  return "Meow";
};

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
