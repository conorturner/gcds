"use strict";

const {
	GCLOUD_PROJECT_ID = "blog-agency",
	KEY_FILENAME = __dirname + "/../../keyfile.json",
	NODE_ENV = "testing"

} = process.env;

const { expect } = require("chai");

const { GCDS, EntityFactory } = require("../../index");
const Datastore = require("@google-cloud/datastore");

const gcds = new GCDS({ GCLOUD_PROJECT_ID, KEY_FILENAME, NODE_ENV }, { Datastore });

const personSchema = {
	"type": "object",
	"properties": {
		"name": {
			"type": "string",
			"required": true
		},
		"age": {
			"type": "number",
			"required": true
		}
	}
};

const PersonEntity = EntityFactory({ gcds }, { kind: "Person", schema: personSchema });

class Person extends PersonEntity {
	constructor(data) {
		super(data);
	}
}

describe("BDD - Module (CRUD)", () => {

	let person_id;
	it("Create", (done) => {

		const data = {
			"name": "Conor",
			"age": 21
		};

		const person = new Person({ data });

		Person.save(person)
			.then(result => {
				console.log(JSON.stringify(result));

				person_id = result.key.id;

				done();
			})
			.catch(err => done(err));

	});

	it("Create Many", (done) => {

		const data = {
			"name": "Conor",
			"age": 21
		};

		const person = new Person({ data });

		Person.saveMany(person)
			.then(result => {
				console.log(JSON.stringify(result, null, 2));
				done();
			})
			.catch(err => done(err));

	});

	it("Read", (done) => {


		const personKey = Person.getKey(person_id);

		Person.get(personKey)
			.then(person => {
				expect(person.name).to.equal("Conor");
				expect(person.age).to.equal(21);
				done();
			})
			.catch(err => done(err));

	});

	it("Update", (done) => {


		const key = Person.getKey(person_id);
		const data = {
			"name": "Conor New",
			"age": 21
		};

		const person = new Person({ key, data });

		Person.save(person)
			.then(() => {
				return Person.get(key)
					.then(result => {
						expect(result.name).to.equal(data.name);
						done();
					});
			})
			.catch(err => done(err));

	});

	it("Delete", (done) => {


		const key = Person.getKey(person_id);

		Person.delete(key)
			.then(() => {
				return Person.get(key)
					.then(result => {
						expect(result).to.equal(undefined);
						done();
					});
			})
			.catch(err => done(err));

	});

	it("Find All", (done) => {

		Person.find()
			.then(result => {
				console.log(result);
				done();
			})
			.catch(err => done(err));

	});

	it("Find All Stream", (done) => {

		Person.findStream()
			.on('error', done)
			.on('data', (entity) => {
				console.log(entity)
			})
			.on('info', console.log)
			.on('end', done);

	});

	it("Find with key", (done) => {


		const query = {
			name: "Conor"
		};

		Person.find(query)
			.then(result => {
				console.log(result);
				done();
			})
			.catch(err => done(err));

	});


});