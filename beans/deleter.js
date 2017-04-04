/*
 * GET / POST deleter
 * Il s'agit ici d'un Bean générique qui en fonction des données dans
 * l'annuaire otf json est capable de faire un insert et d'insérer un
 * ou des objets json dans le model passé dans l'annuaire.
 */
var logger = require('log4js').getLogger('deleter');
logger.setLevel(GLOBAL.config["LOGS"].level);
var mongoose = require('mongoose');
var genericModel = require('../otf_core/lib/otf_mongooseGeneric');

/*
 * SET users datas into MongoDB.
 */

exports.deleter = {
    //beans.params, beans.path, beans.data_model, beans.schema, beans.room
    oneById: function (req, cb) {
        // CONTROLER
        var _controler = req.session.controler;
        //@TODO not safety
        logger.debug('room   : ', _controler.room);
        logger.debug('model  : ' + _controler.data_model);
        logger.debug('params  : ', _controler.params);
        //-- Accounts Model
        //var modele = mongoose.model(model);
        // Test Emit WebSocket Event
        logger.debug(" Deleted One User emmit call");
        sio.sockets.in(_controler.room).emit('user', {room: _controler.room, comment: ' One User\n\t Your Filter is :'});
        try {
            var model = GLOBAL.schemas[_controler.data_model];
            model.deleteDocument({_id: _controler.params._id}, function (err, nb_deleted) {
                logger.debug('delete row :', nb_deleted);
                return cb(null, {data: nb_deleted, room: _controler.room});
            });
        } catch (err) { // si existe pas alors exception et on l'intègre via mongooseGeneric
            logger.error(err);
        }
    },

        delete_modification: function (req, cb) {
        // CONTROLER
        var _controler = req.session.controler;
        //@TODO not safety
        logger.debug('room   : ', _controler.room);
        logger.debug('model  : ' + _controler.data_model);
        logger.debug('params  : ', _controler.params);
        //-- Accounts Model
        //var modele = mongoose.model(model);
        // Test Emit WebSocket Event
        logger.debug(" Deleted One User emmit call");
        sio.sockets.in(_controler.room).emit('user', {room: _controler.room, comment: ' One User\n\t Your Filter is :'});
        try {
            var model = GLOBAL.schemas[_controler.data_model];
            model.deleteModification({_id: _controler.params.modif_a_effacer}, function (err, nb_deleted) {
                logger.debug('delete row :', nb_deleted);
                return cb(null, {data: nb_deleted, room: _controler.room});
            });
        } catch (err) { // si existe pas alors exception et on l'intègre via mongooseGeneric
            logger.error(err);
        }
    },

    delete_composant: function (req, cb) {
        // CONTROLER
        var _controler = req.session.controler;
        //@TODO not safety
        logger.debug('room   : ', _controler.room);
        logger.debug('model  : ' + _controler.data_model);
        logger.debug('params  : ', _controler.params);
        //-- Accounts Model
        //var modele = mongoose.model(model);
        // Test Emit WebSocket Event
        logger.debug(" Deleted One User emmit call");
        sio.sockets.in(_controler.room).emit('user', {room: _controler.room, comment: ' One User\n\t Your Filter is :'});
        try {
            var model = GLOBAL.schemas[_controler.data_model];
            model.deleteComposant({_id: _controler.params._id}, function (err, nb_deleted) {
                logger.debug('delete row :', nb_deleted);
                return cb(null, {data: nb_deleted, room: _controler.room});
            });
        } catch (err) { // si existe pas alors exception et on l'intègre via mongooseGeneric
            logger.error(err);
        }
    },


    
    prets_rendus_total: function (req, cb) {
        // Input security Controle
        if (typeof req.session === 'undefined' || typeof req.session.controler === 'undefined') {
            error = new Error('req.session undefined');
            return cb(error);
        }
        var _controler = req.session.controler;
        var state;
        if (typeof req.session == 'undefined' || typeof req.session.login_info === 'undefined' || typeof req.session.login_info.state === 'undefined')
            state = "TEST";
        else
            state = req.session.login_info.state
        //
        //
        logger.debug(" Finder.populate call");
        sio.sockets.in(_controler.room).emit('user', {room: _controler.room, comment: ' List of Users\n\t Your Filter is : *'});
        try {
            var model = GLOBAL.schemas[_controler.data_model];
            var _params = { query: _controler.params, ref: _controler.data_ref};
            model.suppression_pretes(_params, function (err, list) {
                logger.debug('Populate Result  :', list);
                logger.debug('req.session : ' , req.session );
                list.str = JSON.stringify(list);
                return cb(null, {result: list}); //, user:req.session.login_info.user, "state": state, room: _controler.room});
            });
        } catch (err) { // si existe pas alors exception et on l'intègre via mongooseGeneric
            logger.error(err);
        }
    },
    
    // suprime un document, et modifie tout ceux qui le référencé, il référenceront un document appeler "Default" 
    // data_model = [model a suprimet, model a modifier 1, model a modifier 2, ...]
    // data_ref = [clé contenant la valeur "Default"(souvant le nom), clé 1 contenan le lien verl le model a suprimet,
    //             clé 2 contenan le lien verl le model a suprimet ...]
    oneAndSetToDefaultReference: function(req, cb){
	// CONTROLER
        var _controler = req.session.controler;
        //@TODO not safety
        logger.debug('room   : ', _controler.room);
        logger.debug('model  : ' + _controler.data_model);
        logger.debug('params  : ', _controler.params);
	logger.debug('ref  : ', _controler.data_ref);
        //-- Accounts Model
        //var modele = mongoose.model(model);
        // Test Emit WebSocket Event
        logger.debug(" Deleted One Categorie emmit call");
        sio.sockets.in(_controler.room).emit('user', {room: _controler.room, comment: ' One User\n\t Your Filter is :'});
        try {
            var modeld = GLOBAL.schemas[_controler.data_model[0]];
            modeld.deleteDocument({_id: _controler.params._id}, function (err, nb_deleted) {
                logger.debug('delete row :', nb_deleted);
            });
        } catch (err) { // si existe pas alors exception et on l'intègre via mongooseGeneric
            logger.error(err);
        }
	try {
	    var cond = {};
	    cond[_controler.data_ref[0]] = "Default";
	    modeld.getDocument(cond, function (err, one_default) {
		logger.debug('Default document :', one_default);
		var modelu, condition, value;
		for(var i=1; i<_controler.data_model.length; i++){
		    modelu = GLOBAL.schemas[_controler.data_model[i]];
		    condition = {};
		    value = {};
		    condition[_controler.data_ref[i]] = _controler.params._id;
		    value[_controler.data_ref[i]] = one_default._id;
		    try {
			modelu.updateDocuments(condition, value, function (err, numberAffected) {
			    if (err) {
				logger.info('----> error : ' + err);
			    } else {
				logger.debug('modification id référence : ', numberAffected);
				return cb(null, {data: numberAffected, room: _controler.room});
			    }
			});
		    } catch (errc) { // si existe pas alors exception et on l'intègre via mongooseGeneric
			logger.debug('----> error catch : ' + errc);
			return cb(err);
		    }
		}
	    });
	    
	} catch (err) { // si existe pas alors exception et on l'intègre via mongooseGeneric
	    logger.error(err);
	}
    },

    delCategories : function(req, cb){
	var _controler = req.session.controler;
        //@TODO not safety
        logger.debug('room   : ', _controler.room);
        logger.debug('model  : ' + _controler.data_model);
        logger.debug('params  : ', _controler.params);
	logger.debug('ref  : ', _controler.data_ref);
        //-- Accounts Model
        //var modele = mongoose.model(model);
        // Test Emit WebSocket Event
        logger.debug(" Deleted One Categorie emmit call");
        sio.sockets.in(_controler.room).emit('user', {room: _controler.room, comment: ' One User\n\t Your Filter is :'});
	// Delete categorie
	try {
            var model_categories = GLOBAL.schemas["Categories"];
            model_categories.deleteDocument({_id: _controler.params._id}, function (err, nb_deleted) {
                logger.debug('delete row Categorie :', nb_deleted);
            });
        } catch (err) { // si existe pas alors exception et on l'intègre via mongooseGeneric
            logger.error(err);
        }
	// Delete sous_categorie Default
	try {
	    var model_sous_categories = GLOBAL.schemas["Sous_categories"];
	    model_sous_categories.deleteDocument({id_categorie: _controler.params._id, nom_sous_categorie: "Default"}, function (err, nb_deleted) {
                logger.debug('delete row Sous_Categories Default :', nb_deleted);
            });
	    
	} catch (err) { // si existe pas alors exception et on l'intègre via mongooseGeneric
            logger.error(err);
        }
	// Change reference of other cathégories
	try {
	    model_categories.getDocument({nom_categorie: "Default"}, function (err, one_default) {
		logger.debug('Default document :', one_default);
		model_sous_categories.updateDocuments({id_categorie: _controler.params._id}, {id_categorie: one_default._id}, function (err, numberAffected) {
		    if (err) {
			logger.info('----> error : ' + err);
		    } else {
			logger.debug('modification id référence Sous_Categorie : ', numberAffected);
			return cb(null, {data: numberAffected, room: _controler.room});
		    }
		});
	    });
	    
	} catch (err) { // si existe pas alors exception et on l'intègre via mongooseGeneric
	    logger.error(err);
	}
    },
    
    delConversation : function(req, cb) {
	 var _controler = req.session.controler;
        logger.debug('room   : ', _controler.room);
        logger.debug('params  : ', _controler.params);
        logger.debug(" Deleted One Conv emmit call");
        sio.sockets.in(_controler.room).emit('user', {room: _controler.room, comment: ' One User\n\t Your Filter is :'});
        try {
            var modelconv = GLOBAL.schemas["Conversations"];
            modelconv.deleteDocument({_id: _controler.params._id}, function (err, nb_deleted) {
                logger.debug('delete row :', nb_deleted);
		try {
		    var modelcomm = GLOBAL.schemas["Commentaires"];
		    modelcomm.deleteDocument({id_conversation: _controler.params._id}, function (err, nb_deleted) {
			logger.debug('delete row :', nb_deleted);
			return cb(null, {data: nb_deleted, room: _controler.room});
		    });
		} catch (err) { // si existe pas alors exception et on l'intègre via mongooseGeneric
		    logger.error(err);
		}
            });
        } catch (err) { // si existe pas alors exception et on l'intègre via mongooseGeneric
            logger.error(err);
        }
    },

    list: function (req, cb) {
        // ici params est un tableau d'objet à insérer
        /* TODO écrire l'insertion générique d'une liste d'objets avec mongoDB, via mongoose. */

    }
};
