const {
	GCLOUD_PROJECT_ID = "blog-agency",
	KEY_FILENAME =  __dirname + "/../keyfile.json",
	NODE_ENV = "development"

} = process.env;

const {expect} = require("chai");
const Datastore = require("@google-cloud/datastore");

const {GCDS} = require("../../index");

describe("GCDS TDD", () => {

	it("constructor", (done) => {
		const gcds = new GCDS({Datastore}, {GCLOUD_PROJECT_ID, KEY_FILENAME, NODE_ENV});
		expect(gcds).to.have.property("datastore");
		expect(gcds.namespace).to.equal(NODE_ENV);
		done();
	});

	it("id", (done) => {
		const gcds = new GCDS({Datastore}, {GCLOUD_PROJECT_ID, KEY_FILENAME, NODE_ENV});

		const id = gcds.id("thing", 12345);

		console.log(id)

		done();
	});

	it("save", (done) => {
		const gcds = new GCDS({Datastore}, {GCLOUD_PROJECT_ID, KEY_FILENAME, NODE_ENV});

		const key = gcds.id("thing", 12345);

		const entity = {
			key: key,
			data: {
				name: 'DonutShack',
				rating: 8
			}
		};

		gcds.save(entity)
			.then(result => {
				console.log(result);
				done();
			})
			.catch(err => done(err));
	});

	it("get", (done) => {
		const gcds = new GCDS({Datastore}, {GCLOUD_PROJECT_ID, KEY_FILENAME, NODE_ENV});

		const key = gcds.id("thing", 12345);

		let promiseArray = [];

		for(let i = 0; i < 50; i++) promiseArray.push(gcds.get(key));

		Promise.all(promiseArray)
			.then(result => {
				console.log(result);
				done();
			})
			.catch(err => done(err));
	});

	it("query", (done) => {
		const gcds = new GCDS({Datastore}, {GCLOUD_PROJECT_ID, KEY_FILENAME, NODE_ENV});



		gcds.query("thing")
			.then(result => {
				console.log(result);
				done();
			})
			.catch(err => done(err));
	});

});