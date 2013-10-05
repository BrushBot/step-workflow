var debug0 = true ;
var debug1 = false ;
var debug2 = false ;

var toClass = {}.toString ;
function forEachIn(object, action) {
  for (var property in object) {
    if (Object.prototype.hasOwnProperty.call(object, property))
      action(property, object[property]);
  }
};
function mixInto(object, mixIn) {
  forEachIn(mixIn, function(name, value) {
    object[name] = value;
  });
};
function clone(object) {
  function OneShotConstructor(){}
  OneShotConstructor.prototype = object;
  return new OneShotConstructor();
};
//Object.prototype.hasPrototype = function(prototype1) {
function hasPrototype(prototype1, object) {
  function DummyConstructor() {} ;
  DummyConstructor.prototype = prototype1;
  //return(this instanceof DummyConstructor);
  return(object instanceof DummyConstructor);
};
//Object.prototype.extend = function(properties) {
function extend(properties, object) {
  //var result = clone(this);
  var result = clone(object);
  forEachIn(properties, function(name, value) {
    result[name] = value;
  });
  return result;
};
//Object.prototype.create = function() {
//function createObj(objectArg, arguments) {
function createObj() {
  //var object = clone(this);
  var args = [] ;
  Array.prototype.push.apply( args, arguments ) ;
  var objectArg = args.shift() ;
  var object = clone(objectArg);
  if (typeof object.construct == "function")
    //object.construct.apply(object, arguments);
    object.construct.apply(object, args);
  return object;
};


//




// Elem

    var ObjParent = { construct: function() { this['_created'] = 1 ; },
      create: function() {
        return( createObj(this, arguments) );
      },
      extend: function(properties) {
        return( extend(properties, this) );
      },
    } ;
    var Elem = ObjParent.extend({
      construct: function(argObj) {
        if (isDef(argObj)) {//if ("Arguments" == typeof(argObj)) argObj = argObj[0];
          var argClass = toClass.call(argObj) ;
          if ( ( "[object Arguments]" == toClass.call(argObj) ) && argObj[0]){
            argObj = argObj[0] ;
          }
          this['argObj'] = argObj ;
          var thisElem = this ;
          ['tag', 'class1', 'id', 'attribs',].every(function(el){
            if ( isDef(argObj[el])) {
              thisElem[el] = argObj[el] ;
            // } else if ( isDef(argObj[0][el])) {
              // thisElem[el] = argObj[0][el] ;
            }
            return(true) ;
          }) ;
        }
      }, //obj
      getVal: function() {
        return('') ;
      },
      write: function(content) {
        debug1 && ( console.log( "Elem.write\n" ) );
        var txt = '<' + this.getTag() ;
        var idx = '' ;
        if ( this.class1 ) {
          txt += ' class="' + this.class1 + '"' ;
          if ( this.id ) {
            idx = this.class1 + '_' + this.id ;
            txt += ' id="' + idx + '"' ;
            var attribs1 = this.getAttribs() ;
            for(var key in attribs1) {
              txt += ' ' + key + '="' + attribs1[key] + '"' ;
            }
          }
        }
        if ( this.getVal() ) {
          content = this.getVal() + content ;
        }
        txt += '>' + content + '</' + this.getTag() + '>' ;
        return(txt) ;
      },
      getTag: function() {
        if ( !this.tag ) {
          this.tag = 'div' ;
        }
        return( this.tag ) ;
      },
      getAttribs: function() {
        return(this.attribs) ;
      },
    }) ;
    
    

// InputElem

    var InputElem = Elem.extend({
      getTag: function() {
        orSet(this, 'tag', 'input') ;
        return( this.tag ) ;
      },
      getAttribs: function() {
        this.attribs = this.attribs || {} ;
        if ( this.class1 && this.id ) {
          orSet( this.attribs, 'name', this.class1 + '_' + this.id ) ;
        }
        return( this.attribs ) ;
      },
    }) ;


    
