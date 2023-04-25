import jwt from "jsonwebtoken";

const generateToken = (id) => {
  return jwt.sign({ id}, 'admin', {
    expiresIn: "1000d",
  });
};

export default generateToken;
