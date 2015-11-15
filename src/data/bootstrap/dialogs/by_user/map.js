function (doc) {
  var who = [doc.who.id, doc.to.id].sort();
  emit(who, {
    who: doc.who.id,
    when: doc.when,
    what: doc.what
  });
}
