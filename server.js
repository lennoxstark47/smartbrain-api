const express = require('express');

const app = express();

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
	],
};
app.post('/signin', (req, res) => {
	res.json('signing in...');
});

app.listen(3000, () => {
	console.log('App is running');
});
