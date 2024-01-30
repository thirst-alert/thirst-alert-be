/* eslint no-undef: OFF */

db.auth(process.env.MONGO_INITDB_ROOT_USERNAME, process.env.MONGO_INITDB_ROOT_PASSWORD)

db.getSiblingDB(process.env.MONGO_INITDB_DATABASE)

db.user.insertMany([
	{
		username: 'Massi' ,
		email: 'massi@email.com',
		password: '12345678',
		role: 'admin',
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		username: 'Alsje' ,
		email: 'alsje@email.com',
		password: '12345678',
		role: 'admin',
		createdAt: new Date(),
		updatedAt: new Date(),
	}
])