import { Grammar } from "../parser";

export const grammar: Grammar = {
    "number": "%d+",
    "name": "[a-zA-Z_][a-zA-Z0-9_]+?",
    "string": "\"([^\"]|(\\\\)|(\\\"))+?\"",
    "bool": "(true)|(false)",
    "add": {
        pattern: "%expr %+ %expr",
        precedence: 5
    },
    "sub": {
        pattern: "%expr - %expr",
        precedence: 5
    },
    "mul": {
        pattern: "%expr * %expr",
        precedence: 6
    },
    "div": {
        pattern: "%expr / %expr",
        precedence: 6
    },
    "concat": {
        pattern: "%expr @ %expr",
        precedence: 1
    },
    "eq": {
        pattern: "%expr = %expr",
        precedence: 4
    },
    "lt": {
        pattern: "%expr < %expr",
        precedence: 4
    },
    "gt": {
        pattern: "%expr > %expr",
        precedence: 4
    },
    "le": {
        pattern: "%expr <= %expr",
        precedence: 4
    },
    "ge": {
        pattern: "%expr >= %expr",
        precedence: 4
    },
    "or": {
        pattern: "%expr %| %expr",
        precedence: 2
    },
    "and": {
        pattern: "%expr & %expr",
        precedence: 3
    },
    "not": "! %expr",
    "arglist": "(%expr( , %expr)+?)?",
    "call": "%name %( %arglist %)",
    "parenthesisexpr": "%( %expr %)",
    "expr": {
        pattern: "%parenthesisexpr|%number|%string|%bool|%name|%add|%sub|%mul|%div|%concat|%eq|%lt|%gt|%le|%ge|%or|%and|%not|%call",
        preservePrecedence: true
    },
    "assign": "%name = %expr;",
    "paramlist": "(%name( , %name)+?)?",
    "if": "if %expr { %body } %else?",
    "else": "else { %body }",
    "while": "while %expr { %body }",
    "function": "fn %name %( %paramlist %) { %body }",
    "return": "ret %expr;",
    "callstat": "%call;",
    "print": "print %expr;",
    "statement": "%assign|%if|%while|%function|%return|%callstat|%print",
    "body": "( %statement )+?",
    "use": "use %name;",
    "imports": "( %use )+?",
    "lib": "lib %name;",
    "root": "%lib? %imports %body"
};