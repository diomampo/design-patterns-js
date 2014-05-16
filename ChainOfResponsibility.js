/**
 * Chain of Responsibility
 *
 * In the following scenario someone (unknown)
 * is making a Vacation Request. And someone 
 * is making a Raise Request. In order to
 * get either request approved, it must go through
 * the proper Chain of Command (Responsibility).
 * 
 * The way I think of using this pattern is when there
 * is a workflow which might involve a series of actions
 * to occur on an object in some hiearchical order. 
 * 
 * Event bubbling comes to mind. When an Event is bubbled
 * it is dispatched from a child, and can be redispatched
 * or stopped by a parent. And so on and so forth.
 *
 */

var ChainOfResponsibilityModule = (function(){

  /**
   * Since we are dealing with different types of
   * Requests, we provide some constants for easier
   * (reusable) checking.
   */
  var RequestTypes = RequestTypes || {};
  RequestTypes.VACATION = "Vacation";
  RequestTypes.RAISE = "Raise";

  var RequestStatuses = RequestStatuses || {};
  RequestStatuses.PENDING = "Pending";
  RequestStatuses.APPROVED = "Approved";
  RequestStatuses.DENIED = "Denied";

  /**
   * Handler serves as the base class for all objects 
   * included in the Chain of Responsibility. Subclasses
   * should override the handleInput method accordingly
   */
  function Handler() {
    var _successor;

    this.getSuccessor = function() {
      return _successor;
    };
    this.setSuccessor = function(successor) {
      _successor = successor;
    };

    this.handleInput = function(request) {
      alert('SUPER::handleInput');
    };
  }

  /**
   * Manager is a subclass of Handler. A Manager
   * can approve of Vacation Requests, but not
   * a Raise Request.
   */
  function Manager() {
    this.handleInput = function(request) {
      if(request.type === RequestTypes.VACATION) {
        alert('Manager::handleInput ' + JSON.stringify(request));
      }
      else if(this.getSuccessor() !== 'undefined') {
        this.getSuccessor().handleInput(request);
      }
    }
  }
  Manager.prototype = new Handler();

  /** 
   * Director is a subclass of Handler. A Director
   * can approve Raise Requests.
   */
  function Director() {
    this.handleInput = function(request) {
      if(request.type === RequestTypes.RAISE) {
        alert('Director::handleInput ' + JSON.stringify(request));
      }
      else if(this.getSuccessor() !== 'undefined') {
        this.getSuccessor().handleInput(request);
      }
    }
  }
  Director.prototype = new Handler();

  //----- Client Code -----//
  return {
    execute: function() {
      /**
       * Setting up a Chain of Responsibility
       * means creating the "chain". In this
       * chain a Manager will get the request
       * first, then if it doesn't apply, 
       * forward to the Director.
       *
       * A more dynamic approach to this could
       * be done by defining an array in the
       * order of succession and calling 
       * setSuccessor() in a loop.
       */
      var firstInLine = new Manager();
      var secondInLine = new Director();

      firstInLine.setSuccessor(secondInLine);

      /**
       * Simulate a Vacation Request
       */
      var vacationRequest = {
        type: RequestTypes.VACATION,
        status: RequestStatuses.PENDING,
        meta: {
          daysOff: 10
        }
      }

      /**
       * Simulate a Raise Request
       */
      var raiseRequest = {
        type: RequestTypes.RAISE,
        status: RequestStatuses.PENDING,
        meta: {
          amount: 10000
        }
      };

      /**
       * We have to hand the requests off to
       * the Handler(s) somewhere
       */
      firstInLine.handleInput(vacationRequest);
      firstInLine.handleInput(raiseRequest);
    }
  }
})();