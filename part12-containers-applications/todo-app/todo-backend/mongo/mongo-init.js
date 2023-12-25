db.createUser({
  user: 'admin',
  pwd: 'strongestPasswordPfft',
  roles: [
    {
      role: 'dbOwner',
      db: 'the_database',
    },
  ],
});

db.createCollection('todos');

db.todos.insert({text: 'create a user', done: true});
db.todos.insert({text: 'Code a mongo', done: true});
db.todos.insert({ text: 'Write code', done: true });
db.todos.insert({ text: 'Learn about containers', done: false });
