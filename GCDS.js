"use strict";

class GCDS {

	constructor({Datastore}, {GCLOUD_PROJECT_ID, KEY_FILENAME, NODE_ENV = "development"}){
		this.datastore = Datastore({projectId: GCLOUD_PROJECT_ID, keyFilename: KEY_FILENAME});
		this.namespace = NODE_ENV;
	}

}

module.exports = GCDS;