"use strict";

class GCDS {

	constructor({Datastore}, {GCLOUD_PROJECT_ID, KEY_FILENAME, NODE_ENV = "development"}){
		this.datastore = Datastore({projectId: GCLOUD_PROJECT_ID, keyFilename: KEY_FILENAME});
		this.namespace = NODE_ENV;
	}

	key (key) {
		const path = Array.isArray(key) ? key : [key];
		return this.datastore.key({namespace: this.namespace, path});
	}

	id (entityName, id) {
		return this.key([entityName, parseInt(id)]);
	}

	allocateIds(incompleteKey, n) {
		return this.datastore.allocateIds(incompleteKey, n).then(([keys]) => keys);
	}

	save(entity){
		return this.datastore.save(entity);
	}

	get(key){
		return this.datastore.get(key);
	}

	query(kind) {
		return this.datastore.createQuery(this.namespace, kind);
	}

}

module.exports = GCDS;