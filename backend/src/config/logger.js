import { createLogger, format, transports } from 'winston';

const customLevels = {
    levels: {
        fatal: 0,  
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        verbose: 5,
        debug: 6,
        silly: 7
    },
    colors: {
        fatal: 'red',
        error: 'red',
        warning: 'yellow',
        info: 'green',
        http: 'magenta',
        verbose: 'cyan',
        debug: 'blue',
        silly: 'white',
    }
};

// Configurar los niveles de registro personalizados



export const logger = createLogger({
    levels: customLevels.levels, // Usar los niveles personalizados
    format: format.combine(
        format.simple(),
        format.colorize({ colors: customLevels.colors }),
        format.timestamp(),
        format.printf(info => `[${info.timestamp}] ${info.level} ${info.message}`)
    ),

    transports: [
        new transports.File({
            filename: './errors.log',
            level: 'fatal' 
        }),
        new transports.File({
            filename: './errors.log',
            level: 'error',
        }),
        new transports.File({
            filename: './logger.log',
            level: 'warning',
        }),
        new transports.File({
            filename: './logger.log',
            level: 'info',
        }),
        new transports.Console({
            level: 'debug'
        })
    ]

});




// Agregar métodos para cada nivel de registro
logger.fatal = (message) => { logger.log('fatal', message); };
logger.error = (message) => { logger.log('error', message); };
logger.warning = (message) => { logger.log('warning', message); };
logger.info = (message) => { logger.log('info', message); };




export default logger;





// import winston from 'winston';
// import 'dotenv/config';

// let customLevelOpt;

// if (process.env.MODO == 'DEVELOPMENT') {
//     customLevelOpt = {
//         levels: {
//             fatal: 0,
//             error: 1,
//             warning: 2,
//             info: 3,
//             debug: 4
//         },
//         colors: {
//             fatal: 'red',
//             error: 'cyan',
//             warning: 'yellow',
//             info: 'blue',
//             debug: 'grey'
//         }
//     }
// } else {
//     customLevelOpt = {
//         levels: {
//             fatal: 0,
//             error: 1,
//             warning: 2,
//             info: 3
//         },
//         colors: {
//             fatal: 'red',
//             error: 'cyan',
//             warning: 'yellow',
//             info: 'blue'
//         }
//     }
// }

//     //podemos generar el guardado implementando cada uno de ellos y guardarlos de forma independiente.
//     const transports = [
//         new winston.transports.File({
//             filename: './errors.log',
//             level: 'fatal',
//             format: winston.format.combine(
//                 winston.format.simple()
//             )
//         }),
//         new winston.transports.File({
//             filename: './errors.log',
//             level: 'error',
//             format: winston.format.combine(
//                 winston.format.simple()
//             )
//         }),
//         new winston.transports.File({
//             filename: './logger.log',
//             level: 'warning',
//             format: winston.format.combine(
//                 winston.format.simple()
//             )
//         }),
//         new winston.transports.File({
//             filename: './logger.log',
//             level: 'info',
//             format: winston.format.combine(
//                 winston.format.simple()
//             )
//         }),
//         new winston.transports.Console({
//             level: 'debug',
//             format: winston.format.combine(
//                 winston.format.colorize({ colors: customLevelOpt.colors }),
//                 winston.format.simple()
//             )
//         })
//     ];

//     //creacion de los loggers de winston, en base al objeto ya creado
// const logger = winston.createLogger({
//     levels: customLevelOpt.levels,
//     transports
// });

// export const addLogger = (req, res, next) => {
//     if (!req.logger) {
//         req.logger = logger;
//         //aqui devuelvo quien hizo la peticion
//         if (process.env.MODO == "DEVELOPMENT") {
//             req.logger.debug(`${req.method} es ${req.url} - ${new Date().toLocaleDateString()}`);
//         }
//     }
//     next();
// }

