{LazyEvaluator, LE} = require './lazy.coffee'

class LE.If extends LazyEvaluator
    maxArgs: 3
    onEnd: ->
        @return @results[1]

    onArg:(pass)->
        switch @currentArg
            when 1
                unless @results[0]
                    @currentArg++
                pass()
            when 2
                @onEnd() if @results[0]
            when 3
                @onEnd()

class LE.While extends LazyEvaluator
    maxArgs: 2
    onEnd: ->
        @return @results[1]
    onArg:(pass)->
        switch @currentArg
            when 1
                unless @results[0]
                    @onEnd()
                else pass()
            when 2
                @results = []
                @currentArg = 0
                pass()
