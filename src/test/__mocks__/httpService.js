const result = {
  get: jest.fn().mockReturnThis(),
  pipe: jest.fn().mockReturnThis(),
  toPromise: jest.fn().mockReturnThis()
};

module.exports = jest.fn(() => result);
