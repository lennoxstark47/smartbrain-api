const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt-nodejs');
const Clarifai = require('clarifai');
const app = express();
app.use(cors());
app.use(bodyParser.json());
const knex = require('knex');
const faceApp = new Clarifai.App({
	apiKey: 'c14191b446b14919afd059c9a0666edf',
});

const db = knex({
	client: 'pg',
	connection: {
		host: '127.0.0.1',
		user: 'stark47',
		password: '',
		database: 'smartbrain',
	},
});

app.get('/', (req, res) => {
	res.json(database.users);
});
app.post('/signin', (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return res
			.status(400)
			.json('Incorrect Form Submission');
	}
	db.select('hash', 'email')
		.from('login')
		.where('email', '=', req.body.email)
		.then((data) => {
			const isValid = bcrypt.compareSync(
				req.body.password,
				data[0].hash
			);
			if (isValid) {
				return db
					.select('*')
					.from('users')
					.where('email', '=', req.body.email)
					.then((user) => {
						res.json(user[0]);
					})
					.catch((err) => {
						res
							.status(400)
							.json('Unable to get user');
					});
			} else {
				res.status(400).json('wrong credentials');
			}
		})
		.catch((err) => {
			res.status(400).json('wrong credentials');
		});
});

app.post('/register', (req, res) => {
	const { name, email, password } = req.body;
	if (!name || !email || !password) {
		return res
			.status(400)
			.json('Incorrect Form Submission');
	}
	const hash = bcrypt.hashSync(password);
	db.transaction((trx) => {
		trx
			.insert({
				hash: hash,
				email: email,
			})
			.into('login')
			.returning('email')
			.then((loginEmail) => {
				return trx('users')
					.returning('*')
					.insert({
						name: name,
						email: loginEmail[0],
						joined: new Date(),
					})
					.then((user) => {
						res.json(user[0]);
					});
			})
			.then(trx.commit)
			.catch(trx.rollback);
	}).catch((err) =>
		res.status(400).json('Email already exists')
	);
});

app.get('/profile/:id', (req, res) => {
	const { id } = req.params;
	db.select('*')
		.from('users')
		.where({ id: id })
		.then((user) => {
			if (user.length) {
				res.json(user[0]);
			} else {
				res.status(400).json('Not Found');
			}
		})
		.catch((err) =>
			res.status(400).json('Error getting user')
		);
});

app.post('/imageurl', (req, res) => {
	faceApp.models
		.predict(
			Clarifai.FACE_DETECT_MODEL,
			req.body.input
		)
		.then((data) => res.json(data))
		.catch(console.log);
});

app.put('/image', (req, res) => {
	// let found = false;

	const { id } = req.body;
	db('users')
		.where('id', '=', id)
		.increment('entries', 1)
		.returning('entries')
		.then((entries) => {
			res.json(entries[0]);
		})
		.catch((err) =>
			res.status(400).json('there is an error')
		);
	// database.users.forEach((user) => {
	// 	if (user.id === id) {
	// 		found = true;
	// 		user.entries++;
	// 		return res.json(user.entries);
	// 	}
	// });
	// if (!found) {
	// 	res.status(400).json('user not found');
	// }
});

app.listen(3001, () => {
	console.log('App is running');
});
