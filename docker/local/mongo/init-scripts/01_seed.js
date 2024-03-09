/* eslint no-undef: OFF */

db.auth(process.env.MONGO_INITDB_ROOT_USERNAME, process.env.MONGO_INITDB_ROOT_PASSWORD)

db.getSiblingDB(process.env.MONGO_INITDB_DATABASE)

// passwords are bcrypt hashes of usernames
db.user.insertMany([
	{
		username: 'Massi',
		password: '$2a$10$McZtdtXGQ4LAo.hopLtsnudAxSi1k8UZwMgDM7Tv/3xSGpXu0EQTS',
		email: 'massi@thirst-alert.com',
		active: true,
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		username: 'Alsje',
		password: '$2a$10$S2iym2rCli1ms1i4O/REnutBQA8DqXPi8.0AAEWe4rW.Z7nqLe.3q',
		email: 'alsje@thirst-alert.com',
		active: true,
		createdAt: new Date(),
		updatedAt: new Date(),
	},
	{
		username: 'Maya',
		password: '$2a$10$1A6BxjOnlutyJ5T01LvF0.JVBHefvpRRnKhqityNpjKXYIYdqw9C2',
		email: 'mayonnaise@thirst-alert.com',
		active: true,
		createdAt: new Date(),
		updatedAt: new Date(),
	},
])