// 3 Book examples:

// Attributes
//   Title: Mythos
//   Author: Stephen Fry

// Behavior:
//   Get Description

// -----------------------------
// Attributes
//   Title: Me Talk Pretty One Day
//   Author: David Sedaris

// Behavior:
//   Get Description

// -----------------------------
// Attributes
//  Title: Aunts aren't Gentlemen
//  Author: PG Wodehouse

//  Behavior:
//    Get Description

// =============================================================

// 3 Book objects
// `getDescription` is duplicated in each object
// Each object has unique values for `title` and `author`

let mythos = {
  title: "Mythos",
  author: "Stephen Fry",
  getDescription: function() {
    return `${this.title} was written by ${this.author}.`;
  },
};

let meTalkPrettyOneDay = {
  title: "Me Talk Pretty One Day",
  author: "David Sedaris",
  getDescription: function() {
    return `${this.title} was written by ${this.author}.`;
  },
};

let auntsArentGentlemen = {
  title: "Aunts aren't Gentlemen",
  author: "PG Wodehouse",
  getDescription: function() {
    return `${this.title} was written by ${this.author}.`;
  },
};

// =============================================================

// Factory function with added functionality
function createBook(title, author, read = false) {
  return {
    title,
    author,
    read,

    getDescription: function() {
      return `${this.title} was written by ${this.author}. ` +
             `I ${this.read ? "have" : "haven't"} read it.`;
    },
    readBook: function() {
      this.read = true;
    },
  };
}

let book1 = createBook('Mythos', 'Stephen Fry');
let book2 = createBook('Me Talk Pretty One Day', 'David Sedaris', false);
let book3 = createBook("Aunts aren't Gentlemen", 'PG Wodehouse', true);

// Adding `read` property
console.log(
  book1.read,  // false
  book2.read,  // false
  book3.read,  // true
);

console.log(
  book1.getDescription(),  //  "Mythos was written by David Fry. I haven't read it."
  book2.getDescription(),  // "Me Talk Pretty One Day was written by David Sedaris. I haven't read it."
  book3.getDescription(),  // "Aunts aren't Gentlemen was written by PG Wodehouse. I have read it."
);

console.log(book1.read); // => false
book1.readBook();
console.log(book1.read); // => true

/* eslint no-unused-vars: */
