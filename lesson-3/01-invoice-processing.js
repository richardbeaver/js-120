// Invoice Processor exercise

// Factory function to create payments

// - Takes an object argument with either one of `phone` or `internet`
//   properties, both properties, or an `amount` property
// - Returns an object with the amount paid for each service, and a `total`
//   method that returns total payment

function createPayment(services = {}) {
  return {
    phone: services.phone ?? 0,
    internet: services.internet ?? 0,
    amount: services.amount,

    total() {
      return this.amount ?? this.phone + this.internet;
    }
  };
}

function paymentTotal(payments) {
  return payments.reduce((sum, payment) => sum + payment.total(), 0);
}

// ===========

let payments = [];
payments.push(createPayment());
payments.push(createPayment({
  internet: 6500,
}));

payments.push(createPayment({
  phone: 2000,
}));

payments.push(createPayment({
  phone: 1000,
  internet: 4500,
}));

payments.push(createPayment({
  amount: 10000,
}));

console.log(paymentTotal(payments));        // => 24000

// =================================================

// Factory function to produce invoices

// - Returns an invoice object, with phone and internet properties, and a
//   total method.
// - The default value for the phone service is 3000, and the internet service
//   is 5500 (in cents).
// - The function takes an object argument whose attributes override the
//   default values.
// - Allows adding of associated payments for each invoice.

function createInvoice(services = {}) {
  return {
    phone: services.phone ?? 3000,
    internet: services.internet ?? 5500,
    payments: [],

    total() {
      return this.phone + this.internet;
    },

    addPayment(payment) {
      this.payments.push(payment);
    },

    addPayments(payments) {
      // Arrow function to call `this.addPayment` without losing execution
      // context
      // payments.forEach((payment) => this.addPayment(payment));

      // Ways to only pass name of function:

      // Could bind it to `this`
      // payments.forEach(this.addPayment.bind(this));

      // Or just provide `this` as the optional `myArg` argument that `forEach`
      // takes
      payments.forEach(this.addPayment, this);
    },

    paymentTotal() {
      return this.payments.reduce((sum, payment) => sum + payment.total(), 0);
    },

    amountDue() {
      return this.total() - this.paymentTotal();
    }
  };
}

function invoiceTotal(invoices) {
  let total = 0;

  for (let index = 0; index < invoices.length; index += 1) {
    total += invoices[index].total();
  }

  return total;
}

// ===========

let invoices = [];
invoices.push(createInvoice());
invoices.push(createInvoice({ internet: 6500 }));
invoices.push(createInvoice({ phone: 2000 }));
invoices.push(createInvoice({
  phone: 1000,
  internet: 4500,
}));

console.log(invoiceTotal(invoices));          // => 31000

// ===========

let invoice = createInvoice({
  phone: 1200,
  internet: 4000,
});

let payment1 = createPayment({ amount: 2000 });
let payment2 = createPayment({
  phone: 1000,
  internet: 1200
});

let payment3 = createPayment({ phone: 1000 });

invoice.addPayment(payment1);
invoice.addPayments([payment2, payment3]);
console.log(invoice.amountDue());               // this should return 0

// Expected total output:
// 24000
// 31000
// 0

/* eslint max-lines-per-function: */

