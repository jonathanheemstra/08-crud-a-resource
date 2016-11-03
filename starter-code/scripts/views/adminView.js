var adminView = {
  render: function() {
    var template = Handlebars.compile($('#author-template').html());
    console.log('THIS IS template (line 4 - adminView.js)\n', template);
    Article.numWordsByAuthor().forEach(function(stat) {
      console.log('THIS IS stat (line 5 - adminView.js)\n', stat);
      $('.author-stats').append(template(stat));

      console.log('THIS IS stat (line 7 - adminView.js)\n', stat);

      console.log('THIS IS $(\'.author-stats\').append(template(stat)) (line 8 - adminView.js)\n', $('.author-stats').append(template(stat)));

    });

    $('#blog-stats .articles').text(Article.allArticles.length);
    $('#blog-stats .words').text(Article.numWordsAll());
  }
};

console.log('THIS IS Article.fetchAll(adminView.render) (line 12 - adminView.js)\n', Article.fetchAll(adminView.render));

Article.fetchAll(adminView.render);

console.log('THIS IS adminView (line 23 - adminView.js)\n', adminView);
