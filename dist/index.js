"use strict";

var _input_table = _interopRequireDefault(require("./render/input_table"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

alert("hmm");

var Main =
/*#__PURE__*/
function () {
  function Main() {
    _classCallCheck(this, Main);
  }

  _createClass(Main, [{
    key: "start",
    value: function start() {
      var input = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      if (input == null) throw InvalidOJSONError("Invalid JSON received"); //Initialize color manager with array of names of given namespaces

      var colorManager = new ColorManager(Object.keys(input.namespaces)); //Draw a small table for me to see the input

      (0, _input_table.default)(input, colorManager); // //Parse JSON-obj to my own objs I can then render
      // const dataManager = new NetworkDataManager(input);
      //
      // //render
      // const render = new SVGBuilder(
      //     dataManager.getNSForSVG(),
      //     dataManager.getInterfacesForSVG(),
      //     dataManager.getLinksForSVG(),
      //     colorManager
      // );
      // render.start();
    }
  }]);

  return Main;
}();

var main = new Main();
/*
 * Getting the JSON input
 * */

var handleFileSelect = function handleFileSelect(evt) {
  var files = evt.target.files,
      f = files[0],
      fr = new FileReader();

  var receiveText = function receiveText(e) {
    return main.start(JSON.parse(e.target.result));
  };

  fr.onload = receiveText;
  fr.readAsText(f);
};

document.getElementById('files').addEventListener('change', handleFileSelect, false);

var InvalidOJSONError =
/*#__PURE__*/
function (_Error) {
  _inherits(InvalidOJSONError, _Error);

  function InvalidOJSONError(message) {
    var _this;

    _classCallCheck(this, InvalidOJSONError);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(InvalidOJSONError).call(this, message));
    _this.message = message;
    _this.name = 'InvalidJSON';
    return _this;
  }

  return InvalidOJSONError;
}(_wrapNativeSuper(Error));

setTimeout(example, 100);
/*-----------------*/