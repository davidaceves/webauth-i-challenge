exports.up = function(knex, Promise) {
  return knex.schema.hasTable("users").then(function(exists) {
    if (exists) {
      return knex.schema.table("users", function(tbl) {
        tbl.renameColumn("usersname", "username");
        tbl.unique("username");
      });
    }
  });
};
exports.down = function(knex, Promise) {
  return knex.schema.table("users", function(tbl) {
    tbl.renameColumn("username", "usersname");
    tbl.dropUnqiue("username");
  });
};
