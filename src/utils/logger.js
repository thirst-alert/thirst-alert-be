const pino = require('pino')

module.exports = pino({
	enabled: process.env.NODE_ENV !== 'test',
	transport: {
		target: 'pino-pretty',
		options: {
			colorize: true,
			translateTime: 'SYS:dd-mm-yyyy HH:MM:ss',
			ignore: 'pid,hostname'
		}
	}
})