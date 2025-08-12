const authService = require('./auth.service');

exports.signup = async (req, res, next) => {
  try {
    const user = await authService.signUp(req.body);
    res.status(201).json({ user });
  } catch (err) { next(err); }
};

exports.signin = async (req, res, next) => {
  try {
    const data = await authService.signIn(req.body);
    res.json(data);
  } catch (err) { next(err); }
};
