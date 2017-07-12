import { h, app } from 'hyperapp'
import container from '../'

// this can be in its own file
const Counter = container({
  state: {
    parent: {
      name: '',
      onChange() {
      }
    },
    value: 0
  },

  actions: {
    add(state) {
      state.parent.onChange(1)
      return {
        ...state,
        value: state.value + 1
      }
    },
    sub(state) {
      state.parent.onChange(-1)
      return {
        ...state,
        value: state.value - 1
      }
    }
  },

  view(state, actions) {
    return <div>
      <h1>{state.parent.name} {state.value}</h1>
      <button onclick={actions.add}>+</button>
      <button onclick={actions.sub}>-</button>
    </div>
  }
})

app({
  state: {
    sum: 0
  },

  actions: {
    counterChanged(state, actions, value) {
      return {
        ...state,
        sum: state.sum + value
      }
    }
  },

  view(state, actions) {
    return <div>
      <Counter id="left" name="Left" onChange={actions.counterChanged} />
      <Counter id="right" name="Right" onChange={actions.counterChanged} />
      <p>Sum {state.sum}</p>
    </div>
  },

  mixins: [
    container
  ],

  root: document.getElementById('hyperapp-entry')
})
