"use strict";

class GCDS {

	constructor({Datastore}, {GCLOUD_PROJECT_ID, KEY_FILENAME, NODE_ENV = "development"}){
		this.datastore = Datastore({projectId: GCLOUD_PROJECT_ID, keyFilename: KEY_FILENAME});
		this.namespace = NODE_ENV;
	}

	getIncompleteKey (kind) {
		const path = Array.isArray(kind) ? kind : [kind];
		return this.getKey(path);
	}

	getKey (path) {
		return this.datastore.key({namespace: this.namespace, path});
	}

	getCompleteKey (entityName, id) {
		return this.getKey([entityName, parseInt(id)]);
	}

	allocateIds(incompleteKey, n) {
		return this.datastore.allocateIds(incompleteKey, n).then(([keys]) => keys);
	}

	save(entity){
		return this.datastore.save(entity);
	}

	get(key){
		return this.datastore.get(key).then(result => Array.isArray(key) ? result : result[0]);
	}

	delete(key){
		return this.datastore.delete(key);
	}

	query(kind) {
		return this.datastore.createQuery(this.namespace, kind);
	}

}

module.exports = GCDS;