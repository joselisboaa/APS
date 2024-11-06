import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET;

export const verifyUserAuth = function () {
    return async function (req, res, next) {
        const authHeaderToken = req.headers['authorization'];

        if (authHeaderToken === null || authHeaderToken === undefined) {
            return res.status(401).json({ message: 'Não há usuário autenticado.' });
        }

        jwt.verify(authHeaderToken, jwtSecret, (error, user) => {
            if (error) {
                return res.status(403).json({ message: 'Token inválido ou expirado.' });
            }
            
            next();
        });
    }
}