// TextInputElem

    var TextInputElem = InputElem.extend({
      getTag: function() {
        orSet(this, 'rows', '1') ;
        if ( this.rows > 1 ) {
          orSet( this, 'tag', 'textarea' ) ;
        } else {
          orSet( this, 'tag', 'input' ) ;
          orSet( this, 'attribs', {} ) ;
          orSet( this.attribs, 'type', 'text' ) ;
        }
        return( this.tag ) ;
      },
      getAttribs: function() {
        this.attribs = this.attribs || {} ;
        if ( this.class1 && this.id ) {
          orSet( this.attribs, 'name', this.class1 + '_' + this.id ) ;
        }
        return( this.attribs ) ;
      },
    }) ;
    
    
    
// StepElem

    var StepElem = Elem.extend({
      construct: function(argObj) { // include a 'step' key or 'id' or 'stepId'
        if (isDef(argObj)) {
          // if (argObj instanceof Arguments) {
            // alert("instanceof Arguments") ;
            // if ("Arguments" == typeof(argObj)) argObj = argObj[0];
          // }
          if ( ( "[object Arguments]" == toClass.call(argObj) ) && argObj[0]){
            argObj = argObj[0] ;
          }
          debug1 && ( console.log( "StepElem(argObj) argObj ante: " + debugObj(argObj) ) );
          orSet(argObj, 'class1', 'stepDiv') ;
          debug1 && ( console.log( "StepElem(argObj) argObj post: " + debugObj(argObj) ) );
        }
        Elem.construct.call(this, argObj) ;
        if (isDef(argObj)) {
          var thisElem = this ;
          ['step', 'id', 'stepId',].every(function(el){
            //if ( typeof(argObj[el]) != "undefined" ) {
            if ( isDef(argObj[el])) {
              thisElem[el] = argObj[el] ;
            }
            return(true) ;
          }) ;
          if (unDef(this.step)) {
            if (unDef(this.id)){
              this.id = argObj['stepId'] ;
            }
            this.step = stepSet.byId[this.id] ;
          } else if (unDef(this.id)) {
            this.id = this.step.id ;
          }
        }
        //return(this) ;
      },
      write: function(content) {
        var txt ;
        if ( unDef(content) ) {
          content = '' ;
        }
        debug1 && ( console.log( "StepElem.write this.id " + this.id) );
        debug1 && ( console.log( "StepElem.write this: " + debugObj(this) ) );
        var thisElem = this ;
        if ( stepSet.depth < stepSet.maxDepth ) {
          stepSet.depth += 1 ;
          var elemStruct = getStepConfig() ;
          //debug1 && ( console.log( "getStepConfig(): " + debugObj(elemStruct) ) );
          elemStruct = elemStruct['elemStruct'] ;
          //debug1 && ( console.log( "elemStruct: " + debugObj(elemStruct) ) );
          debug1 && ( console.log( "this.class1: " + this.class1 ) );
          elemStruct = elemStruct[this.class1] ;
          debug2 && ( console.log( "elemStruct: " + debugObj(elemStruct) ) );
          
          try {
          if ( elemStruct && isDef(elemStruct) ) {
            debug1 && ( console.log( "StepElem.write subs: " + elemStruct.length ) );
            elemStruct.every(function(el, index){
              debug1 && ( console.log( "StepElem.write subs index " + index ) );
              debug1 && (console.log( "StepElem.write this.id " + thisElem.id + " " + el ) ); // BREAKPOINT
              var elemMakerArgs = {
                'step': thisElem.step,
                'class1': el,
              } ;
              debug2 && ( console.log("elemMakerArgs: " + debugObj(elemMakerArgs)) ) ;
              var subStepElem ;
              try {
                subStepElem = elemMaker(elemMakerArgs) ;
              } catch (e) {
                console.log( "StepElem.write exception with elemMaker for el "+el+": " + e ) ;
                throw(e) ;
              }
              // content += subStepElem.write() ;
              try {
                content += subStepElem.write() ;
              } catch (e) {
                console.log( "StepElem.write exception with subStepElem.write for el "+el+": " + e ) ;
                throw(e) ;
              }
              return(true) ;
            }) ;
          }
          } catch (e) {
            console.log( "StepElem.write exception: " + e ) ;
            throw(e) ;
          }
          debug1 && (console.log("StepElem.write this.prototype")) ; // BREAKPOINT
          //txt = thisElem.writeParent(content) ;
          // txt = StepElem.constructor.write.call(this, content) ;
          txt = Elem.write.call(this, content) ;
          
          stepSet.depth -= 1 ;
        } else {
          console.log( "StepElem.write Error: Recursion past maxDepth ("+stepSet.maxDepth+").") ;
        }
        return( txt ) ;
      },
      getStat: function() {
        var stat ;
        // var step = stepSet.byId(this.id) ;
        var step = this.step ;
        if ( isDef(step.fail) ) {
          stat = 'Failed' ;
        } else if ( isDef(step.skip) ) {
          stat = 'Skipped' ;
        } else if ( isDef(step.subsDone) ) {
          stat = 'SubsDone' ;
        } else if ( isDef(step.done) ) {
          stat = 'Done' ;
        } else {
          stat = 'Open' ;
        }
        return(stat) ;
      },
      getCheck: function(whichCheck) {
        whichCheck.replace(/^step/g,'') ;
        var step = stepSet.byId[this.id] ;
        return(step[whichCheck.toLowerCase()]) ;
      },
    }) ;



