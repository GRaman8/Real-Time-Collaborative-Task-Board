import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';

function authMiddleware(req, res, next) {
  const token = req.header('x-auth-token');

  if (!token || !token.startsWith('Bearer')) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  const words = token.split(" ");
  const jwtToken = words[1];

  try {
    const decodedValue = jwt.verify(jwtToken, JWT_SECRET);
    
    if(decodedValue.userId){
        req.userId = decodedValue.userId;
        next();
    }  
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

export default authMiddleware;