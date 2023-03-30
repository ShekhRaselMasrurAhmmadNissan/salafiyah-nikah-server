const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.DB_URI;
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	serverApi: ServerApiVersion.v1,
});

const run = async () => {
	try {
		const db = client.db('SalafiyahNikah');
		const UsersCollection = db.collection('Users');

		app.get('/user/:email', async (req, res) => {
			const query = { email: req.params.email };
			const result = await UsersCollection.findOne(query);
			return res.send(result);
		});

		app.put('/user', async (req, res) => {
			const data = req.body;
			console.log(data);
			const filter = { email: data.email };
			const options = {
				upsert: true,
				new: true,
				setDefaultsOnInsert: true,
			};
			const result = await UsersCollection.findOneAndUpdate(
				filter,
				{ $set: data },
				options
			);

			// const result = await UsersCollection.insertOne(data);

			return res.send(result);
		});
	} finally {
	}
};

app.get('/', async (req, res) => {
	res.send('The server is running successfully.');
});
run().catch((err) => console.log(err));

app.listen(port, () => {
	console.log(`The server is running at port ${port}`);
});
