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

db.user.find().forEach((user) => {
	db.sensor.insert({
		name: `${user.username}'s sensor`,
		owner: user._id,
		active: true,
		createdAt: new Date(),
		updatedAt: new Date(),
	})
})

db.sensor.find().forEach((sensor) => {
	db.measurement.insertMany([
		{
			moisture: 110,
			temperature: 25.5,
			createdAt: new Date(Date.now() - 1000 * 60 * 60 * 19),
			metadata: {
				sensorId: sensor._id,
			},
		},
		{
			moisture: 106,
			temperature: 25.9,
			createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18),
			metadata: {
				sensorId: sensor._id,
			},
		},
		{
			moisture: 102,
			temperature: 26.3,
			createdAt: new Date(Date.now() - 1000 * 60 * 60 * 17),
			metadata: {
				sensorId: sensor._id,
			},
		},
		{
			moisture: 98,
			temperature: 26.7,
			createdAt: new Date(Date.now() - 1000 * 60 * 60 * 16),
			metadata: {
				sensorId: sensor._id,
			},
		},
		{
			moisture: 94,
			temperature: 27.1,
			createdAt: new Date(Date.now() - 1000 * 60 * 60 * 15),
			metadata: {
				sensorId: sensor._id,
			},
		},
		{
			moisture: 90,
			temperature: 27.5,
			createdAt: new Date(Date.now() - 1000 * 60 * 60 * 14),
			metadata: {
				sensorId: sensor._id,
			},
		},
		{
			moisture: 86,
			temperature: 27.9,
			createdAt: new Date(Date.now() - 1000 * 60 * 60 * 13),
			metadata: {
				sensorId: sensor._id,
			},
		},
		{
			moisture: 82,
			temperature: 28.3,
			createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
			metadata: {
				sensorId: sensor._id,
			},
		},
		{
			moisture: 78,
			temperature: 28.7,
			createdAt: new Date(Date.now() - 1000 * 60 * 60 * 11),
			metadata: {
				sensorId: sensor._id,
			},
		},
		{
			moisture: 74,
			temperature: 29.1,
			createdAt: new Date(Date.now() - 1000 * 60 * 60 * 10),
			metadata: {
				sensorId: sensor._id,
			},
		},
		{
			moisture: 70,
			temperature: 29.5,
			createdAt: new Date(Date.now() - 1000 * 60 * 60 * 9),
			metadata: {
				sensorId: sensor._id,
			},
		},
		{
			moisture: 66,
			temperature: 29.9,
			createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8),
			metadata: {
				sensorId: sensor._id,
			},
		},
		{
			moisture: 62,
			temperature: 30.3,
			createdAt: new Date(Date.now() - 1000 * 60 * 60 * 7),
			metadata: {
				sensorId: sensor._id,
			},
		},
		{
			moisture: 58,
			temperature: 30.7,
			createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
			metadata: {
				sensorId: sensor._id,
			},
		},
		{
			moisture: 54,
			temperature: 31.1,
			createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
			metadata: {
				sensorId: sensor._id,
			},
		},
		{
			moisture: 50,
			temperature: 31.5,
			createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
			metadata: {
				sensorId: sensor._id,
			},
		},
		{
			moisture: 46,
			temperature: 31.9,
			createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
			metadata: {
				sensorId: sensor._id,
			},
		},
		{
			moisture: 42,
			temperature: 32.3,
			createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
			metadata: {
				sensorId: sensor._id,
			},
		},
		{
			moisture: 38,
			temperature: 32.7,
			createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1),
			metadata: {
				sensorId: sensor._id,
			},
		},
		{
			moisture: 34,
			temperature: 33.1,
			createdAt: new Date(Date.now() - 1000 * 60 * 60 * 0),
			metadata: {
				sensorId: sensor._id,
			},
		}
	])
})