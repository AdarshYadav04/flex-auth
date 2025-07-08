const validateInput = (method, data) => {
  const requiredFields = {
    'email-password': ['email', 'password'],
    'email-username-password': ['email', 'username', 'password'],
    'mobile-username-password': ['mobile', 'username', 'password']
  };

  const fields = requiredFields[method];
  if (!fields) return { valid: false, message: 'Unknown auth method' };

  for (const field of fields) {
    if (!data[field]) return { valid: false, message: `${field} is required` };
  }
  return { valid: true };
};

module.exports = { validateInput };
