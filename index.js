import R from 'ramda'

// yep, dirty hacks
let currentState
let currentActions

export default (container) => {
  if (typeof container === 'object') {
    return (props, children) => {
      const initializing = !currentState._containers[props.id]
      if (initializing) {
        currentActions._containers.updateState({
          index: props.id,
          state: container.state
        })
      }

      const previousContainerState = initializing
        ? container.state
        : currentState._containers[props.id]

      const containerState = {
        ...previousContainerState,
        parent: props
      }
      const containerActions = {}
      Object.assign(containerActions, R.fromPairs(R.toPairs(container.actions).map(([action, actionBody]) => {
        return [action, (data) => {
          const newContainerState = actionBody(containerState, containerActions, data)
          currentActions._containers.updateState({
            index: props.id,
            state: newContainerState
          })
        }]
      })))

      return container.view(containerState, containerActions, children)
    }
  } else {
    return {
      state: {
        _containers: {
        }
      },

      actions: {
        _containers: {
          updateState(state, actions, {index, state: containerState}) {
            return {
              ...state,
              _containers: {
                ...state._containers,
                [index]: containerState
              }
            }
          }
        }
      },

      events: {
        render(state, actions, view) {
          currentState = state
          currentActions = actions
          return view
        }
      }
    }
  }
}
