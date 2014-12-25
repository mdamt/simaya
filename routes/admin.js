module.exports = function(app) {
  var utils = require('../sinergis/controller/utils.js')(app)
    , admin = require('../sinergis/controller/admin.js')(app)
    , adminSimaya = require('../simaya/controller/admin.js')(app)
    , announcement = require('../simaya/controller/announcement.js')(app)

  app.all('/admin*', utils.requireAdmin);
  app.get('/admin', utils.requireLogin, admin.index);
  app.get('/admin/user', utils.requireLogin, adminSimaya.user);
  app.get('/admin/admin', utils.requireLogin, adminSimaya.admin);
  app.get('/admin/admin-structure', utils.requireLogin, adminSimaya.adminStructure);
  app.get('/admin/admin-in-org', utils.requireLogin, adminSimaya.adminListInOrgJSON);
  app.get('/admin/role', utils.requireLogin, admin.role);
  app.get('/admin/new-role', utils.requireLogin, admin.newRole);
  app.post('/admin/new-role', utils.requireLogin, admin.newRole);

  app.get('/admin/edit-role/:id', utils.requireLogin, admin.editRole);
  app.get('/admin/edit-role', utils.requireLogin, admin.role);
  app.post('/admin/edit-role', utils.requireLogin, admin.editRole);


  app.get('/admin/user-category', utils.requireLogin, adminSimaya.userCategory);
  app.get('/admin/new-user-category', utils.requireLogin, adminSimaya.newUserCategory);
  app.post('/admin/new-user-category', utils.requireLogin, adminSimaya.newUserCategory);
  app.get('/admin/edit-user-category/:id', utils.requireLogin, adminSimaya.editUserCategory);
  app.post('/admin/edit-user-category', utils.requireLogin, adminSimaya.editUserCategory);

  app.get('/admin/new-user', utils.requireLogin, adminSimaya.newUser);
  app.post('/admin/new-user', utils.requireLogin, adminSimaya.newUser);

  app.get('/admin/edit-user/:id', utils.requireLogin, adminSimaya.editUser);
  app.get('/admin/edit-user', utils.requireLogin, admin.user);
  app.post('/admin/edit-user', utils.requireLogin, adminSimaya.editUser);
  app.get('/admin/user-in-org', utils.requireLogin, adminSimaya.userListInOrgJSON);
  app.post('/admin/head-in-org', utils.requireLogin, adminSimaya.headInOrgJSON);
  app.del('/admin/head-in-org', utils.requireLogin, adminSimaya.removeHeadInOrg);

  app.post('/admin/remove-users', utils.requireLogin, admin.removeUsers);

  app.get('/admin/change-password/:id', utils.requireLogin, admin.changePassword);
  app.get('/admin/change-password', utils.requireLogin, admin.user);
  app.post('/admin/change-password', utils.requireLogin, admin.changePassword);

  app.get('/admin/email-list/:id', utils.requireLogin, admin.emailList);
  app.get('/admin/email-list', utils.requireLogin, admin.user);
  app.post('/admin/email-list', utils.requireLogin, admin.emailList);

  app.get('/admin/associate-role/:id', utils.requireLogin, admin.associateRole);
  app.get('/admin/associate-role', utils.requireLogin, admin.user);
  app.post('/admin/associate-role', utils.requireLogin, admin.associateRole);

  app.get('/admin/disk-status', utils.requireLogin, adminSimaya.diskStatus);

  app.get('/admin/phones/:id', admin.phones);
  app.post('/admin/phones/:id', admin.phones);
  app.all('/admin/announcement', utils.requireLogin, announcement.showAndUpdate);

  app.all('/admin/audit', utils.requireLogin, adminSimaya.auditList);
  app.get('/admin/audit/:id', utils.requireLogin, adminSimaya.auditDetail);
  app.get('/admin/nodes', utils.requireLogin, adminSimaya.getNodes);
  app.get('/admin/nodes/requests', utils.requireLogin, adminSimaya.getNodeRequests);
  app.post('/l/nodes', adminSimaya.createNode);

  // simaya-l local admin
  app.get('/admin/nodes', utils.requireLogin, adminSimaya.getNodes);
  app.post('/admin/nodes/:id', utils.requireLogin, adminSimaya.putNodeJSON);
  app.get('/admin/nodes/:id/cert', utils.requireLogin, adminSimaya.getNodeCert);
  app.del('/admin/nodes/:id', utils.requireLogin, adminSimaya.removeNodeJSON);
  app.get("/admin/nodes/:id/check", adminSimaya.checkLocalNode);
  app.get("/admin/nodes/:id/syncCheck", adminSimaya.checkSync);
  app.get("/admin/nodes/:id/sync", adminSimaya.syncLocalNode);
  app.get('/admin/node/requests', utils.requireLogin, adminSimaya.getNodeRequests);
  app.post('/admin/node/requests', utils.requireLogin, adminSimaya.putNodeRequests);
}
