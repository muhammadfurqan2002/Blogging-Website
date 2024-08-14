import User from '../models/user.model.js'
import bcryptjs from 'bcryptjs'
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
    const { username, password, email } = req.body;
    console.log(req.body);
    if (!username || !email || !password || username === '' || email === '' || password === '') {
        next(errorHandler(400, "All fields are required"));
    }

    const hashedPassword = bcryptjs.hashSync(password, 10)

    const user = new User({
        username,
        email,
        password: hashedPassword
    })

    try {

        await user.save();
        res.json('Signup successful')
    } catch (error) {
        next(error)
    }
}


export const signin = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password || email === '' || password === '') {
        next(errorHandler(400, "All fields are required"));
    }
    try {
        const validuser = await User.findOne({ email: email });
        if (!validuser) {
            return next(errorHandler(404, "User not found"));
        }

        const validPassword = bcryptjs.compareSync(password, validuser.password);

        if (!validPassword) {
            return next(errorHandler(400, "Inavlid Password"));
        }

        const token = jwt.sign({
            id: validuser._id,isAdmin:validuser.isAdmin
        }, process.env.JWT_SECRET);


        const {password:pass,...rest}=validuser._doc;

        res.status(200).cookie('access_token', token, {
            httpOnly: true //secure our cookie 
        }).json(rest)
    } catch (error) {
        next(error)
    }

}
