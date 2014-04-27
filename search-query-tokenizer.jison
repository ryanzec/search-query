/**
 * http://zaach.github.io/jison/try/
 * http://jsonformatter.curiousconcept.com/
 * Still pending:
 *  - UNION
 */

/* description: Parses SQL */
/* :tabSize=2:indentSize=2:noTabs=true: */
%lex

%options case-insensitive

%%

\s+                                              /* skip whitespace */
'BETWEEN'                                        return 'BETWEEN'
'ORDER BY'                                       return 'ORDER_BY'
','                                              return 'COMMA'
'='                                              return 'CMP_EQUALS'
'!='                                             return 'CMP_NOTEQUALS'
'>='                                             return 'CMP_GREATEROREQUAL'
'>'                                              return 'CMP_GREATER'
'<='                                             return 'CMP_LESSOREQUAL'
'<'                                              return 'CMP_LESS'
'!'                                              return 'INCOMPLETE_CMP_NOTEQUALS'
'('                                              return 'LPAREN'
')'                                              return 'RPAREN'
'IS'                                             return 'IS'
'IN'                                             return 'IN'
'AND'                                            return 'LOGICAL_AND'
'OR'                                             return 'LOGICAL_OR'
'NOT'                                            return 'LOGICAL_NOT'
'LIKE'                                           return 'LIKE'
'ASC'                                            return 'ASC'
'DESC'                                           return 'DESC'
['](\\.|[^'])*[']                                return 'STRING'
['](\\.|[^'])*                                   return 'INCOMPLETE_STRING'
'NULL'                                           return 'NULL'
true                                             return 'TRUE'
false                                            return 'FALSE'
[0-9]+(\.[0-9]+)?                                return 'NUMERIC'
[a-zA-Z_][a-zA-Z0-9_]*                           return 'IDENTIFIER'
<<EOF>>                                          return 'EOF'
.                                                return 'INVALID'

/lex

%start main
%glr-parser
%% /* language grammar */

main
  : expression EOF
    { return $1; }
  ;

orderValue
  : IDENTIFIER { $$ = [{type: 'orderByIdentifier', 'value': $1}]; }
  | IDENTIFIER orderWay { $$ = [{type: 'orderByIdentifier', 'value': $1}, $2]; }
  ;

orderWay
  : ASC { $$ = {type: 'orderByWay', value: 'asc'}; }
  | DESC { $$ = {type: 'orderByWay', value: 'desc'}; }
  ;

orderByCommaList
  : orderValue { $$ = $1; }
  | orderByCommaList COMMA { $$ = $1; }
  | orderByCommaList COMMA orderValue { $$ = $1; $3.forEach(function(token){$1.push(token);}); }
  ;

expression
  : condition { $$ = $1; }
  | expression connector { $$ = $1; $1.push($2); }
  | expression connector condition { $$ = $1; $1.push($2); $3.forEach(function(token){$1.push(token);}); }
  | expression ORDER_BY { $$ = $1; $1.push({type: 'orderBy', value: 'order by'}); }
  | expression ORDER_BY orderByCommaList { $$ = $1; $1.push({type: 'orderBy', value: 'order by'}); $3.forEach(function(token){$1.push(token);}); }
  ;

connector
  : LOGICAL_AND { $$ = {type: 'connector', value: 'and'}; }
  | LOGICAL_OR { $$ = {type: 'connector', value: 'or'}; }
  | IDENTIFIER { $$ = {type: 'unknown', value: $1}; }
  ;

