# lazy.coffee

lazy.coffee is an attempt to write a simple and expressive OOP library
to build custom languge interpreters.

It is an automate to run AST - an Abstract Syntax Tree, and it
may be used with language parsers to build language interpreters
written in coffeescript or javascript.

Special attention is paid to asynchronous nature of lazy.coffee.
It allows sleep() function as well as it will allow networking
or database operations written in easy-to-maintain synchronous style.

# Why

1. Just for fun
2. To simplify some complicated asyncronous tasks just like using Differed
but in more geeky way ;)