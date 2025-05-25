// import jwt from 'jsonwebtoken';

// const adminAuth = async (req, res, next) => {
//     try {
//         const token = req.headers.token || req.headers.authorization || req.headers['x-access-token'];
//         // console.log("Headers:", req.headers);
//         // console.log("Received Token:", token);

//         if (!token) {
//             return res.json({ success: false, message: "Not authorized, login as Admin" });
//         }
//         console.log("Token received in backend middleware:", token);

//         const token_decode = jwt.verify(token, process.env.JWT_SECRET);
//         if (token_decode.email !== process.env.ADMIN_EMAIL) {
//             return res.json({ success: false, message: "Not authorized, login as Admin" });
//         }

//         next();
//     } catch (error) {
//         console.log("Error in adminAuth:", error);
//         res.json({ success: false, message: error.message });
//     }
// };

// export default adminAuth;


import jwt from 'jsonwebtoken';

const adminAuth = async (req, res, next) => {
    try {
        let token = req.headers.token || req.headers.authorization || req.headers['x-access-token'];

        if (!token) {
            return res.json({ success: false, message: "Not authorized, login as Admin" });
        }

        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length);
        }

        // console.log("Token received in backend middleware (after cleanup):", token);

        const token_decode = jwt.verify(token, process.env.JWT_SECRET);

        if (token_decode.email !== process.env.ADMIN_EMAIL) {
            return res.json({ success: false, message: "Not authorized, login as Admin" });
        }

        next();
    } catch (error) {
        console.log("Error in adminAuth:", error);
        res.json({ success: false, message: error.message });
    }
};

export default adminAuth;
