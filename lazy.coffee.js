var exports = window;

(function() {
  var LE, LazyEvaluator;
  var __slice = Array.prototype.slice;

  LazyEvaluator = (function() {

    function LazyEvaluator() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      this.args = args;
      this.context = {};
      this.currentArg = 0;
    }

    LazyEvaluator.prototype.contextType = 'global';

    LazyEvaluator.prototype.maxArgs = false;

    LazyEvaluator.prototype.onStart = function() {
      return this.nextArg();
    };

    LazyEvaluator.prototype.onArg = function(pass) {
      return pass();
    };

    LazyEvaluator.prototype.onEnd = function() {
      return this["return"](this.results);
    };

    LazyEvaluator.prototype.nextArg = function() {
      var arg;
      var _this = this;
      if (this.currentArg >= this.args.length || (this.maxArgs !== false && this.currentArg >= this.maxArgs)) {
        return this.onEnd();
      } else {
        arg = this.args[this.currentArg];
        this.currentArg++;
        arg.passContext(this.context);
        return arg.eval(function(result) {
          _this.results.push(result);
          return _this.onArg(function() {
            return _this.nextArg();
          });
        });
      }
    };

    LazyEvaluator.prototype.passContext = function(context) {
      var Ctx;
      if (this.contextType === 'local') {
        Ctx = function() {};
        Ctx.prototype = context;
        return this.context = new Ctx;
      } else {
        return this.context = context;
      }
    };

    LazyEvaluator.prototype.eval = function(ret) {
      this["return"] = ret;
      this.results = [];
      this.currentArg = 0;
      return this.onStart();
    };

    return LazyEvaluator;

  })();

  LE = {};

  LazyEvaluator.buildFromAst = function(ast) {
    var arg, func, result;
    if (Array.isArray(ast)) {
      func = ast.shift();
      if (LE[func] != null) {
        result = new LE[func];
        result.args = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = ast.length; _i < _len; _i++) {
            arg = ast[_i];
            _results.push(LazyEvaluator.buildFromAst(arg));
          }
          return _results;
        })();
      } else {
        throw 'shit';
      }
    } else {
      result = new LE.Constant(ast);
    }
    return result;
  };

  exports.LazyEvaluator = LazyEvaluator;

  exports.LE = LE;

}).call(this);
(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  LE.Constant = (function() {

    __extends(Constant, LazyEvaluator);

    function Constant() {
      Constant.__super__.constructor.apply(this, arguments);
    }

    Constant.prototype.onStart = function() {
      return this["return"](this.args[0]);
    };

    return Constant;

  })();

  LE.Set = (function() {

    __extends(Set, LazyEvaluator);

    function Set() {
      Set.__super__.constructor.apply(this, arguments);
    }

    Set.prototype.maxArgs = 2;

    Set.prototype.onEnd = function() {
      var name, value, _ref;
      _ref = this.results, name = _ref[0], value = _ref[1];
      this.context[name] = value;
      return this["return"](value);
    };

    return Set;

  })();

  LE.Get = (function() {

    __extends(Get, LazyEvaluator);

    function Get() {
      Get.__super__.constructor.apply(this, arguments);
    }

    Get.prototype.maxArgs = 1;

    Get.prototype.onEnd = function() {
      var name;
      name = this.results[0];
      return this["return"](this.context[name]);
    };

    return Get;

  })();

  LE.Program = (function() {

    __extends(Program, LazyEvaluator);

    function Program() {
      Program.__super__.constructor.apply(this, arguments);
    }

    return Program;

  })();

  LE.Block = (function() {

    __extends(Block, LazyEvaluator);

    function Block() {
      Block.__super__.constructor.apply(this, arguments);
    }

    Block.prototype.contextType = 'local';

    return Block;

  })();

  LE.Group = (function() {

    __extends(Group, LazyEvaluator);

    function Group() {
      Group.__super__.constructor.apply(this, arguments);
    }

    Group.prototype.contextType = 'global';

    return Group;

  })();

}).call(this);
(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  LE.Plus = (function() {

    __extends(Plus, LazyEvaluator);

    function Plus() {
      Plus.__super__.constructor.apply(this, arguments);
    }

    Plus.prototype.onEnd = function() {
      var res, sum, _i, _len, _ref;
      sum = 0;
      _ref = this.results;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        res = _ref[_i];
        sum += res;
      }
      return this["return"](sum);
    };

    return Plus;

  })();

  LE.Minus = (function() {

    __extends(Minus, LazyEvaluator);

    function Minus() {
      Minus.__super__.constructor.apply(this, arguments);
    }

    Minus.prototype.maxArgs = 2;

    Minus.prototype.onEnd = function() {
      return this["return"](this.results[0] - this.results[1]);
    };

    return Minus;

  })();

  LE.Divide = (function() {

    __extends(Divide, LazyEvaluator);

    function Divide() {
      Divide.__super__.constructor.apply(this, arguments);
    }

    Divide.prototype.maxArgs = 2;

    Divide.prototype.onEnd = function() {
      return this["return"](this.results[0] / this.results[1]);
    };

    return Divide;

  })();

  LE.Multiply = (function() {

    __extends(Multiply, LazyEvaluator);

    function Multiply() {
      Multiply.__super__.constructor.apply(this, arguments);
    }

    Multiply.prototype.onEnd = function() {
      var prod, res, _i, _len, _ref;
      prod = this.results[0];
      _ref = this.results.slice(1);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        res = _ref[_i];
        prod *= res;
      }
      return this["return"](prod);
    };

    Multiply.prototype.onArg = function(pass) {
      if (this.results[this.currentArg - 1] === 0) {
        return this["return"](0);
      } else {
        return pass();
      }
    };

    return Multiply;

  })();

  LE.Gt = (function() {

    __extends(Gt, LazyEvaluator);

    function Gt() {
      Gt.__super__.constructor.apply(this, arguments);
    }

    Gt.prototype.maxArgs = 2;

    Gt.prototype.onEnd = function() {
      return this["return"](this.results[0] > this.results[1]);
    };

    return Gt;

  })();

  LE.Ge = (function() {

    __extends(Ge, LazyEvaluator);

    function Ge() {
      Ge.__super__.constructor.apply(this, arguments);
    }

    Ge.prototype.maxArgs = 2;

    Ge.prototype.onEnd = function() {
      return this["return"](this.results[0] >= this.results[1]);
    };

    return Ge;

  })();

  LE.Lt = (function() {

    __extends(Lt, LazyEvaluator);

    function Lt() {
      Lt.__super__.constructor.apply(this, arguments);
    }

    Lt.prototype.maxArgs = 2;

    Lt.prototype.onEnd = function() {
      return this["return"](this.results[0] < this.results[1]);
    };

    return Lt;

  })();

  LE.Le = (function() {

    __extends(Le, LazyEvaluator);

    function Le() {
      Le.__super__.constructor.apply(this, arguments);
    }

    Le.prototype.maxArgs = 2;

    Le.prototype.onEnd = function() {
      return this["return"](this.results[0] <= this.results[1]);
    };

    return Le;

  })();

  LE.Not = (function() {

    __extends(Not, LazyEvaluator);

    function Not() {
      Not.__super__.constructor.apply(this, arguments);
    }

    Not.prototype.maxArgs = 1;

    Not.prototype.onEnd = function() {
      return this["return"](!this.results[0]);
    };

    return Not;

  })();

}).call(this);
(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  LE.If = (function() {

    __extends(If, LazyEvaluator);

    function If() {
      If.__super__.constructor.apply(this, arguments);
    }

    If.prototype.maxArgs = 3;

    If.prototype.onEnd = function() {
      return this["return"](this.results[1]);
    };

    If.prototype.onArg = function(pass) {
      switch (this.currentArg) {
        case 1:
          if (!this.results[0]) this.currentArg++;
          return pass();
        case 2:
          if (this.results[0]) return this.onEnd();
          break;
        case 3:
          return this.onEnd();
      }
    };

    return If;

  })();

  LE.While = (function() {

    __extends(While, LazyEvaluator);

    function While() {
      While.__super__.constructor.apply(this, arguments);
    }

    While.prototype.maxArgs = 2;

    While.prototype.onEnd = function() {
      return this["return"](this.results[1]);
    };

    While.prototype.onArg = function(pass) {
      switch (this.currentArg) {
        case 1:
          if (!this.results[0]) {
            return this.onEnd();
          } else {
            return pass();
          }
          break;
        case 2:
          this.results = [];
          this.currentArg = 0;
          return pass();
      }
    };

    return While;

  })();

}).call(this);
(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  LE.IsError = (function() {

    __extends(IsError, LazyEvaluator);

    function IsError() {
      IsError.__super__.constructor.apply(this, arguments);
    }

    IsError.prototype.maxArgs = 1;

    IsError.prototype.onEnd = function() {
      return this["return"](this.results[0] instanceof Error);
    };

    return IsError;

  })();

  LE.Show = (function() {

    __extends(Show, LazyEvaluator);

    function Show() {
      Show.__super__.constructor.apply(this, arguments);
    }

    Show.prototype.onEnd = function() {
      console.log.apply(console, this.results);
      return this["return"](null);
    };

    return Show;

  })();

  LE.Sleep = (function() {

    __extends(Sleep, LazyEvaluator);

    function Sleep() {
      Sleep.__super__.constructor.apply(this, arguments);
    }

    Sleep.prototype.maxArgs = 1;

    Sleep.prototype.onEnd = function() {
      var _this = this;
      return setTimeout((function() {
        return _this["return"](null);
      }), this.results[0]);
    };

    return Sleep;

  })();

}).call(this);
(function() {

  /*
  Call synchronous external function
  */

  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; }, __slice = Array.prototype.slice;

  LE.CallSync = (function() {

    __extends(CallSync, LazyEvaluator);

    function CallSync() {
      CallSync.__super__.constructor.apply(this, arguments);
    }

    CallSync.prototype.onEnd = function() {
      var func, funcArgs, res, _ref;
      _ref = this.results, func = _ref[0], funcArgs = 2 <= _ref.length ? __slice.call(_ref, 1) : [];
      res = ((function() {
        try {
          return func.apply(this, funcArgs);
        } catch (e) {
          if (typeof e === 'string') {
            return new Error(e);
          } else {
            return e;
          }
        }
      }).call(this));
      return this["return"](res);
    };

    return CallSync;

  })();

  /*
  Call asynchronous external function
  */

  LE.Call = (function() {

    __extends(Call, LazyEvaluator);

    function Call() {
      Call.__super__.constructor.apply(this, arguments);
    }

    Call.prototype.onEnd = function() {
      var func, funcArgs, _ref;
      _ref = this.results, func = _ref[0], funcArgs = 2 <= _ref.length ? __slice.call(_ref, 1) : [];
      funcArgs.push(this["return"]);
      try {
        return func.apply(this, funcArgs);
      } catch (e) {
        if (typeof e === 'string') {
          return this["return"](new Error(e));
        } else {
          return this["return"](e);
        }
      }
    };

    return Call;

  })();

}).call(this);
