
var MementoModule = (function(){

  function TextBox(){
    var _text = "";
    return {
      setText: function(value) {
        _text = value;
      },
      getText: function() {
        return _text;
      },
      //acts as a way to restore the TextBox to a previous state
      setMemento: function(objMemento) {
        this.setText( objMemento.getText() );
      },
      //the api that exposes the state of the textbox through a Memento
      createMemento: function() {
        var memento = new TextBoxMomento(
          this.getText()
        );
        return memento;
      }
    }
  }

  function TextBoxMomento(sText) {
    var _text = sText;
    return {
      getText: function() {
        return _text;
      }
    }
  }

  function TextBoxCaretaker() {
    var _memento;
    return {
      setMemento: function(objMemento) {
        _memento = objMemento;
      },
      getMemento: function() {
        return _memento;
      }
    }
  }

  //----- Client Code -----//
  return {
    execute: function() {
      var textBox = new TextBox();
      textBox.setText('Hello World');
      alert(textBox.getText());

      var careTaker = new TextBoxCaretaker();
      careTaker.setMemento( textBox.createMemento() );
      alert('Memento is set');

      textBox.setText('Whoops, we need to go back to Hello World.');
      alert(textBox.getText());

      textBox.setMemento( careTaker.getMemento() );
      alert(textBox.getText());
    }
  }
})();


