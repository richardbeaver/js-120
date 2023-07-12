function createAnimal(name, age) {
  return {
    name,
    age,

    greet() {
      return `Hello, my name is ${this.name}.`;
    },
    move() {
      return "Moving";
    },
  };
}

// =============================

function createDog(name, age, master) {
  let animalObject = createAnimal(name, age);

  let dogObject = {
    master,

    bark() {
      return "Woof";
    },
    getMaster() {
      return this.master;
    },
  };

  return Object.assign(dogObject, animalObject);
}

// =============================

function createCat(name, age) {
  let animalObject = createAnimal(name, age);

  let catObject = {
    meow() {
      return "Meow";
    },
  };

  return Object.assign(catObject, animalObject);
}

// =============================

let doug = createDog('Doug', 3, 'Matt');
let katie = createCat('Katie', 5);

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