condition
  : IDENTIFIER { $$ = [{type: 'identifier', value: $1}]; }
  | IDENTIFIER comparison {  $$ = [{type: 'identifier', value: $1}, {type: 'comparison', value: $2}]; }
  | IDENTIFIER comparison value { $$ = [{type: 'identifier', value: $1}, {type: 'comparison', value: $2}, {type: 'value', value: $3}]; }
  | IDENTIFIER IN LPAREN commaList RPAREN { $$ = [{type: 'identifier', value: $1}, {type: 'comparison', value: 'in'}, $4]; }
  | IDENTIFIER LOGICAL_NOT IN LPAREN commaList RPAREN { $$ = [{type: 'identifier', value: $1}, {type: 'comparison', value: 'not in'}, $5]; }
  | IDENTIFIER IS NULL { $$ = [{type: 'identifier', value: $1}, {type: 'comparison', value: 'is'}, {type: 'value', value: null}]; }
  | IDENTIFIER IS LOGICAL_NOT NULL { $$ = [{type: 'identifier', value: $1}, {type: 'comparison', value: 'is not'}, {type: 'value', value: null}]; }
  | IDENTIFIER BETWEEN value LOGICAL_AND value { $$ = [{type: 'identifier', value: $1}, {type: 'comparison', value: 'between'}, {type: 'value', value: [$3, $5]}]; }
  | IDENTIFIER LOGICAL_NOT BETWEEN value LOGICAL_AND value { $$ = [{type: 'identifier', value: $1}, {type: 'comparison', value: 'not between'}, {type: 'value', value: [$4, $6]}]; }
  /* start for supporting possible valid queries but incomplete */
  | IDENTIFIER incompleteComparison { $$ = [{type: 'identifier', value: $1}, {type: 'unknown', value: $2}]; }
  | IDENTIFIER IDENTIFIER { $$ = [{type: 'identifier', value: $1}, {type: 'unknown', value: $2}]; }
  | IDENTIFIER LOGICAL_NOT { $$ = [{type: 'identifier', value: $1}, {type: 'unknown', value: $2}]; }
  | IDENTIFIER LOGICAL_NOT IDENTIFIER { $$ = [{type: 'identifier', value: $1}, {type: 'unknown', value: $2 + ' ' + $3}]; }
  | IDENTIFIER LOGICAL_NOT IN { $$ = [{type: 'identifier', value: $1}, {type: 'comparison', value: $2 + ' ' + $3}]; }
  | IDENTIFIER LOGICAL_NOT IN LPAREN { $$ = [{type: 'identifier', value: $1}, {type: 'comparison', value: $2 + ' ' + $3}, {type: 'unknown', value: []}]; }
  | IDENTIFIER LOGICAL_NOT IN LPAREN commaList { $$ = [{type: 'identifier', value: $1}, {type: 'comparison', value: $2 + ' ' + $3}, $5]; $5.type = 'unknown'; }
  | IDENTIFIER IS { $$ = [{type: 'identifier', value: $1}, {type: 'unknown', value: $2}]; }
  | IDENTIFIER IS IDENTIFIER { $$ = [{type: 'identifier', value: $1}, {type: 'unknown', value: $2 + ' ' + $3}]; }
  | IDENTIFIER IS LOGICAL_NOT { $$ = [{type: 'identifier', value: $1}, {type: 'unknown', value: $2 + ' ' + $3}]; }
  | IDENTIFIER IS LOGICAL_NOT IDENTIFIER { $$ = [{type: 'identifier', value: $1}, {type: 'unknown', value: $2 + ' ' + $3 + ' ' + $4}]; }
  | IDENTIFIER IN { $$ = [{type: 'identifier', value: $1}, {type: 'comparison', value: $2}]; }
  | IDENTIFIER IN LPAREN { $$ = [{type: 'identifier', value: $1}, {type: 'comparison', value: $2}, {type: 'unknown', value: []}]; }
  | IDENTIFIER IN LPAREN commaList { $$ = [{type: 'identifier', value: $1}, {type: 'comparison', value: $2}, $4]; $4.type = 'unknown'; }
  | IDENTIFIER BETWEEN { $$ = [{type: 'identifier', value: $1}, {type: 'comparison', value: $2}, {type: 'unknown', value: []}]; }
  | IDENTIFIER BETWEEN value { $$ = [{type: 'identifier', value: $1}, {type: 'comparison', value: $2}, {type: 'unknown', value: [$3]}]; }
  | IDENTIFIER BETWEEN incompleteValue { $$ = [{type: 'identifier', value: $1}, {type: 'comparison', value: $2}, {type: 'unknown', value: [$3]}]; }
  | IDENTIFIER BETWEEN value IDENTIFIER { $$ = [{type: 'identifier', value: $1}, {type: 'comparison', value: $2}, {type: 'unknown', value: [$3]}]; }
  | IDENTIFIER BETWEEN value LOGICAL_AND { $$ = [{type: 'identifier', value: $1}, {type: 'comparison', value: $2}, {type: 'unknown', value: [$3,null]}]; }
  | IDENTIFIER LOGICAL_NOT BETWEEN { $$ = [{type: 'identifier', value: $1}, {type: 'comparison', value: $2 + ' ' + $3}, {type: 'unknown', value: []}]; }
  | IDENTIFIER LOGICAL_NOT BETWEEN value { $$ = [{type: 'identifier', value: $1}, {type: 'comparison', value: $2 + ' ' + $3}, {type: 'unknown', value: [$4]}]; }
  | IDENTIFIER LOGICAL_NOT BETWEEN incompleteValue { $$ = [{type: 'identifier', value: $1}, {type: 'comparison', value: $2 + ' ' + $3}, {type: 'unknown', value: [$4]}]; }
  | IDENTIFIER LOGICAL_NOT BETWEEN value IDENTIFIER { $$ = [{type: 'identifier', value: $1}, {type: 'comparison', value: $2 + ' ' + $3}, {type: 'unknown', value: [$4]}]; }
  | IDENTIFIER LOGICAL_NOT BETWEEN value LOGICAL_AND { $$ = [{type: 'identifier', value: $1}, {type: 'comparison', value: $2 + ' ' + $3}, {type: 'unknown', value: [$4,null]}]; }
  | IDENTIFIER comparison incompleteValue { $$ = [{type: 'identifier', value: $1}, {type: 'comparison', value: $2}, {type: 'unknown', value: $3}]; }
  | IDENTIFIER BETWEEN value LOGICAL_AND incompleteValue { $$ = [{type: 'identifier', value: $1}, {type: 'comparison', value: 'between'}, {type: 'unknown', value: [$3, $5]}]; }
  | IDENTIFIER LOGICAL_NOT BETWEEN value LOGICAL_AND incompleteValue { $$ = [{type: 'identifier', value: $1}, {type: 'comparison', value: 'not between'}, {type: 'unknown', value: [$4, $6]}]; }
  | LPAREN { $$ = [{type: 'identifier', value: ''}]; }
  | LPAREN expression { $$ = $2; }
  /* end for supporting possible valid queries but incomplete */
  | LPAREN expression RPAREN { $$ = $2 }
  ;

