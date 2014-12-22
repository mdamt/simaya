// This script migrates profile.nip to profile.id and initiates a doc in userCategory

var settings = require('../settings.js')

var app = {
  db: function(modelName) {
    return settings.model(settings.db, modelName);
  }
  , ObjectID: settings.ObjectID
  , validator: settings.validator
}
var db = app.db("user")
var spinner = ["/", "-", "|", "\\"];

var saved = 0;
var cat;
var initiateUserCategory = function(cb){
  var category = app.db("userCategory");
  category.drop(function(){
    category.getCollection(function (error, collection) {
      var data = {
        categoryName:"PNS",
        categoryDesc:"Pegawai Negeri Sipil",
        categoryId:"NIP",
        idLength:"18"
      }
      data._id = collection.pkFactory.createPk();
      cat = data._id;
      category.insert(data, function(){
        cb();
      });
    });
  });
}
var mod = function(index, data) {
  if (index == data.length) {
    console.log("Saved: ", saved, "of total", data.length);
    process.exit();
    return;
  }
  db.findOne({_id: data[index]._id}, function(e, item) {
    process.stdout.write(spinner[(index % 4)] + " -> " + index + "/" + data.length + "\r");
    var save = false;
    if (item.profile.nip) {
      item.profile.id = item.profile.nip;
      item.profile.category = cat;
      delete item.profile.nip;
      save = true;
    } 
    if (save) {
      saved ++;
      db.save(item, function() {
        mod(index + 1, data);
      });
    } else {
      mod(index + 1, data);
    }
  });
}

console.log("Standing by...");
settings.db.open(function(){
  initiateUserCategory(function(){
    db.findArray({}, {_id:1,date:1}, function(e, c) {
      mod(0, c);
    })
  });

});
