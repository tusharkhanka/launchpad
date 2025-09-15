const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userProvider = require('../../dataProviders/userProvider');
const UserSessionDataProvider = require('../../dataProviders/userSessionsProvider');
const { JWT_SECRET } = process.env;

const AuthService = {};

AuthService.register = async ({ username, email, password }) => {
    // Check if user already exists
    const existingUser = await userProvider.findByEmail(email);
    if (existingUser) {
        throw new Error('User already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userProvider.create({ username, email, password: hashedPassword });

    return user;
};
AuthService.login = async ({ email, password }) => {
    const user = await userProvider.findByEmail(email);
    if (!user) throw new Error('User not found');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid credentials');

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    const userId = user.id;
    await UserSessionDataProvider.create({ userId, token, expiresAt });
    return { token, user };
};

AuthService.verifyToken = async (token) => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const session = await UserSessionDataProvider.findByToken(token);
        if (!session) throw new Error('Invalid session');
        return decoded;
    } catch (err) {
        throw new Error('Invalid or expired token');
    }
};

AuthService.logout = async (token) => {
    await UserSessionDataProvider.deleteSession(token);
    return { message: 'Logged out successfully' };
};

module.exports = AuthService;