// StepSubsElem

    var StepSubsElem = StepElem.extend({
      write: function(content) {
        var txt ;
        content = content || '' ;
        var thisElem = this ;
        try {
        debug1 && ( console.log( "StepSubsElem.write this.id " + this.id ) );
        debug1 && ( console.log( "StepSubsElem.write this.prototype " + this.prototype ) );
        debug1 && ( console.log( "StepSubsElem.write this " + debugObj(this) ) );
        //console.log( "StepSubsElem.write this.prototype.constructor " + this.prototype.constructor ) ;
        //var step = stepSet.byId[this.id) ;
        if ( stepSet.depth < stepSet.maxDepth ) {
          stepSet.depth += 1 ;
          var step = this.step ;
          if ( step.subs ) {
            debug1 && (console.log( "StepSubsElem.write subs: " + step.subs.length ) );
            step.subs.every(function(el,index){
              debug1 && (console.log( "StepSubsElem.write subs index " + index ) );
              var subStepElem ;
              try {
                subStepElem = elemMaker({'step': el, 'class1': 'stepDiv'}) ;
              } catch (e) {
                console.log( "StepSubsElem.write exception in elemMaker for el "+el+": " + e + "\n  subStepElem: " + debugObj(subStepElem)) ;
                throw(e) ;
              }
              // content += subStepElem.write() ;
              try {
                content += subStepElem.write() ;
              } catch (e) {
                console.log( "StepSubsElem.write exception in subStepElem.write for el "+el+": " + e + "\n  step: " + debugObj(el)+ "\n  subStepElem: " + debugObj(subStepElem) ) ;
                throw(e) ;
              }
              return(true) ;
            }) ;
          }
          //txt = thisElem.writeParent(content) ;
          // txt = SubStepElem.constructor.write.call(this, content) ;
          txt = StepElem.write.call(this, content) ;
          stepSet.depth -= 1 ;
        } else {
          console.log( "StepSubElem.write Error: Recursion past maxDepth ("+stepSet.maxDepth+").") ;
        }
        } catch (e) {
          console.log( "StepSubsElem.write exception in subStepElem.write: " + e + "\n  this: " + debugObj(this) ) ;
          throw(e) ;
        }
        return( txt ) ;
      },
    }) ;
    

    
// StepValElem

    var StepValElem = StepElem.extend({
      getVal: function(step) {
        //step || ( step = this.step ) ;
        step = step || this.step ; // BREAKPOINT
        orSet(this, 'valField', 'val') ;
        if ( isDef( step[this.valField] ) ) {
          return( step[this.valField] ) ;
        }
        return( '' ) ;
      },
    }) ;
    

    
