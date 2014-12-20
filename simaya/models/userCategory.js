module.exports = function(app) {
  var db = app.db('userCategory');

  db.validate = function(document, update, callback) {
    var validator = app.validator(document, update);
    
    validator.validateRegex({
      idLength: [/^[0-9]{1,10}$/, 'Invalid Id Length'],
    });
    
    if (validator.isInserting()) {
      validator.validateQuery({
        categoryName: [db, {categoryName: update.categoryName}, false, 'There is already a category with this name']
      }, function () {
        callback(null, validator);
      });
    } else {
      callback(null, validator);
    }
  }

  return {
    insert: function (data, callback) {
      db.getCollection(function (error, collection) {
        data._id = collection.pkFactory.createPk();
        db.validateAndInsert(data, function (error, validator) {
          callback(validator);
        }); 
      });
    },

    edit: function(oldCategoryName, data, callback) {
      db.findOne({categoryName: oldCategoryName}, function(err, item) {
        if (err == null && item != null) {
          db.validateAndUpdate({
            _id: item._id
          }, {
            '$set': data
          }, function(err, validator) {
            callback(validator);
          });
        } else {
          var doc = data; 
          var validator = app.validator(doc, doc);
          validator.addError('categoryName', 'Non-existant category');
          callback(validator);
        }
      });
    },

    remove: function (categoryName, callback) {
      db.remove({categoryName : categoryName}, function(error){
        callback(error == null);
      });
    },
    
    list: function (callback) {
      var search = {};
      if (arguments.length == 2) {
        search = arguments[0];
        callback = arguments[1];
      }
      db.findArray(search, function(error, result) {
        callback(result);
      });
    },
  }
}
