const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt-nodejs');
const app = express();
app.use(cors());
app.use(bodyParser.json());
const knex = require('knex');

const db = knex({
	client: 'pg',
	connection: {
		host: '127.0.0.1',
		user: 'postgres',
		password: '4774',
		database: 'smartbrain',
	},
});

app.get('/', (req, res) => {
	res.json(database.users);
});
app.post('/signin', (req, res) => {
	db
		.select('hash', 'email')
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
						res.status(400).json('Unable to get user');
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
	const hash = bcrypt.hashSync(password);
	db
		.transaction((trx) => {
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
		})

		.catch((err) =>
			res.status(400).json('Email already exists')
		);
});

app.get('/profile/:id', (req, res) => {
	const { id } = req.params;
	db
		.select('*')
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
