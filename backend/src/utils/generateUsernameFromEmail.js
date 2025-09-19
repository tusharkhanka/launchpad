const generateUsernameFromEmail = (email) => {
    if (!email) return null;
    return email.split("@")[0];
  };
  
  module.exports = generateUsernameFromEmail;
  