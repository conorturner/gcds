const {
	GCLOUD_PROJECT_ID = "blog-agency",
	KEY_FILENAME =  __dirname + "/../keyfile.json",
	NODE_ENV = "development"

} = process.env;

const {expect} = require("chai");
const Datastore = require("@google-cloud/datastore");

const GCDS = require("../GCDS");

describe("GCDS TDD", () => {

	it("constructor", (done) => {
		const gcds = new GCDS({Datastore}, {GCLOUD_PROJECT_ID, KEY_FILENAME, NODE_ENV});
		expect(gcds).to.have.property("datastore");
		expect(gcds.namespace).to.equal(NODE_ENV);
		done();
	});

});