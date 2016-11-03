(function(module) {
  function Article (opts) {
    // DONE: Convert property assignment to Functional Programming style.
    console.log('THIS IS opts (line 4)\n', opts);
    Object.keys(opts).forEach(function(prop) {
      console.log('THIS IS prop (line 6)\n', prop);
      console.log('THIS IS this[prop] (line 7)\n', this[prop]);
      console.log('THIS IS opts[prop] (line 8)\n', opts[prop]);
      this[prop] = opts[prop];
    }, this); // The optional 'this' here is necessary to keep context.
  }

  Article.allArticles = [];

  Article.prototype.toHtml = function(scriptTemplateId) {
    var template = Handlebars.compile(scriptTemplateId.text());
    this.daysAgo = parseInt((new Date() - new Date(this.publishedOn))/60/60/24/1000);
    this.publishStatus = this.publishedOn ? 'published ' + this.daysAgo + ' days ago' : '(draft)';
    this.body = marked(this.body);
    return template(this);
  };

  // Set up a table for articles.
  Article.createTable = function() {
    // webDb helps us query our data
    webDB.execute(
      'CREATE TABLE IF NOT EXISTS articles (' +
      'id INTEGER PRIMARY KEY,' +
      'title VARCHAR,' +
      'category VARCHAR,' +
      'author VARCHAR,' +
      'author_url VARCHAR,' +
      'published_on DATE,' +
      'body VARCHAR);', // TODO: What SQL command do we run here inside these quotes? CREATE TABLE
      function() {
        console.log('Successfully set up the articles table.');
      }
    );
  };

  // NOTE: Refactored to expect articles from the database, rather than localStorage.
  Article.loadAll = function(rows) {
    Article.allArticles = rows.map(function(ele) {
      console.log('THIS IS ele (line 44)\n', ele);
      return new Article(ele);
    });
  };

  Article.prototype.insertRecord = function() {
    webDB.execute(
      [{
        // NOTE: this method will be called elsewhere after we retrieve our JSON
        'sql': 'INSERT INTO articles (title, category, author, author_url, published_on, body) VALUES (?, ?, ?, ?, ?, ?);', // <----- TODO: complete our SQL query here, inside the quotes.
        'data': [this.title, this.category, this.author, this.authorUrl, this.publishedOn, this.body]
      }]
    );
  };

  Article.fetchAll = function(nextFunction) {
    webDB.execute(
      'SELECT * FROM articles', // <-----TODO: fill these quotes to query our table.
      function(rows) {
        // if we have data in the table
        console.log('THIS IS rows (line 64)\n', rows);
        if (rows.length) {
        /* TODO:
           1 - Use Article.loadAll to instanitate these rows,
           2 - invoke the function that was passed in to fectchAll */
          console.log('THIS IS rows.length (line 69)\n', rows.length);
          console.log('THIS IS THE rows (line 68)\n', rows);
          Article.loadAll(rows);
          console.log('THIS IS THE nextFunction (line 70)\n', nextFunction);
          nextFunction();
        } else {
          $.getJSON('/data/hackerIpsum.json', function(responseData) {
            responseData.forEach(function(obj) {
              console.log('THIS IS obj (line 77)\n', obj);
              var article = new Article(obj); // This will instantiate an article instance based on each article object from our JSON.
              console.log('THIS IS article (line 79)\n', article);
              /* TODO:
               1 - 'insert' the newly-instantiated article in the DB:
             */
              article.insertRecord();
            });
            webDB.execute(
              'SELECT * FROM articles', // <-----TODO: query our table for articles once more
              function(rows) {
                // TODO:
                // 1 - Use Article.loadAll to process our rows,
                // 2 - invoke the function that was passed in to fetchAll
                console.log('THIS IS THE rows (line 90)\n', rows);
                Article.loadAll(rows);
                console.log('THIS IS THE nextFunction (line 91)\n', nextFunction);
                nextFunction();
              });
          });
        }
      });
  };


  Article.prototype.deleteRecord = function() {
    webDB.execute(
      [
        {
          /* NOTE: this is an advanced admin option, so you will need to test
              out an individual query in the console */
          'sql': 'DELETE FROM articles WHERE id = ?', // <---TODO: Delete an article instance from the database based on its id:
          'data': [this.id]
        }
      ]
    );
  };

  Article.clearTable = function() {
    webDB.execute(
      'DELETE FROM articles;' // <----TODO: delete all records from the articles table.
    );
    console.log('all data deleted');
  };

  Article.allAuthors = function() {
    return Article.allArticles.map(function(article) {
      console.log('THIS IS article (line 123)\n', article);
      console.log('THIS IS return article.author (line 124) ' + article.author);
      return article.author;
    })
    .reduce(function(uniqueNames, curName) {
      console.log('THIS IS uniqueNames (line 128)\n', uniqueNames);
      console.log('THIS IS curName (line 129)\n', curName);
      console.log('THIS IS uniqueNames.indexOf(curName) (line 130)\n', uniqueNames.indexOf(curName));
      if (uniqueNames.indexOf(curName) === -1) {
        console.log('THIS IS curName (line 131)\n', curName);
        uniqueNames.push(curName);
      }
      console.log('THIS IS uniqueNames (line 133)\n', uniqueNames);
      return uniqueNames;
    }, []);
  };

  Article.numWordsAll = function() {
    return Article.allArticles.map(function(article) {
      console.log('THIS IS article (line 142)\n', article);
      return article.body.match(/\w+/g).length;
    })
    .reduce(function(a, b) {
      console.log('THIS IS a (line 146)\n', a);
      console.log('THIS IS b (line 147)\n', b);
      return a + b;
    });
  };

  Article.numWordsByAuthor = function() {
    return Article.allAuthors().map(function(currentAuthor) {
      console.log('THIS IS currentAuthor (line 154)\n', currentAuthor);

      return {
        name: currentAuthor,
        numWords: Article.allArticles.filter(function(article) {
          return article.author === currentAuthor;
        })
        .map(function(currentAuthorsArticle) {
          console.log('THIS IS currentAuthorsArticle (line 162)\n', currentAuthorsArticle);
          return currentAuthorsArticle.body.match(/\w+/g).length;
        })
        .reduce(function(previousWords, currentWords) {
          console.log('THIS IS previousWords (line 166)\n', previousWords);
          console.log('THIS IS currentWords (line 167)\n', currentWords);
          return previousWords + currentWords;
        })
      };
    });
  };

// TODO: ensure that our table has been created.
  console.log('THIS IS Article.createTable(); (line 175)\n', Article.createTable());
  Article.createTable();
  console.log('THIS IS module.Article (line 177)\n', module.Article);
  module.Article = Article;
  console.log('THIS IS Article (line 178)\n', Article);

})(window);

console.log('THIS IS window (line 182)\n', window);
