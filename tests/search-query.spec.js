describe('search query', function() {
  describe('parsing', function() {
    describe('value types support', function() {
      it('string', function() {
        var query = "firstName = 'john'";

        expect(searchQuery.parse(query).search[0].value).to.be.a('string');
      });

      it('number', function() {
        var query = "loginCount > 10";

        expect(parseInt(searchQuery.parse(query).search[0].value)).to.equal(10);
      });

      it('null', function() {
        var query = "firstName is not null";

        expect(searchQuery.parse(query).search[0].value).to.be.null;
      });

      it('true', function() {
        var query = "isAdmin = true";

        expect(searchQuery.parse(query).search[0].value).to.be.true;
      });

      it('false', function() {
        var query = "isAdmin = false";

        expect(searchQuery.parse(query).search[0].value).to.be.false;
      });
    });

    describe('comparisons support', function() {
      it('equal', function() {
        var query = "firstName = 'john'";
        var expected = {
          search: [{
            field: 'firstName',
            comparison: '=',
            value: 'john'
          }],
          order: null
        };

        expect(searchQuery.parse(query)).to.deep.equal(expected);
      });

      it('not equal', function() {
        var query = "firstName != 'john'";
        var expected = {
          search: [{
            field: 'firstName',
            comparison: '!=',
            value: 'john'
          }],
          order: null
        };

        expect(searchQuery.parse(query)).to.deep.equal(expected);
      });

      it('greater than', function() {
        var query = "loginCount > 50";
        var expected = {
          search: [{
            field: 'loginCount',
            comparison: '>',
            value: 50
          }],
          order: null
        };

        expect(searchQuery.parse(query)).to.deep.equal(expected);
      });

      it('greater than or equal to', function() {
        var query = "loginCount >= 50";
        var expected = {
          search: [{
            field: 'loginCount',
            comparison: '>=',
            value: 50
          }],
          order: null
        };

        expect(searchQuery.parse(query)).to.deep.equal(expected);
      });

      it('less than', function() {
        var query = "loginCount < 50";
        var expected = {
          search: [{
            field: 'loginCount',
            comparison: '<',
            value: 50
          }],
          order: null
        };

        expect(searchQuery.parse(query)).to.deep.equal(expected);
      });

      it('less than or equal to', function() {
        var query = "loginCount <= 50";
        var expected = {
          search: [{
            field: 'loginCount',
            comparison: '<=',
            value: 50
          }],
          order: null
        };

        expect(searchQuery.parse(query)).to.deep.equal(expected);
      });

      it('in', function() {
        var query = "firstName in ('john', 'james')";
        var expected = {
          search: [{
            field: 'firstName',
            comparison: 'in',
            value: [
              'john',
              'james'
            ]
          }],
          order: null
        };

        expect(searchQuery.parse(query)).to.deep.equal(expected);
      });

      it('not in', function() {
        var query = "firstName not in ('john', 'james')";
        var expected = {
          search: [{
            field: 'firstName',
            comparison: 'not in',
            value: [
              'john',
              'james'
            ]
          }],
          order: null
        };

        expect(searchQuery.parse(query)).to.deep.equal(expected);
      });

      it('is null', function() {
        var query = "firstName is null";
        var expected = {
          search: [{
            field: 'firstName',
            comparison: 'is',
            value: null
          }],
          order: null
        };

        expect(searchQuery.parse(query)).to.deep.equal(expected);
      });

      it('is not null', function() {
        var query = "firstName is not null";
        var expected = {
          search: [{
            field: 'firstName',
            comparison: 'is not',
            value: null
          }],
          order: null
        };

        expect(searchQuery.parse(query)).to.deep.equal(expected);
      });

      it('like', function() {
        var query = "firstName like '%john%'";
        var expected = {
          search: [{
            field: 'firstName',
            comparison: 'like',
            value: '%john%'
          }],
          order: null
        };

        expect(searchQuery.parse(query)).to.deep.equal(expected);
      });

      it('not like', function() {
        var query = "firstName not like '%john%'";
        var expected = {
          search: [{
            field: 'firstName',
            comparison: 'not like',
            value: '%john%'
          }],
          order: null
        };

        expect(searchQuery.parse(query)).to.deep.equal(expected);
      });

      it('between', function() {
        var query = "loginCount between 40 and 60";
        var expected = {
          search: [{
            field: 'loginCount',
            comparison: 'between',
            value: [
              40,
              60
            ]
          }],
          order: null
        };

        expect(searchQuery.parse(query)).to.deep.equal(expected);
      });

      it('not between', function() {
        var query = "loginCount not between 40 and 60";
        var expected = {
          search: [{
            field: 'loginCount',
            comparison: 'not between',
            value: [
              40,
              60
            ]
          }],
          order: null
        };

        expect(searchQuery.parse(query)).to.deep.equal(expected);
      });
    });

    describe('order by', function() {
      it('should support single field', function() {
        var query = "firstName = 'john' order by lastName";
        var expected = {
          search: [{
            field: 'firstName',
            comparison: '=',
            value: 'john'
          }],
          order: [{
            field: 'lastName',
            way: 'asc'
          }]
        };

        expect(searchQuery.parse(query)).to.deep.equal(expected);
      });

      it('should support multiple fields', function() {
        var query = "firstName = 'john' order by lastName, firstName";
        var expected = {
          search: [{
            field: 'firstName',
            comparison: '=',
            value: 'john'
          }],
          order: [{
            field: 'lastName',
            way: 'asc'
          }, {
            field: 'firstName',
            way: 'asc'
          }]
        };

        expect(searchQuery.parse(query)).to.deep.equal(expected);
      });

      it('should be able to set the order by way', function() {
        var query = "firstName = 'john' order by lastName desc, firstName asc";
        var expected = {
          search: [{
            field: 'firstName',
            comparison: '=',
            value: 'john'
          }],
          order: [{
            field: 'lastName',
            way: 'desc'
          }, {
            field: 'firstName',
            way: 'asc'
          }]
        };

        expect(searchQuery.parse(query)).to.deep.equal(expected);
      });
    });

    it('should thrown error on invalid query format', function() {
      var query = 'firstName = ';
      
      expect(function() {
        searchQuery.parse(query);
      }).to.throw(Error);
    });

    it('should support and connector', function() {
      var query = "firstName = 'john' and lastName = 'doe'";
      var expected = {
        search: [{
          field: 'firstName',
          comparison: '=',
          value: 'john'
        }, {
          connector: 'and',
          field: 'lastName',
          comparison: '=',
          value :'doe'
        }],
        order: null
      };

      expect(searchQuery.parse(query)).to.deep.equal(expected);
    });

    it('should support or connector', function() {
      var query = "firstName = 'john' or lastName = 'doe'";
      var expected = {
        search: [{
          field: 'firstName',
          comparison: '=',
          value: 'john'
        }, {
          connector: 'or',
          field: 'lastName',
          comparison: '=',
          value :'doe'
        }],
        order: null
      };

      expect(searchQuery.parse(query)).to.deep.equal(expected);
    });

    it('should support parentheses grouped conditions', function() {
      var query = "firstName = 'john' and (lastName = 'doe' OR lastName = 'smith')";
      var expected = {
        search: [{
          field: 'firstName',
          comparison: '=',
          value: 'john'
        }, {
          connector: 'and',
          items: [{
            field: 'lastName',
            comparison: '=',
            value: 'doe'
          }, {
            connector: 'or',
            field: 'lastName',
            comparison: '=',
            value: 'smith'
          }]
        }],
        order: null
      };

      expect(searchQuery.parse(query)).to.deep.equal(expected);
    });

    it('should support nested parentheses grouped conditions', function() {
      var query = "firstName = 'john' and (lastName = 'doe' OR (lastName = 'smith' AND status = 1))";
      var expected = {
        search: [{
          field: 'firstName',
          comparison: '=',
          value: 'john'
        }, {
          connector: 'and',
          items: [{
            field: 'lastName',
            comparison: '=',
            value: 'doe'
          }, {
            connector: 'or',
            items: [{
              field: 'lastName',
              comparison: '=',
              value: 'smith'
            }, {
              connector: 'and',
              field: 'status',
              comparison: '=',
              value: 1
            }]
          }]
        }],
        order: null
      };

      expect(searchQuery.parse(query)).to.deep.equal(expected);
    });

    it('should not care about extra whitespace', function() {
      var query = "firstName    \n =     \n\n     ";
      query += "'john'    and      \n   ";
      query += "   \n  \n   (   lastName = 'doe' \nOR       ";
      query += "(  lastName  = \n\n'smith'   AND \n ";
      query += " status \n   \n\n= \n1  \n  \n  )   \n)    ";
      var expected = {
        search: [{
          field: 'firstName',
          comparison: '=',
          value: 'john'
        }, {
          connector: 'and',
          items: [{
            field: 'lastName',
            comparison: '=',
            value: 'doe'
          }, {
            connector: 'or',
            items: [{
              field: 'lastName',
              comparison: '=',
              value: 'smith'
            }, {
              connector: 'and',
              field: 'status',
              comparison: '=',
              value: 1
            }]
          }]
        }],
        order: null
      };

      expect(searchQuery.parse(query)).to.deep.equal(expected);
    });

    it('should be able to handle large complex queries', function() {
      var query = "firstName = 'john' and (lastName != 'doe' or (lastName in('smith', 'doe') and status not in(1, 2, 3)) or type like '%admin%' and status = 'banned' and";
      query += " (firstName = 'john' or lastName is null)) or (lastName != true or (lastName = false and status is not null) or type >= 4) and type < 34 or type <= 64";
      query += " and createdTimestamp not between '2014-01-01 00:00:00' and '2014-02-01 00:00:00' order by firstName asc, lastName desc";
      var expected = {
        search: [{
          field: 'firstName',
          comparison: '=',
          value: 'john'
        }, {
          connector: 'and',
          items: [{
            field: 'lastName',
            comparison: '!=',
            value: 'doe'
          }, {
            connector: 'or',
            items: [{
              field: 'lastName',
              comparison: 'in',
              value: [
                'smith',
                'doe'
              ]
            }, {
              connector: 'and',
              field: 'status',
              comparison: 'not in',
              value: [
                1,
                2,
                3
              ]
            }]
          }, {
            connector: 'or',
            field: 'type',
            comparison: 'like',
            value: '%admin%'
          }, {
            connector: 'and',
            field: 'status',
            comparison: '=',
            value: 'banned'
          }, {
            connector: 'and',
            items: [{
              field: 'firstName',
              comparison: '=',
              value: 'john'
            }, {
              connector: 'or',
              field: 'lastName',
              comparison: 'is',
              value: null
            }]
          }]
        }, {
          connector: 'or',
          items: [{
            field: 'lastName',
            comparison: '!=',
            value: true
          }, {
            connector: 'or',
            items: [{
              field: 'lastName',
              comparison: '=',
              value: false
            }, {
              connector: 'and',
              field: 'status',
              comparison: 'is not',
              value: null
            }]
          }, {
            connector: 'or',
            field: 'type',
            comparison: '>=',
            value: 4
          }]
        }, {
          connector: 'and',
          field: 'type',
          comparison: '<',
          value: 34
        }, {
          connector: 'or',
          field: 'type',
          comparison: '<=',
          value: 64
        }, {
          connector: 'and',
          field: 'createdTimestamp',
          comparison: 'not between',
          value: [
            '2014-01-01 00:00:00',
            '2014-02-01 00:00:00'
          ]
        }],
        order: [{
          field: 'firstName',
          way: 'asc'
        }, {
          field: 'lastName',
          way: 'desc'
        }]
      };

      expect(searchQuery.parse(query)).to.deep.equal(expected);
    });
  });

  describe('compiling', function() {
    it('should be able to compile json into the query string', function() {
      var queryJson = {
        search: [{
          field: 'firstName',
          comparison: '=',
          value: 'john'
        }, {
          connector: 'and',
          items: [{
            field: 'lastName',
            comparison: '!=',
            value: 'doe'
          }, {
            connector: 'or',
            items: [{
              field: 'lastName',
              comparison: 'in',
              value: [
                'smith',
                'doe'
              ]
            }, {
              connector: 'and',
              field: 'status',
              comparison: 'not in',
              value: [
                1,
                2,
                3
              ]
            }]
          }, {
            connector: 'or',
            field: 'type',
            comparison: 'like',
            value: '%admin%'
          }, {
            connector: 'and',
            field: 'status',
            comparison: '=',
            value: 'banned'
          }, {
            connector: 'and',
            items: [{
              field: 'firstName',
              comparison: '=',
              value: 'john'
            }, {
              connector: 'or',
              field: 'lastName',
              comparison: 'is',
              value: null
            }]
          }]
        }, {
          connector: 'or',
          items: [{
            field: 'lastName',
            comparison: '!=',
            value: true
          }, {
            connector: 'or',
            items: [{
              field: 'lastName',
              comparison: '=',
              value: false
            }, {
              connector: 'and',
              field: 'status',
              comparison: 'is not',
              value: null
            }]
          }, {
            connector: 'or',
            field: 'type',
            comparison: '>=',
            value: 4
          }]
        }, {
          connector: 'and',
          field: 'type',
          comparison: '<',
          value: 34
        }, {
          connector: 'or',
          field: 'type',
          comparison: '<=',
          value: 64
        }, {
          connector: 'and',
          field: 'createdTimestamp',
          comparison: 'not between',
          value: [
            '2014-01-01 00:00:00',
            '2014-02-01 00:00:00'
          ]
        }],
        order: [{
          field: 'firstName',
          way: 'asc'
        }, {
          field: 'lastName',
          way: 'desc'
        }]
      };
      var expected = "firstName = 'john' and (lastName != 'doe' or (lastName in('smith', 'doe') and status not in(1, 2, 3)) or type like '%admin%' and status = 'banned' and";
      expected += " (firstName = 'john' or lastName is null)) or (lastName != true or (lastName = false and status is not null) or type >= 4) and type < 34 or type <= 64";
      expected += " and createdTimestamp not between '2014-01-01 00:00:00' and '2014-02-01 00:00:00' order by firstName asc, lastName desc";

      expect(searchQuery.compile(queryJson)).to.equal(expected);
    });
  });
});