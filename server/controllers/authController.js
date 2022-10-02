const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const httpStatusCodes = require('../utils/httpStatusCodes');

exports.getUser = catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id);

  res.status(httpStatusCodes.OK).json({
    status: 'success',
    user,
  });
});

exports.getRoomUsers = catchAsync(async (req, res) => {
  const users = await User.find({ room: req.params.room });

  res.status(httpStatusCodes.OK).json({
    status: 'success',
    data: users,
  });
});

exports.signup = catchAsync(async (req, res) => {
  const newUser = await User.create(req.body);

  res.status(httpStatusCodes.CREATED).json({
    status: 'success',
    user: newUser,
  });
});

exports.deleteUser = catchAsync(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);

  res.status(httpStatusCodes.NO_CONTENT).json({
    status: 'success',
    user,
  });
});