// StepSumElem

    var StepSumElem = StepValElem.extend({
      construct: function(argObj) {
        if ( ( "[object Arguments]" == toClass.call(argObj) ) && argObj[0]){
          argObj = argObj[0] ;
        }
        StepValElem.construct.call(this, argObj) ;
        this.valField = 'sum' ;
      },
    }) ;
    
    
    
// StepDescElem

    var StepDescElem = StepValElem.extend({
      construct: function(argObj) {
        if ( ( "[object Arguments]" == toClass.call(argObj) ) && argObj[0]){
          argObj = argObj[0] ;
        }
        StepValElem.construct.call(this, argObj) ;
        this.valField = 'desc' ;
        //return(this) ;
      }
    }) ;
    

    
// StepNumElem

    var StepNumElem = StepValElem.extend({
      construct: function(argObj) {
        if ( ( "[object Arguments]" == toClass.call(argObj) ) && argObj[0]){
          argObj = argObj[0] ;
        }
        StepValElem.construct.call(this, argObj) ;
        this.valField = 'num' ;
      }
    }) ;
    
    

// StepStatElem

    var StepStatElem = StepElem.extend({
      getVal: function(step) {
        return( this.getStat() ) ;
      },
    }) ;
    

    
// StepCheckElem

    var StepCheckElem = StepElem.extend({
      getTag: InputElem.getTag,
      getAttribsParent: InputElem.getAttribs,
      getAttribs: function() {
        var attribs = StepCheckElem.getAttribsParent.call(this) ;
        attribs.type = 'checkbox' ;
        attribs.value = this.getVal() ;
        if ( this.getCheck( this.class1 ) ) {
          attribs.checked = 1 ;
        }
        return(attribs) ;
      },
      getVal: function(step) {
        // //step || ( step = this.step ) ;
        // step = step || this.step ;
        // if ( isDef( step[this.label] ) ) {
          // return( step[this.label] ) ;
        // }
        if ( isDef( this.label ) ) {
          return( this.label ) ;
        }
        return( '' ) ;
      },
    }) ;
    
    
    
// StepDoneElem

    var StepDoneElem = StepCheckElem.extend({
      construct: function(argObj) {
        if ( ( "[object Arguments]" == toClass.call(argObj) ) && argObj[0]){
          argObj = argObj[0] ;
        }
        StepCheckElem.construct.call(this, argObj) ;
        this.label = 'Done' ;
        //return(this) ;
      },
    }) ;
    
    
    
// StepSkipElem

    var StepSkipElem = StepCheckElem.extend({
      construct: function(argObj) {
        if ( ( "[object Arguments]" == toClass.call(argObj) ) && argObj[0]){
          argObj = argObj[0] ;
        }
        StepCheckElem.construct.call(this, argObj) ;
        this.label = 'Skip' ;
        //return(this) ;
      },
    }) ;
    
    
    
// StepFailElem

    var StepFailElem = StepCheckElem.extend({
      construct: function(argObj) {
        if ( ( "[object Arguments]" == toClass.call(argObj) ) && argObj[0]){
          argObj = argObj[0] ;
        }
        StepCheckElem.construct.call(this, argObj) ;
        this.label = 'Fail' ;
        //return(this) ;
      },
    }) ;
    
// 


//


// 

var defaultStepConfig = {
  elemStruct: {
    'stepDiv': ['stepLeft', 'stepBody', 'stepFoot'],
    'stepBody': ['stepSum', 'stepDesc', 'stepData', 'stepSubs'],
    'stepLeft': ['stepNum', 'stepStat', 'stepChecks'],
    'stepChecks': ['stepDoneWrap', 'stepSkipWrap', 'stepFailWrap'],
    'stepDoneWrap': ['stepDone'],
    'stepSkipWrap': ['stepSkip'],
    'stepFailWrap': ['stepFail'],
  },
} ;
function getStepConfig() {
  if (unDef(stepSet['stepConfig'])) {
    debug1 && ( console.log( "getStepConfig did not find it in stepSet." ) );
    if (unDef(stepConfig)) {
      alert("Found no stepConfig.  Using defaultStepConfig.") ;
      stepSet.stepConfig = defaultStepConfig ;
    }
    stepSet.stepConfig = stepConfig ;
  } else {
    debug1 && ( console.log( "getStepConfig found it in stepSet." ) );
  }
  return(stepSet.stepConfig) ;
} ;


