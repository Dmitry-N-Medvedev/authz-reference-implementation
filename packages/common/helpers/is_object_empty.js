/* eslint max-len: ["error", { "code": 160 }] */

const is_object_empty = (object) => (
  (object === null || typeof object === 'undefined') ? true : Object.entries(object).length === 0 && object.constructor === Object
);


module.exports = is_object_empty;
