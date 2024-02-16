import passport from 'passport';


//funcion general para retornar errores en las estrategias de passport

export const passportError = (strategy) => {
    return async (req, res, next) => {
        //recibimos o local o github o jwt
        passport.authenticate(strategy, (error, user, info) => {
            if (error) {
                //retornamos next porque depende el tipo de error sera como lo manejaremos.
                return next(error)
            }
            if (!user) {
                res.status(401).send({ error: info.messages ? info.messages : info.toString() })  //aqui me aseguro que no me tire errores, ya que dependera de la estrategia si envia un string u objeto simple, o un objeto.
            } else {
                req.user = user
                next()
            }
        })(req, res, next) //esto es porque me va a llamar un middleware, a nivel de ruta.
        //significa que estamos ejecutando esta funcion y la misma me va a devolver lo que seria el proyecto.
    }
}


export const authorization = (roles) => {
    return async (req, res, next) => {
        if (!req.user) {
            return res.status(401).send({ error: 'unathorized user: No existe sesion activa' })
        }
        const userRole = req.user.user.rol;

        if (!roles.includes(userRole)) {
            return res.status(401).send({ error: 'No tienes permisos para realizar esta acción', user: req.user });
        }

        next();
    };
}
