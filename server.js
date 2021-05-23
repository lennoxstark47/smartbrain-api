const express = require('express');
const BodyParser = require('body-parser');
const app = express();
app.use(BodyParser.json());
const database = {
	users: [
		{
			id: 123,
			name: 'john',
			email: 'john@gmail.com',
			password: '123456',
			entries: 0,
			joined: new Date(),
		},
		{
			id: 124,
			name: 'sally',
			email: 'sally@gmail.com',
			password: '654321',
			entries: 0,
			joined: new Date(),
		},
	],
};
app.get('/', (req, res) => {
	res.json(database.users);
});
app.post('/signin', (req, res) => {
	if (
		req.body.email === database.users[0].email &&
		req.body.password ===
			database.users[0].password
	) {
		res.json('success');
	} else {
		res.status(400).json('error logging in');
	}
});

app.post('/register', (req, res) => {
	const { email, name, password } = req.body;
	database.users.push({
		id: 125,
		name: name,
		email: email,
		password: password,
		entries: 0,
		joined: new Date(),
	});
	res.json(
		database.users[database.users.length - 1]
	);
});

app.listen(3000, () => {
	console.log('App is running');
});
