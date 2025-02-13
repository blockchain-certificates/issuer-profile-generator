// taken from https://html.spec.whatwg.org/multipage/input.html#email-state-(type=email)
const regex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

const validateEmail = (email) => {
  if (typeof email !== 'string') {
    throw new Error('Email must be a string');
  }
  if (!regex.test(email)) {
    throw new Error('Email must be a valid email address');
  }
};

module.exports = validateEmail;