//


function arrowToggle() {
} ;
function debugObj(obj) {
  var msg = '' ;
  //$("#stepsHead").append("debugObj<br />") ;
  for(var key in obj) {
    msg = msg + "key " + key + " val q{"+obj[key]+"}.\n" ;
  }
  //$("#stepsHead").append("debugObj end msg=q{"+escapeHtml(msg)+"}<br />") ;
  // alert(msg) ;
  //$("#step2_note textarea").val($("#step2_note textarea").val() + escapeHtml(msg) + "\n") ;
  return( msg ) ;
} ;
function elemMaker(argObj){
  debug2 && ( console.log("elemMaker: " + debugObj(argObj)) ) ;
  if (isDef(argObj.step)){
    var map = {
      //'stepDiv': 'StepElem',
      'stepDiv': StepElem,
      // 'stepSubs': 'StepSubsElem',
      // 'stepNum': 'StepNumElem',
      // 'stepSum': 'StepSumElem',
      // 'stepDesc': 'StepDescElem',
      // 'stepStat': 'StepStatElem',
    } ;
    if (isDef(map[argObj.class1])) {
      // // return( new map[argObj.class1](argObj) ) ;
      //var function1 = eval(map[argObj.class1]) ;
      //return( new function1(argObj) ) ;
      return( map[argObj.class1].create(argObj) ) ;
    } else {
      var transform1 = argObj.class1 ;
      debug1 && ( console.log("elemMaker ante: " + transform1 ) );
      transform1 = transform1.replace(/^s/, 'S') ;
      transform1 = transform1.replace(/$/, 'Elem') ;
      debug1 && ( console.log("elemMaker post: " + transform1 ) );
      try {
        var function1 = eval(transform1) ;
        //if ("function" == typeof(function1)){
        if (isDef(function1)){
          //return( new function1(argObj) ) ;
          //var evalStr = "new " + transform1 + "(argObj)" ; return( eval(evalStr) ) ;
          var evalStr = transform1 + ".create(argObj)" ; return( eval(evalStr) ) ;
        } else {
          //return( new StepElem(argObj) ) ;
          return( StepElem.create(argObj) ) ;
        }
      } catch (e) {
        //return( new StepElem(argObj) ) ;
        return( StepElem.create(argObj) ) ;
      }
    }
  } else if (argObj.tag == 'input') {
    //return( new InputElem(argObj) ) ;
    return( InputElem.create(argObj) ) ;
  } else {
    //return( new Elem(argObj) ) ;
    return( Elem.create(argObj) ) ;
  }
}
function isDef(var1) {
  return(!unDef(var1)) ;
}
function numAlpha(positiveInt) {
  var txt = '' ;
  while ( positiveInt > 26 ) {
    txt += 'z' ;
    positiveInt = positiveInt - 26 ;
  }
  txt += String.fromCharCode( positiveInt + 97 ) ;
  return(txt) ;
}
function orSet( obj, field, defaultVal ) {
  //if ( typeof(var1) == "undefined" ) {
  if ( unDef(obj[field]) ) {
    debug1 && ( console.log( "orSet, setting to default " + defaultVal ) );
    obj[field] = defaultVal ;
  }
}
function orSet_old( var1, defaultVal ) {
  //if ( typeof(var1) == "undefined" ) {
  if ( unDef(var1) ) {
    debug1 && ( console.log( "orSet_old, setting to default " + defaultVal ) );

    var1 = defaultVal ;
  }
}
function saveIt() {
  var fail ;
  try {
    var isFileSaverSupported = !!new Blob();
  } catch (e) {
    alert("Failed to construct blob in this browser.") ;
    fail = 1 ;
  }
  if(!fail) {
  var elem1 = $('html') ;
  var txt = $('html').val() ;
  txt = (new XMLSerializer).serializeToString(document) ;
  var blob = new Blob([txt], {type: "text/html;charset=utf-8"});
  saveAs(blob, "testSave.html");
  //var blob = bb.getBlob("application/xhtml+xml;charset=" + document.characterSet);
  }
  console.log("Snart") ;
}
function unDef(var1) {
  if ( typeof(var1) == "undefined" ) {
    return( true ) ;
  } else {
    return( false ) ;
  }
}
function writeSteps(steps1) {
  try {
  stepSet.init(steps1) ;
  } catch (e) {
    console.log( "writeSteps exception in stepSet.init: " + e + "\n  debugged: " + debugObj(e) ) ;
  }
  var stepElem1 ;
  try {
    //stepElem1 = new StepElem({step: steps1}) ;
    stepElem1 = StepElem.create({step: steps1}) ;
  } catch (e) {
    console.log( "writeSteps exception in new StepElem: " + e + "\n  debugged: " + debugObj(e) ) ;
  }
  var txt ;
  try {
    txt = stepElem1.write() ;
  } catch (e) {
    console.log( "writeSteps exception in stepElem1.write: " + e + "\n  debugged: " + debugObj(e) ) ;
  }
  try {
    $("#stepsDiv").append(txt) ;
  } catch (e) {
    console.log( "writeSteps exception in $('#stepsDiv').append: " + e + "\n  debugged: " + debugObj(e) ) ;
  }
  $("body").append('<a href="javascript:void(0)" onclick="saveIt()">Save It</a>') ;
}


