
exports.up = function(knex) {
    return knex.schema
    .createTable('jokes', jokes => {
        jokes.string('id').unique()
        jokes.string('joke')
        jokes.integer('user_id')
            .references('id')
            .inTable('users')
            .onUpdate('CASCADE')
            .onDelete('CASCADE');
      });
};

exports.down = function(knex) {
    return knex.schema
    .dropTableIfExists('jokes')
};
