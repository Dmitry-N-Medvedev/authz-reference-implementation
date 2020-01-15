module.exports = is_object_empty = (object) => Object.entries(object).length === 0 && object.constructor === Object;
