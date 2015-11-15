function(doc) {
  doc.secretBox.forEach(function(secret){
    emit([secret.friend.id, secret.friend.type], doc);
  });
}
