module.exports = function(app) {
  var utils = require('./utils.js')(app)
  , admin = require('../../sinergis/controller/admin.js')(app)
  , user = require('../../sinergis/models/user.js')(app)
  , sinergisUtils = require('../../sinergis/controller/utils.js')(app)
  , adminSimaya = require('./admin.js')(app)
  , jobTitle = require('../models/jobTitle.js')(app)
  , org = require('../models/organization.js')(app)
  , moment = require('moment')
  , stat = require('./localadminstats')(app)
  , Node = require('../models/node.js')(app)


  var isValidOrganization = function(vals, req, res, callback) {

    username = req.params.id || req.body.username;

    user.list({search: {username: username}}, function(r) {
      if (r.length == 1) {
        if (r[0].profile &&
            r[0].profile.organization &&
            r[0].profile.organization.indexOf(req.session.currentUserProfile.organization) == 0) {
            callback();
        } else {
          admin.invalidAdmin(vals, req, res);
        }
      } else {
        admin.invalidAdmin(vals, req, res);
      }
    });
  }

  var userList = function(req, res, callback) {
    var vals = {
      localAdmin: true,
      username: req.session.currentUser
    };
    search = {
      'profile.organization': { $regex: '^' + req.session.currentUserProfile.organization }
    };

    adminSimaya.userBase(req, res, callback, vals, search);
  }

  var adminList = function(req, res, callback) {
    var vals = {
      localAdmin: true,
      isAdmin: true
    };
    search = {
      $or: [
        { 'profile.organization': { $regex: '^' + req.session.currentUserProfile.organization  + '$'}}
        , {'profile.organization': { $regex: '^' + req.session.currentUserProfile.organization  + ';'}}
      ]
    };
    if (req.query.search) {
      search.username = { $regex: req.query.search };
    }

    adminSimaya.adminBase(req, res, callback, vals, search);
  }


  var newUser = function(req, res) {
    var vals = {
      localAdmin: true,
      title: 'Buat pengguna baru',
      'profile.organization': req.session.currentUserProfile.organization, 
      myOrganization: req.session.currentUserProfile.organization, 
    };
    adminSimaya.newUserBase(req, res, {}, vals);
  }

  var editUser = function(req, res) {
    var vals = {
      localAdmin: true,
      title: 'Edit User',
      myOrganization: req.session.currentUserProfile.organization, 
    };

    isValidOrganization(vals, req, res, function() {
      adminSimaya.editUserBase(req, res, {}, vals);
    });
  }

  var changePassword = function(req, res, callback) {
    var vals = {
      localAdmin: true,
      title: 'Change Password',
      username: req.params.id || req.body.username
    };

    isValidOrganization(vals, req, res, function() {
      admin.changePasswordBase(req, res, callback, vals);
    });
  }

  var emailList = function(req, res, callback) {
    var vals = {
      localAdmin: true,
      username: req.params.id || req.body.username
    };

    admin.emailListBase(req, res, callback, vals);
  }

  var listTitle = function(req, res) {
    var vals = {
      title: 'Nama Jabatan', 
      localAdmin: true
    }
    var myOrganization = req.query.organization || req.session.currentUserProfile.organization;
      
    jobTitle.list({search: { organization: myOrganization }}, function(r) {
      vals.titleList = r;
      vals.organization = myOrganization;
      sinergisUtils.render(req, res, 'admin-job-title', vals, 'base-admin-authenticated');
    });
  }

  var removeTitle = function(req, res) {
    var myOrganization = req.body.organization || req.session.currentUserProfile.organization;
    if (req.body.path) {
      jobTitle.removeTitle(req.body.path, myOrganization, function(r) {
        res.send(JSON.stringify(r));
      });
    } else {
      res.send("ERROR");
    }

  }

  var editTitle = function(req, res) {
    var myOrganization = req.body.organization || req.session.currentUserProfile.organization;
    if (req.body.oldPath && req.body.path && req.body.name) {
      var data = {
        newTitle: req.body.name,
        organization: myOrganization,
        oldPath: req.body.oldPath,
        path: req.body.path
      }
      jobTitle.editTitle(data, function(r) {
        res.send(JSON.stringify(r));
      });
    } else {
      res.send("ERROR");
    }
  }

  var newTitle = function(req, res) {
    var myOrganization = req.body.organization || req.session.currentUserProfile.organization;
    if (req.body.name) {
      var path = req.body.name;
      if (req.body.path) {
        path = req.body.path + ';' + path;
      }
      var data = {
        title: req.body.name,
        organization: myOrganization,
        path: path, 
      }
      jobTitle.create(data, function(r) {
        res.send(JSON.stringify(r));
      });
    } else {
      res.send("ERROR");
    }
  }


  var associateRole = function(req, res) {
    var vals = {
      title: 'Associate role',
      username: req.params.id || req.body.username,
      localAdmin: true,
    }

    admin.associateRoleBase(req, res, null, vals);
  }

  var renderDashboard = function(req, res, vals) {
    sinergisUtils.render(req, res, 'localadmin-stat', vals, 'base-admin-authenticated');
  }

  var stats = function(req, res){
    stat.currentStat(req, res);
  }

  var index = function(req, res){
    var vals = {
      title: 'Administrator',
      requireAdmin: true,
      localadmin: true,
      dashboardType : 'local',
      mainStat : [
        { id: "stat-users", title : "Pengguna", val : "...", color : "red", icon : "user"},
        { id: "stat-users-online", title : "Online", val : "...", color : "green", icon : "user"},
        { id: "stat-organizations", title : "Instansi", val : "...", color : "lightblue", icon : "group"},
        { id: "stat-letters", title : "Surat", val : "...", color : "blue", icon : "envelope-alt"},
        { id: "stat-letters-today", title : "Hari Ini", val : "...", color : "blue", icon : "envelope"}
      ]
    }
    renderDashboard(req, res, vals)
  }

  var phones = function(req, res, callback) {
    var vals = {
      localAdmin: true,
      username: req.params.id || req.body.username
    };
    
    admin.phonesBase(req, res, callback, vals);
  }

  var getNodeRequestKey = function (req, res){
    Node.getRequestKey({administrator : req.session.currentUser}, function(err, key){
      var message = req.query.error;

      console.log (key);

      if (err) {
        message = err.message
      }

      sinergisUtils.render(req, res, 
        "localadmin-node-key", 
        {
          key : key,
          message : message
        }, 
        "base-admin-authenticated");
    });
  }

  var putNodeRequestKey = function (req, res){
    Node.requestKey({administrator : req.session.currentUser}, function(err, key){
      var message;
      
      if (err){
        message = err.message;
      }

      res.redirect("/localadmin/node/keys" + (err ? "?error=" + message : ""));
    });
  }

  var getNode = function (req, res) {
    Node.requests({ administrator : req.session.currentUser}, function(err, requests){
      
      var message = req.query.error;

      if (err) {
        message = err.message;
      }

      for (var i = 0; i < requests.length; i++){
        requests[i].isActive = requests[i].state == "connected";
        requests[i].date = moment(requests[i].date).fromNow();
      }

      Node.nodes({ administrator : req.session.currentUser}, function(err, nodes){
        
        if (err) {
          message = err.message;
        }

        for (var i = 0; i < nodes.length; i++){
          nodes[i].isActive = nodes[i].state == "connected";
          nodes[i].date = moment(nodes[i].date).fromNow();
        }

        sinergisUtils.render(req, res, 
        "localadmin-node", 
        {
          request : requests.length > 0,
          requests : requests, 
          nodes : nodes, 
          message : message
        }, 
        "base-admin-authenticated");

      });
    });
  }

  var putNode = function (req, res) {
    var self = this;
    var file = req.files.file;
    var body = req.body;

    var options = {
      file : file,
      name : body.name,
      administrator : req.session.currentUser
    }

    Node.request(options, function(err, requested){
      var message;
      
      if (err){
        message = err.message;
      }

      res.redirect("/localadmin/node" + (err ? "?error=" + message : ""));
    });
  }

  return {
    user: userList
    , admin: adminList
    , newUser: newUser
    , editUser: editUser
    , emailList: emailList 
    , changePassword: changePassword 
    , listTitle: listTitle
    , removeTitle: removeTitle
    , editTitle: editTitle
    , newTitle: newTitle
    , associateRole : associateRole
    , index : index
    , stats : stats
    , phones: phones
    , getNode : getNode
    , putNode : putNode
    , getNodeRequestKey : getNodeRequestKey
    , putNodeRequestKey : putNodeRequestKey
  }
};
