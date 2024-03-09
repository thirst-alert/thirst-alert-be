const { MongoMemoryReplSet } = require('mongodb-memory-server')
const sinon = require('sinon')

module.exports = async function (_globalConfig, _projectConfig) {
	await MongoMemoryReplSet.create({
		instanceOpts: [
			{
				port: 27018
			}
		],
		replSet: {
			count: 1,
			name: 'rs0',
			dbName: 'dev',
			storageEngine: 'wiredTiger'
		}
	})
		.then((mongod) => {
			global.mongod = mongod
			process.env['MONGO_URI'] = mongod.getUri()
			const config = require('../config')
			sinon.stub(config, 'mailer').value({
				sendMail: sinon.stub()
			}) // stubbed config cached, can now start app
			const { app, httpServer, dbConnection } = require('../index')
			global.app = app
			global.httpServer = httpServer
			return dbConnection
		})
		.then((dbConnection) => {
			global.dbConnection = dbConnection
		})
}