//


var stepSet = {
  byId: {}, // contains steps
  depth: 0,
  getParent: function(id){
    var parentStep ;
    var parentId = this.parent[id] ;
    if (isDef(parentId)) {
      parentStep = this.byId[parentId] ;
    }
    return( parentStep )
  },
  init: function(step, parentStep) {
    var thisStepSet = this ;
    // step.id = this.newId(step) ;
    this.newId(step) ; // sets step.id if not already
    this.byId[step.id] = step ;
    // if ( !typeof(parentStep) == "undefined") {
    if ( isDef(parentStep) ) {
      this.getParent[step.id] = parent.id ;
      parentStep
    }
    if (isDef(step.subs)){
      step.subs.every(function(el){
        thisStepSet.init(el, step) ;
        return(true) ;
      }) ;
    }
    if (unDef(step.num)) {
      if ( isDef(parentStep) ) {
        if (unDef(step._num)) {
          if (unDef(thisStepSet.nextNum[step.id])) {
            thisStepSet.nextNum[step.id] = 1 ;
          }
          step._num = thisStepSet.nextNum[step.id] ;
          thisStepSet.nextNum[step.id] += 1 ;
        }
        step.num = '' ;
        if ( isDef(parentStep.num) ) {
          step.num += parentStep.num + '.' ;
        }
        if ( parentStep.type == 'parallel' ) {
          step.num += numAlpha(step._num) ;
        } else {
          step.num += step._num ;
        }
      }
    }
  },
  maxDepth: 20,
  maxId: 0,
  newId: function(step) {
    var id1 ;
    // if ( typeof(step.id) == "undefined" ) {
    if ( unDef(step.id) ) {
      id1 = this.maxId + 1 ;
      this.maxId = id1 ;
      step.id = id1 ;
    } else {
      id1 = step.id ;
      if ( id1 > this.maxId ) {
        this.maxId = id1 ;
      }
    }
    return( id1 ) ;
  },
  nextNum: {}, //next num for auto-numbering (1.1, 1.2, 1.3, ...)
  openKids: {}, // openKids[stepId][kidId] = 1 ; delete(openKids[stepId][kidId]); when ready.
  parent: {}, // contains ids
} ;
// var stepDo = {
  // writeSteps: function(steps1) {
  // },
  // init: function(steps1) {
    
  // },
// } ;
