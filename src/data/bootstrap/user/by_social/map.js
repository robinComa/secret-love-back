function(doc) {
  doc.socials.forEach(function(social){
    emit([social.id, social.type], doc);
  });
}
