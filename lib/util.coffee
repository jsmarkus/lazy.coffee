{LazyEvaluator, LE} = require './lazy.coffee'

class LE.Show extends LazyEvaluator
    onEnd: ->
        console.log.apply console, @results 
        @return null


class LE.Sleep extends LazyEvaluator
    maxArgs: 1
    onEnd: -> setTimeout (()=>@return null), @results[0]
