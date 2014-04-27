describe('search query', function() {
  var searchQuery

  beforeEach(function() {
    searchQuery = new SearchQuery();
  });

  describe('parsing', function() {
    describe('value types support', function() {
      it('string', function() {
        var query = "firstName = 'john'";

        expect(searchQuery.parse(query).search[0].value).to.be.a('string');
      });

      it('identifier', function() {
        var query = "status = Active";

        expect(searchQuery.parse(query).search[0].value).to.be.a('string');
        expect(searchQuery.parse(query).search[0].value).to.equal('Active');
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

  describe('validating', function() {
    it('should validate valid query', function() {
      var query = "firstName = 'john'";

      expect(searchQuery.validate(query)).to.be.true;
    });

    it('should not validate invalid query', function() {
      var query = "firstName = 'john";
      var expected = {
        lineNumber: 1,
        characterNumber: 13,
        queryLocation: 'firstName = \'john',
        queryIndicator: '------------^',
        error: "Expecting 'IDENTIFIER', 'STRING', 'NUMERIC', 'TRUE', 'FALSE', got 'INVALID'"
      };

      expect(searchQuery.validate(query)).to.deep.equal(expected);
    });
  });

  describe('tokenization', function() {
    describe('should work in what is currently type is possible to be a valid query', function() {
      describe('incomplete values', function() {
        it('test case 1', function() {
          var query = "firstName = 'john ";
          var expectedList = [{
            type: 'identifier',
            value: 'firstName'
          }, {
            type: 'comparison',
            value: '='
          }, {
            type: 'unknown',
            value: 'john '
          }];

          expect(searchQuery.getLastKnownTokenType(query)).to.equal('comparison');
          expect(searchQuery.getTokenList(query)).to.deep.equal(expectedList);
        });

        it('test case 2', function() {
          var query = "firstName between 'john ";
          var expectedList = [{
            type: 'identifier',
            value: 'firstName'
          }, {
            type: 'comparison',
            value: 'between'
          }, {
            type: 'unknown',
            value: [
              'john '
            ]
          }];

          expect(searchQuery.getLastKnownTokenType(query)).to.equal('comparison');
          expect(searchQuery.getTokenList(query)).to.deep.equal(expectedList);
        });

        it('test case 3', function() {
          var query = "firstName between 'john' and 'kim ";
          var expectedList = [{
            type: 'identifier',
            value: 'firstName'
          }, {
            type: 'comparison',
            value: 'between'
          }, {
            type: 'unknown',
            value: [
              'john',
              'kim '
            ]
          }];

          expect(searchQuery.getLastKnownTokenType(query)).to.equal('comparison');
          expect(searchQuery.getTokenList(query)).to.deep.equal(expectedList);
        });

        it('test case 4', function() {
          var query = "firstName not between 'john ";
          var expectedList = [{
            type: 'identifier',
            value: 'firstName'
          }, {
            type: 'comparison',
            value: 'not between'
          }, {
            type: 'unknown',
            value: [
              'john '
            ]
          }];

          expect(searchQuery.getLastKnownTokenType(query)).to.equal('comparison');
          expect(searchQuery.getTokenList(query)).to.deep.equal(expectedList);
        });

        it('test case 5', function() {
          var query = "firstName not between 'john' and 'kim ";
          var expectedList = [{
            type: 'identifier',
            value: 'firstName'
          }, {
            type: 'comparison',
            value: 'not between'
          }, {
            type: 'unknown',
            value: [
              'john',
              'kim '
            ]
          }];

          expect(searchQuery.getLastKnownTokenType(query)).to.equal('comparison');
          expect(searchQuery.getTokenList(query)).to.deep.equal(expectedList);
        });
      });

      //TODO: figure out better names for the unit tests
      it('test case 1', function() {
        var query = "firstName no";
        var expectedList = [{
          type: 'identifier',
          value: 'firstName'
        }, {
          type: 'unknown',
          value: 'no'
        }];

        expect(searchQuery.getLastKnownTokenType(query)).to.equal('identifier');
        expect(searchQuery.getTokenList(query)).to.deep.equal(expectedList);
      });

      it('test case 2', function() {
        var query = "firstName not";
        var expectedList = [{
          type: 'identifier',
          value: 'firstName'
        }, {
          type: 'unknown',
          value: 'not'
        }];

        expect(searchQuery.getLastKnownTokenType(query)).to.equal('identifier');
        expect(searchQuery.getTokenList(query)).to.deep.equal(expectedList);
      });

      it('test case 3', function() {
        var query = "firstName not ";
        var expectedList = [{
          type: 'identifier',
          value: 'firstName'
        }, {
          type: 'unknown',
          value: 'not'
        }];

        expect(searchQuery.getLastKnownTokenType(query)).to.equal('identifier');
        expect(searchQuery.getTokenList(query)).to.deep.equal(expectedList);
      });

      it('test case 4', function() {
        var query = "firstName not i";
        var expectedList = [{
          type: 'identifier',
          value: 'firstName'
        }, {
          type: 'unknown',
          value: 'not i'
        }];

        expect(searchQuery.getLastKnownTokenType(query)).to.equal('identifier');
        expect(searchQuery.getTokenList(query)).to.deep.equal(expectedList);
      });

      it('test case 5', function() {
        var query = "firstName not in(";
        var expectedList = [{
          type: 'identifier',
          value: 'firstName'
        }, {
          type: 'comparison',
          value: 'not in'
        }, {
          type: 'unknown',
          value: []
        }];

        expect(searchQuery.getLastKnownTokenType(query)).to.equal('comparison');
        expect(searchQuery.getTokenList(query)).to.deep.equal(expectedList);
      });

      it('test case 6', function() {
        var query = "firstName not in('qwe";
        var expectedList = [{
          type: 'identifier',
          value: 'firstName'
        }, {
          type: 'comparison',
          value: 'not in'
        }, {
          type: 'unknown',
          value: [
            'qwe'
          ]
        }];

        expect(searchQuery.getLastKnownTokenType(query)).to.equal('comparison');
        expect(searchQuery.getTokenList(query)).to.deep.equal(expectedList);
      });

      it('test case 6-1', function() {
        var query = "firstName in('qwe";
        var expectedList = [{
          type: 'identifier',
          value: 'firstName'
        }, {
          type: 'comparison',
          value: 'in'
        }, {
          type: 'unknown',
          value: [
            'qwe'
          ]
        }];

        expect(searchQuery.getLastKnownTokenType(query)).to.equal('comparison');
        expect(searchQuery.getTokenList(query)).to.deep.equal(expectedList);
      });

      it('test case 7', function() {
        var query = "firstName";
        var expectedList = [{
          type: 'identifier',
          value: 'firstName'
        }];

        expect(searchQuery.getLastKnownTokenType(query)).to.be.null;
        expect(searchQuery.getTokenList(query)).to.deep.equal(expectedList);
      });

      it('test case 8', function() {
        var query = "firstName !";
        var expectedList = [{
          type: 'identifier',
          value: 'firstName'
        }, {
          type: 'unknown',
          value: '!'
        }];

        expect(searchQuery.getLastKnownTokenType(query)).to.equal('identifier');
        expect(searchQuery.getTokenList(query)).to.deep.equal(expectedList);
      });

      it('test case 9', function() {
        var query = "firstName i";
        var expectedList = [{
          type: 'identifier',
          value: 'firstName'
        }, {
          type: 'unknown',
          value: 'i'
        }];

        expect(searchQuery.getLastKnownTokenType(query)).to.equal('identifier');
        expect(searchQuery.getTokenList(query)).to.deep.equal(expectedList);
      });

      it('test case 10', function() {
        var query = "firstName is";
        var expectedList = [{
          type: 'identifier',
          value: 'firstName'
        }, {
          type: 'unknown',
          value: 'is'
        }];

        expect(searchQuery.getLastKnownTokenType(query)).to.equal('identifier');
        expect(searchQuery.getTokenList(query)).to.deep.equal(expectedList);
      });

      it('test case 11', function() {
        var query = "firstName is n";
        var expectedList = [{
          type: 'identifier',
          value: 'firstName'
        }, {
          type: 'unknown',
          value: 'is n'
        }];

        expect(searchQuery.getLastKnownTokenType(query)).to.equal('identifier');
        expect(searchQuery.getTokenList(query)).to.deep.equal(expectedList);
      });

      it('test case 11-1', function() {
        var query = "firstName is not";
        var expectedList = [{
          type: 'identifier',
          value: 'firstName'
        }, {
          type: 'unknown',
          value: 'is not'
        }];

        expect(searchQuery.getLastKnownTokenType(query)).to.equal('identifier');
        expect(searchQuery.getTokenList(query)).to.deep.equal(expectedList);
      });

      it('test case 12', function() {
        var query = "firstName is not n";
        var expectedList = [{
          type: 'identifier',
          value: 'firstName'
        }, {
          type: 'unknown',
          value: 'is not n'
        }];

        expect(searchQuery.getLastKnownTokenType(query)).to.equal('identifier');
        expect(searchQuery.getTokenList(query)).to.deep.equal(expectedList);
      });

      it('test case 13', function() {
        var query = "firstName in";
        var expectedList = [{
          type: 'identifier',
          value: 'firstName'
        }, {
          type: 'comparison',
          value: 'in'
        }];

        expect(searchQuery.getLastKnownTokenType(query)).to.equal('identifier');
        expect(searchQuery.getTokenList(query)).to.deep.equal(expectedList);
      });

      it('test case 14', function() {
        var query = "firstName bew";
        var expectedList = [{
          type: 'identifier',
          value: 'firstName'
        }, {
          type: 'unknown',
          value: 'bew'
        }];

        expect(searchQuery.getLastKnownTokenType(query)).to.equal('identifier');
        expect(searchQuery.getTokenList(query)).to.deep.equal(expectedList);
      });

      it('test case 15', function() {
        var query = "firstName between";
        var expectedList = [{
          type: 'identifier',
          value: 'firstName'
        }, {
          type: 'comparison',
          value: 'between'
        }, {
          type: 'unknown',
          value: []
        }];

        expect(searchQuery.getLastKnownTokenType(query)).to.equal('comparison');
        expect(searchQuery.getTokenList(query)).to.deep.equal(expectedList);
      });

      it('test case 16', function() {
        var query = "firstName between 123";
        var expectedList = [{
          type: 'identifier',
          value: 'firstName'
        }, {
          type: 'comparison',
          value: 'between'
        }, {
          type: 'unknown',
          value: [
            123
          ]
        }];

        expect(searchQuery.getLastKnownTokenType(query)).to.equal('comparison');
        expect(searchQuery.getTokenList(query)).to.deep.equal(expectedList);
      });

      it('test case 17', function() {
        var query = "firstName between 123 and";
        var expectedList = [{
          type: 'identifier',
          value: 'firstName'
        }, {
          type: 'comparison',
          value: 'between'
        }, {
          type: 'unknown',
          value: [
            123,
            null
          ]
        }];

        expect(searchQuery.getLastKnownTokenType(query)).to.equal('comparison');
        expect(searchQuery.getTokenList(query)).to.deep.equal(expectedList);
      });

      it('test case 18', function() {
        var query = "firstName not bet";
        var expectedList = [{
          type: 'identifier',
          value: 'firstName'
        }, {
          type: 'unknown',
          value: 'not bet'
        }];

        expect(searchQuery.getLastKnownTokenType(query)).to.equal('identifier');
        expect(searchQuery.getTokenList(query)).to.deep.equal(expectedList);
      });

      it('test case 18-1', function() {
        var query = "firstName not between";
        var expectedList = [{
          type: 'identifier',
          value: 'firstName'
        }, {
          type: 'comparison',
          value: 'not between'
        }, {
          type: 'unknown',
          value: []
        }];

        expect(searchQuery.getLastKnownTokenType(query)).to.equal('comparison');
        expect(searchQuery.getTokenList(query)).to.deep.equal(expectedList);
      });

      it('test case 19', function() {
        var query = "firstName not between 123";
        var expectedList = [{
          type: 'identifier',
          value: 'firstName'
        }, {
          type: 'comparison',
          value: 'not between'
        }, {
          type: 'unknown',
          value: [
            123
          ]
        }];

        expect(searchQuery.getLastKnownTokenType(query)).to.equal('comparison');
        expect(searchQuery.getTokenList(query)).to.deep.equal(expectedList);
      });

      it('test case 20', function() {
        var query = "firstName not between 123 and";
        var expectedList = [{
          type: 'identifier',
          value: 'firstName'
        }, {
          type: 'comparison',
          value: 'not between'
        }, {
          type: 'unknown',
          value: [
            123,
            null
          ]
        }];

        expect(searchQuery.getLastKnownTokenType(query)).to.equal('comparison');
        expect(searchQuery.getTokenList(query)).to.deep.equal(expectedList);
      });

      it('test case 21', function() {
        var query = "firstName li";
        var expectedList = [{
          type: 'identifier',
          value: 'firstName'
        }, {
          type: 'unknown',
          value: 'li'
        }];

        expect(searchQuery.getLastKnownTokenType(query)).to.equal('identifier');
        expect(searchQuery.getTokenList(query)).to.deep.equal(expectedList);
      });

      it('test case 22', function() {
        var query = "firstName in(";
        var expectedList = [{
          type: 'identifier',
          value: 'firstName'
        }, {
          type: 'comparison',
          value: 'in'
        }, {
          type: 'unknown',
          value: []
        }];

        expect(searchQuery.getLastKnownTokenType(query)).to.equal('comparison');
        expect(searchQuery.getTokenList(query)).to.deep.equal(expectedList);
      });

      it('test case 23', function() {
        var query = "firstName not in(";
        var expectedList = [{
          type: 'identifier',
          value: 'firstName'
        }, {
          type: 'comparison',
          value: 'not in'
        }, {
          type: 'unknown',
          value: []
        }];

        expect(searchQuery.getLastKnownTokenType(query)).to.equal('comparison');
        expect(searchQuery.getTokenList(query)).to.deep.equal(expectedList);
      });

      it('test case 24', function() {
        var query = "firstName in(1";
        var expectedList = [{
          type: 'identifier',
          value: 'firstName'
        }, {
          type: 'comparison',
          value: 'in'
        }, {
          type: 'unknown',
          value: [
            1
          ]
        }];

        expect(searchQuery.getLastKnownTokenType(query)).to.equal('comparison');
        expect(searchQuery.getTokenList(query)).to.deep.equal(expectedList);
      });

      it('test case 25', function() {
        var query = "firstName not in(1";
        var expectedList = [{
          type: 'identifier',
          value: 'firstName'
        }, {
          type: 'comparison',
          value: 'not in'
        }, {
          type: 'unknown',
          value: [
            1
          ]
        }];

        expect(searchQuery.getLastKnownTokenType(query)).to.equal('comparison');
        expect(searchQuery.getTokenList(query)).to.deep.equal(expectedList);
      });

      it('test case 26', function() {
        var query = "firstName in(1,2";
        var expectedList = [{
          type: 'identifier',
          value: 'firstName'
        }, {
          type: 'comparison',
          value: 'in'
        }, {
          type: 'unknown',
          value: [
            1,
            2
          ]
        }];

        expect(searchQuery.getLastKnownTokenType(query)).to.equal('comparison');
        expect(searchQuery.getTokenList(query)).to.deep.equal(expectedList);
      });

      it('test case 27', function() {
        var query = "firstName not in(1,2";
        var expectedList = [{
          type: 'identifier',
          value: 'firstName'
        }, {
          type: 'comparison',
          value: 'not in'
        }, {
          type: 'unknown',
          value: [
            1,
            2
          ]
        }];

        expect(searchQuery.getLastKnownTokenType(query)).to.equal('comparison');
        expect(searchQuery.getTokenList(query)).to.deep.equal(expectedList);
      });

      it('test case 28', function() {
        var query = "firstName in(1,2,";
        var expectedList = [{
          type: 'identifier',
          value: 'firstName'
        }, {
          type: 'comparison',
          value: 'in'
        }, {
          type: 'unknown',
          value: [
            1,
            2,
            null
          ]
        }];

        expect(searchQuery.getLastKnownTokenType(query)).to.equal('comparison');
        expect(searchQuery.getTokenList(query)).to.deep.equal(expectedList);
      });

      it('test case 29', function() {
        var query = "firstName not in(1,2,";
        var expectedList = [{
          type: 'identifier',
          value: 'firstName'
        }, {
          type: 'comparison',
          value: 'not in'
        }, {
          type: 'unknown',
          value: [
            1,
            2,
            null
          ]
        }];

        expect(searchQuery.getLastKnownTokenType(query)).to.equal('comparison');
        expect(searchQuery.getTokenList(query)).to.deep.equal(expectedList);
      });

      it('test case 30', function() {
        var query = "firstName = 1 and ";
        var expectedList = [{
          type: 'identifier',
          value: 'firstName'
        }, {
          type: 'comparison',
          value: '='
        }, {
          type: 'value',
          value: 1
        }, {
          type: 'connector',
          value: 'and'
        }];

        expect(searchQuery.getLastKnownTokenType(query)).to.equal('connector');
        expect(searchQuery.getTokenList(query)).to.deep.equal(expectedList);
      });

      it('test case 31', function() {
        var query = "firstName = 1 and (";
        var expectedList = [{
          type: 'identifier',
          value: 'firstName'
        }, {
          type: 'comparison',
          value: '='
        }, {
          type: 'value',
          value: 1
        }, {
          type: 'connector',
          value: 'and'
        }, {
          type: 'identifier',
          value: ''
        }];

        expect(searchQuery.getLastKnownTokenType(query)).to.equal('connector');
        expect(searchQuery.getTokenList(query)).to.deep.equal(expectedList);
      });

      it('test case 32', function() {
        var query = "firstName = 1 and (lastName = 2 or (";
        var expectedList = [{
          type: 'identifier',
          value: 'firstName'
        }, {
          type: 'comparison',
          value: '='
        }, {
          type: 'value',
          value: 1
        }, {
          type: 'connector',
          value: 'and'
        }, {
          type: 'identifier',
          value: 'lastName'
        }, {
          type: 'comparison',
          value: '='
        }, {
          type: 'value',
          value: 2
        }, {
          type: 'connector',
          value: 'or'
        }, {
          type: 'identifier',
          value: ''
        }];

        expect(searchQuery.getLastKnownTokenType(query)).to.equal('connector');
        expect(searchQuery.getTokenList(query)).to.deep.equal(expectedList);
      });

      it('test case 33', function() {
        var query = "firstName = 1 and (lastName = 2 or (username = 'test' and (";
        var expectedList = [{
          type: 'identifier',
          value: 'firstName'
        }, {
          type: 'comparison',
          value: '='
        }, {
          type: 'value',
          value: 1
        }, {
          type: 'connector',
          value: 'and'
        }, {
          type: 'identifier',
          value: 'lastName'
        }, {
          type: 'comparison',
          value: '='
        }, {
          type: 'value',
          value: 2
        }, {
          type: 'connector',
          value: 'or'
        }, {
          type: 'identifier',
          value: 'username'
        }, {
          type: 'comparison',
          value: '='
        }, {
          type: 'value',
          value: 'test'
        }, {
          type: 'connector',
          value: 'and'
        }, {
          type: 'identifier',
          value: ''
        }];

        expect(searchQuery.getLastKnownTokenType(query)).to.equal('connector');
        expect(searchQuery.getTokenList(query)).to.deep.equal(expectedList);
      });

      it('test case 34', function() {
        var query = "firstName between kim an";
        var expectedList = [{
          type: 'identifier',
          value: 'firstName'
        }, {
          type: 'comparison',
          value: 'between'
        }, {
          type: 'unknown',
          value: [
            'kim'
          ]
        }];

        expect(searchQuery.getLastKnownTokenType(query)).to.equal('comparison');
        expect(searchQuery.getTokenList(query)).to.deep.equal(expectedList);
      });

      it('test case 35', function() {
        var query = "firstName between ";
        var expectedList = [{
          type: 'identifier',
          value: 'firstName'
        }, {
          type: 'comparison',
          value: 'between'
        }, {
          type: 'unknown',
          value: []
        }];

        expect(searchQuery.getLastKnownTokenType(query)).to.equal('comparison');
        expect(searchQuery.getTokenList(query)).to.deep.equal(expectedList);
      });

      it('test case 36', function() {
        var query = "firstName between kim and ";
        var expectedList = [{
          type: 'identifier',
          value: 'firstName'
        }, {
          type: 'comparison',
          value: 'between'
        }, {
          type: 'unknown',
          value: [
            'kim',
            null
          ]
        }];

        expect(searchQuery.getLastKnownTokenType(query)).to.equal('comparison');
        expect(searchQuery.getTokenList(query)).to.deep.equal(expectedList);
      });

      it('test case 37', function() {
        var query = "firstName not between ";
        var expectedList = [{
          type: 'identifier',
          value: 'firstName'
        }, {
          type: 'comparison',
          value: 'not between'
        }, {
          type: 'unknown',
          value: []
        }];

        expect(searchQuery.getLastKnownTokenType(query)).to.equal('comparison');
        expect(searchQuery.getTokenList(query)).to.deep.equal(expectedList);
      });

      it('test case 38', function() {
        var query = "firstName not between kim and ";
        var expectedList = [{
          type: 'identifier',
          value: 'firstName'
        }, {
          type: 'comparison',
          value: 'not between'
        }, {
          type: 'unknown',
          value: [
            'kim',
            null
          ]
        }];

        expect(searchQuery.getLastKnownTokenType(query)).to.equal('comparison');
        expect(searchQuery.getTokenList(query)).to.deep.equal(expectedList);
      });
    });

    describe('get last known type', function() {
      describe('types support', function() {
        it('identifier', function() {
          var query = "firstName ";
          expect(searchQuery.getLastKnownTokenType(query)).to.equal('identifier');
        });

        it('comparison', function() {
          var query = "firstName = ";
          expect(searchQuery.getLastKnownTokenType(query)).to.equal('comparison');
        });

        it('value', function() {
          var query = "firstName = 'john' ";
          expect(searchQuery.getLastKnownTokenType(query)).to.equal('value');
        });

        it('connector', function() {
          var query = "firstName = 'john' and ";
          expect(searchQuery.getLastKnownTokenType(query)).to.equal('connector');
        });

        it('orderBy', function() {
          var query = "firstName = 'john' order by ";
          expect(searchQuery.getLastKnownTokenType(query)).to.equal('orderBy');
        });

        it('orderByIdentifier', function() {
          var query = "firstName = 'john' order by lastName ";
          expect(searchQuery.getLastKnownTokenType(query)).to.equal('orderByIdentifier');
        });

        it('orderByWay', function() {
          var query = "firstName = 'john' order by lastName desc, ";
          expect(searchQuery.getLastKnownTokenType(query)).to.equal('orderByWay');
        });
      });

      it('should not return any token type if there is only 1 token and the query does not end with a space', function() {
        var query = "firstName";
        expect(searchQuery.getLastKnownTokenType(query)).to.be.null;
      });

      it('should return the only token type if there is only 1 token and the query ends with a space', function() {
        var query = "firstName ";
        expect(searchQuery.getLastKnownTokenType(query)).to.equal('identifier');
      });

      it('should return the previous token when typing the current one', function() {
        var query = "firstName =";

        expect(searchQuery.getLastKnownTokenType(query)).to.equal('identifier');
      });

      it('should return the last token if the last character of the query is a string', function() {
        var query = "firstName = ";
        expect(searchQuery.getLastKnownTokenType(query)).to.equal('comparison');
      });

      it('should return the last token that is know if the last one in unknown', function() {
        var query = "firstName not ";
        expect(searchQuery.getLastKnownTokenType(query)).to.equal('identifier');
      });
    });

    describe('get last token by type', function() {
      it('should return null is the requested type does not exist', function() {
        var query = "firstName != ";

        expect(searchQuery.getLastTokenByType(query, 'value')).to.be.undefined;
      });

      it('should be able to get last token of a certain type', function() {
        var query = "firstName != ";
        var expected = {
          type: 'identifier',
          value: 'firstName'
        };

        expect(searchQuery.getLastTokenByType(query, 'identifier')).to.deep.equal(expected);
      });

      it('should be able to get last token of a certain type even when multiple exist', function() {
        var query = "firstName != 'john' and lastName = ";
        var expected = {
          type: 'comparison',
          value: '='
        };

        expect(searchQuery.getLastTokenByType(query, 'comparison')).to.deep.equal(expected);
      });

      it('should be able to use array of token types and if the first does not match anything, it tries the next', function() {
        var query = "firstName != 'john' and lastName = ";
        var expected = {
          type: 'comparison',
          value: '='
        };

        expect(searchQuery.getLastTokenByType(query, ['unknown', 'comparison'])).to.deep.equal(expected);
      });
    });

    describe('get previous token by index', function() {
      it('should be able to get previous tokens by index value', function() {
        var query = "firstName != 'john' and lastName = ";
        var expected = {
          type: 'connector',
          value: 'and'
        };

        expect(searchQuery.getPreviousTokenByIndex(query, 2)).to.deep.equal(expected);
      })
    })

    it('should be able to handle incomplete strings', function() {
      var query = "firstName = 'joh";
      var expectedList = [{
        type: 'identifier',
        value: 'firstName'
      }, {
        type: 'comparison',
        value: '='
      }, {
        type: 'unknown',
        value: 'joh'
      }];

      expect(searchQuery.getTokenList(query)).to.deep.equal(expectedList);
    });

    it('should be able to handle complex queries', function() {
      var query = "firstName = 'john' and (lastName != 'doe' or (lastName in('smith', 'doe') and status not in(1, 2, 3)) or type like '%admin%' and status = 'banned' and";
      query += " (firstName = 'john' or lastName is null)) or (lastName != true or (lastName = false and status is not null) or type >= 4) and type < 34 or type <= 64";
      query += " and createdTimestamp not between '2014-01-01 00:00:00' and '2014-02-01 00:00:00' order by firstName asc, lastName desc";
      var expected = [{
        type: 'identifier',
        value: 'firstName'
      }, {
        type: 'comparison',
        value: '='
      }, {
        type: 'value',
        value: 'john'
      }, {
        type: 'connector',
        value: 'and'
      }, {
        type: 'identifier',
        value: 'lastName'
      }, {
        type: 'comparison',
        value: '!='
      }, {
        type: 'value',
        value: 'doe'
      }, {
        type: 'connector',
        value: 'or'
      }, {
        type: 'identifier',
        value: 'lastName'
      }, {
        type: 'comparison',
        value: 'in'
      }, {
        type: 'value',
        value: [
          'smith',
          'doe'
        ]
      }, {
        type: 'connector',
        value: 'and'
      }, {
        type: 'identifier',
        value: 'status'
      }, {
        type: 'comparison',
        value: 'not in'
      }, {
        type: 'value',
        value: [
          1,
          2,
          3
        ]
      }, {
        type: 'connector',
        value: 'or'
      }, {
        type: 'identifier',
        value: 'type'
      }, {
        type: 'comparison',
        value: 'like'
      }, {
        type: 'value',
        value: '%admin%'
      }, {
        type: 'connector',
        value: 'and'
      }, {
        type: 'identifier',
        value: 'status'
      }, {
        type: 'comparison',
        value: '='
      }, {
        type: 'value',
        value: 'banned'
      }, {
        type: 'connector',
        value: 'and'
      }, {
        type: 'identifier',
        value: 'firstName'
      }, {
        type: 'comparison',
        value: '='
      }, {
        type: 'value',
        value: 'john'
      }, {
        type: 'connector',
        value: 'or'
      }, {
        type: 'identifier',
        value: 'lastName'
      }, {
        type: 'comparison',
        value: 'is'
      }, {
        type: 'value',
        value: null
      }, {
        type: 'connector',
        value: 'or'
      }, {
        type: 'identifier',
        value: 'lastName'
      }, {
        type: 'comparison',
        value: '!='
      }, {
        type: 'value',
        value: true
      }, {
        type: 'connector',
        value: 'or'
      }, {
        type: 'identifier',
        value: 'lastName'
      }, {
        type: 'comparison',
        value: '='
      }, {
        type: 'value',
        value: false
      }, {
        type: 'connector',
        value: 'and'
      }, {
        type: 'identifier',
        value: 'status'
      }, {
        type: 'comparison',
        value: 'is not'
      }, {
        type: 'value',
        value: null
      }, {
        type: 'connector',
        value: 'or'
      }, {
        type: 'identifier',
        value: 'type'
      }, {
        type: 'comparison',
        value: '>='
      }, {
        type: 'value',
        value: 4
      }, {
        type: 'connector',
        value: 'and'
      }, {
        type: 'identifier',
        value: 'type'
      }, {
        type: 'comparison',
        value: '<'
      }, {
        type: 'value',
        value: 34
      }, {
        type: 'connector',
        value: 'or'
      }, {
        type: 'identifier',
        value: 'type'
      }, {
        type: 'comparison',
        value: '<='
      }, {
        type: 'value',
        value: 64
      }, {
        type: 'connector',
        value: 'and'
      }, {
        type: 'identifier',
        value: 'createdTimestamp'
      }, {
        type: 'comparison',
        value: 'not between'
      }, {
        type: 'value',
        value: [
          '2014-01-01 00:00:00',
          '2014-02-01 00:00:00'
        ]
      }, {
        type: 'orderBy',
        value: 'order by'
      }, {
        type: 'orderByIdentifier',
        value: 'firstName'
      }, {
        type: 'orderByWay',
        value: 'asc'
      }, {
        type: 'orderByIdentifier',
        value: 'lastName'
      }, {
        type: 'orderByWay',
        value: 'desc'
      }];

      expect(searchQuery.getTokenList(query)).to.deep.equal(expected);
    });

    it('should be able to handle bad queries gracefully', function() {
      var query = "!=";
      var expectedList = [];

      expect(searchQuery.getLastKnownTokenType(query)).to.be.null;
      expect(searchQuery.getTokenList(query)).to.deep.equal(expectedList);
    });

    it('should be able to handle bad queries gracefully2', function() {
      var query = "!= ";
      var expectedList = [];

      expect(searchQuery.getLastKnownTokenType(query)).to.be.null;
      expect(searchQuery.getTokenList(query)).to.deep.equal(expectedList);
    });
  });
});