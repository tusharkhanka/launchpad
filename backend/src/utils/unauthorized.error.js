class Unauthorized extends Error {
    constructor() {
      super();
      this.name = 'Unauthorized';
      this.message = this.constructor.name;
    }
  }
  
  module.exports = Unauthorized;
  