commaList
  : value { $$ = {type: 'value', value: [$1]}; }
  | incompleteValue { $$ = {type: 'unknown', value: [$1]}; }
  | commaList COMMA { $$ = $1; $1.value.push(null); }
  | commaList COMMA value { $$ = $1; $1.value.push($3); }
  | commaList COMMA incompleteValue { $$ = $1; $1.value.push($3);$1.type = 'unknown'; }
  ;

value
  : STRING { $$ = yytext.substr(1, yytext.length - 2) } /* we don't want the wrapping quotes in output */
  | NUMERIC { $$ = Number(yytext) } /* output should return a true number, not a number as a string */
  | TRUE { $$ = true }
  | FALSE { $$ = false }
  | IDENTIFIER {$$ = yytext; }
  ;

incompleteValue
  : INCOMPLETE_STRING { $$ = yytext.substr(1, yytext.length - 1) }
  ;

incompleteComparison
  : INCOMPLETE_CMP_NOTEQUALS { $$ = '!'; }
  ;

comparison
  : CMP_EQUALS { $$ = $1; }
  | CMP_NOTEQUALS { $$ = $1; }
  | CMP_NOTEQUALS_BASIC { $$ = $1; }
  | CMP_GREATER { $$ = $1; }
  | CMP_GREATEROREQUAL { $$ = $1; }
  | CMP_LESS { $$ = $1; }
  | CMP_LESSOREQUAL { $$ = $1; }
  | LIKE { $$ = 'like'; }
  | LOGICAL_NOT LIKE { $$ = 'not like'; },
  ;