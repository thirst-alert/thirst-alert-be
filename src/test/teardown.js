module.exports = async function (_globalConfig, _projectConfig) {
	global.httpServer.close()
	global.dbConnection.close()
	await global.mongod.stop()
}