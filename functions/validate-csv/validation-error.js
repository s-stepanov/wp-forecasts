class ValidationError extends Error {
  constructor(opts) {
    super(opts);
  }
}

module.exports = ValidationError;
