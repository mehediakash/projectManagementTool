const UserService = require('./user.service');

exports.createUser = async (req, res, next) => {
  try {
    const created = await UserService.create(req.body);
    res.status(201).json(created);
  } catch (err) { next(err); }
};

exports.getUser = async (req, res, next) => {
  try {
    const id = req.params.id;
   
    if (req.user._id.toString() !== id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const user = await UserService.getById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) { next(err); }
};

exports.updateUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (req.user._id.toString() !== id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const updated = await UserService.update(id, req.body);
    res.json(updated);
  } catch (err) { next(err); }
};

exports.deleteUser = async (req, res, next) => {
  try {
    await UserService.remove(req.params.id);
    res.json({ success: true });
  } catch (err) { next(err); }
};

exports.listUsers = async (req, res, next) => {
  try {
    const q = req.query.q || '';
    const users = await UserService.list({ q });
    res.json(users);
  } catch (err) { next(err); }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await UserService.getById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) { next(err); }
};
