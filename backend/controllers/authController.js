const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    const mockUser = {
      _id: "65f1a2b3c4d5e6f7a8b9c0d9",
      name: name || "Jane Doe",
      email: email || "jane@example.com",
      role: role || "patient"
    };

    const token = jwt.sign(
      { id: mockUser._id, role: mockUser.role },
      process.env.JWT_SECRET || "mySuperSecretKey123",
      { expiresIn: '1d' }
    );

    return res.status(201).json({
      success: true,
      message: "Identity Profile Provisioned Successfully (Mock)",
      token,
      user: mockUser
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.login = async (req, res) => {
  return res.status(200).json({ success: true, token: "mock_token" });
};
