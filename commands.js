;(function() {
  'use strict'

  // ----------------------------------------------------------
  // Keyboard

  function Keyboard() {}

  Keyboard.prototype = {
    bind: function(commands) {
      for(var shortcut in commands) {
        checkvist.addShortcut(shortcut, commands[shortcut])
      }
    },

    bindWithDelay: function(commands) {
      for(var shortcut in commands) {
        checkvist.addShortcut(shortcut, this._handleDelayedShortcut(commands[shortcut]))
      }
    },

    _handleDelayedShortcut: function(action) {
      var runTimeoutId = null
      var nullTimeoutId = null

      return function(event) {
        clearTimeout(runTimeoutId)
        clearTimeout(nullTimeoutId)

        if (checkvist.commandCanRun() && runTimeoutId === null) {
          runTimeoutId = setTimeout(action, 150)
        }

        nullTimeoutId = setTimeout(function() { runTimeoutId = null }, 200)
      }
    }
  }

  // ----------------------------------------------------------
  // checkvist

  var checkvist = {
    addShortcut: function(shortcut, callback) {
      var matcher = new maxkir.KbdMatcher(shortcut)

      maxkir.KbdMatcher.matchers.pop()

      matcher.resetUnmatched = function(keys) {
        matcher.has_sequence(keys) || matcher.reset()
      }

      return maxkir.kbd.forCondition(function(event) {
        return matcher.matches(event)
      }).addHook(function(event) {
        callback(event)
      })
    },

    collapse: function() {
      return maxkir.ChecklistNodeToggle.collapse(this.getTaskId())
    },

    expand: function() {
      return maxkir.ChecklistNodeToggle.expand(this.getTaskId())
    },

    setFocus: function() {
      return maxkir.TaskFocus.set_focus(this.getTaskId())
    },

    removeFocus: function() {
      return maxkir.TaskFocus.remove_focus(this.getTaskId())
    },

    commandCanRun: function() {
      return maxkir.cmd.can_run(true)
    },

    getTaskId: function() {
      return maxkir.Task.selected_task_id()
    }
  }


  // ----------------------------------------------------------
  // Main

  var keyboard = new Keyboard()

  keyboard.bindWithDelay({
    h: function() { checkvist.collapse() },
    l: function() { checkvist.expand() },
    'shift+g': function() { maxkir.tree_nav.selectLastInTree() }
  })

  keyboard.bind({
    'shift+h': function() { checkvist.removeFocus() },
    'shift+l': function() { checkvist.setFocus() },
    'alt+g alt+g': function() { maxkir.tree_nav.selectFirstInTree() }
  })

})()
