import local from 'passport-local'; //esto es la estrategia
import passport from 'passport';
import jwt from 'passport-jwt';
import { createHash, validatePassword } from '../utils/bcrypt.js';
import GithubStrategy from 'passport-github2';
import logger from './logger.js';
import { userModel } from '../models/users.models.js';


//definimos la estrategia

const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy

const ExtractJWT = jwt.ExtractJwt //Extraer de las cookies el token

const initializePassport = () => {

    const cookieExtractor = req => {
        // console.log("cookie: ", req.cookies)
        if (req.cookies.jwtCookie) {
            console.log("cookie", req.cookies)
            const token = req.cookies.jwtCookie ? req.cookies.jwtCookie : {};
            return token;
        }
        const token = req.headers.authorization ? req.headers.authorization : {};
        return token;
    }


passport.use('jwt', new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]), //el token vendra desde cookieExtractor.
    secretOrKey: process.env.JWT_SECRET
}, async (jwt_payload, done) => {//jwt_payload = info del token (en este caso datos del cliente)                            
    try {
        const user = {
            _id : jwt_payload.user._id,
            first_name : jwt_payload.user.first_name,
            last_name : jwt_payload.user.last_name,
            rol : jwt_payload.user.rol,
            email : jwt_payload.user.email,
            thumbnail : jwt_payload.user.thumbnail,
            cart : jwt_payload.user.cart
        }

        return done(null, user);
    } catch (error) {
        logger.error(`Error en estrategia jwt en passport ${error}`)
        return done(error);
    }
}))

passport.use('register', new LocalStrategy(
    { passReqToCallback: true, usernameField: ('email') },
    async (req, username, password, done) => {
        ///registro de usuario
        const { first_name, last_name, email, age } = req.body;
        try {
            const user = await userModel.findOne({ email: username });

            //caso de error
            if (user) {
                logger.info('Usuario ya existente')
                return done(null, false, { message: 'Usuario ya registrado' });
            }
            //crear usuario
            const passwordHash = createHash(password);
            const userCreated = await userModel.create({
                first_name: first_name,
                last_name: last_name,
                age: age,
                email: email,
                password: passwordHash
            });
            return done(null, userCreated)

        } catch (error) {
            logger.error(`Error en estrategia jwt en passport ${error}`)
            return done(error);
        }

    }
))

passport.use('login', new LocalStrategy(
    { usernameField: 'email' }, async (username, password, done) => {
        try {
            const user = await userModel.findOne({ email: username })
            if (!user) {
                logger.info('Usuario no existe')
                return done(null, false);
            }
            if (validatePassword(password, user.password)) {
                return done(null, user);
            } else {
                logger.info('Contraseña no valida')
                return done(null, false);
            }
        } catch (error) {
            logger.error(`Error en estrategia login en passport ${error}`)
            return done(error)
        }
    }))

passport.use('github', new GithubStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.SECRET_CLIENT,
    callbackURL: process.env.CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
    try {
        console.log(accessToken)
        console.log(refreshToken)
        console.log(profile._json)

        const user = await userModel.findOne({ email: profile._json.email })
        if (user) {
            logger.info('Usuario existe en github')
            done(null, false);
        } else {
            const userCreated = await userModel.create({
                first_name: profile._json.name,
                last_name: "",
                age: 18, //edad por defecto
                email: profile._json.email,
                password: createHash(profile._json.email + profile._json.name)
            })
            done(null, userCreated);
        }

    } catch (error) {
        logger.error(`Error en estrategia github en passport ${error}`)
        done(error)
    }
}))

//inicializar la session de user
passport.serializeUser((user, done) => {
    done(null, user._id);
})

//eliminar la session
passport.deserializeUser(async (id, done) => {
    const user = await userModel.findById(id);
    done(null, user);
})
}

export default initializePassport;