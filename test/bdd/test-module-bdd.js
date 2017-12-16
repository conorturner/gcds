"use strict";

const {
	GCLOUD_PROJECT_ID = "blog-agency",
	KEY_FILENAME = __dirname + "/../../keyfile.json",
	NODE_ENV = "testing"

} = process.env;

const {expect} = require("chai");

const {GCDS, EntityFactory} = require("../../index");
const Datastore = require("@google-cloud/datastore");

const gcds = new GCDS({Datastore}, {GCLOUD_PROJECT_ID, KEY_FILENAME, NODE_ENV});

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

const Entity = EntityFactory({gcds}, {kind: "Person", schema: personSchema});

class Person extends Entity {
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

		const person = new Person({data});

		Person.save(person)
			.then(result => {
				console.log(JSON.stringify(result));

				person_id = result.key.id;

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

		const person = new Person({key, data});

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


});