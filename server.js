const express = require('express');
const BodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const app = express();
const cors = require('cors');
app.use(BodyParser.json());
app.use(cors());
// app.use(BodyParser.urlencoded());
// app.use(express.json());
// app.use(
// 	express.urlencoded({
// 		extended: true,
// 	})
// );
const database = {
	users: [
		{
			id: '123',
			name: 'john',
			email: 'john@gmail.com',
			password: '123456',
			entries: 0,
			joined: new Date(),
		},
		{
			id: '124',
			name: 'sally',
			email: 'sally@gmail.com',
			password: '654321',
			entries: 0,
			joined: new Date(),
		},
	],
	login: [
		{
			id: '987',
			hash: '',
			email: 'john@gmail.com',
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
	// bcrypt.hash(
	// 	password,
	// 	null,
	// 	null,
	// 	function (err, hash) {
	// 		console.log(hash);
	// 	}
	// );
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

app.get('/profile/:id', (req, res) => {
	const { id } = req.params;
	let found = false;
	database.users.forEach((user) => {
		if (user.id === id) {
			found = true;
			return res.json(user);
		}
	});
	if (!found) {
		res.status(400).json('not found');
	}
});
app.post('/image', (req, res) => {
	const { id } = req.body;
	let found = false;
	database.users.forEach((user) => {
		if (user.id === id) {
			found = true;
			user.entries++;
			return res.json(user.entries);
		}
	});
	if (!found) {
		res.status(400).json('not found');
	}
});

app.listen(3001, () => {
	console.log('App is running');
});
