#!/bin/bash

MODULE=$1

if [ -z "$MODULE" ]; then
  echo "❌ Please provide module name"
  echo "✅ Example: ./create-redux.sh roleMaster"
  exit 1
fi

echo "🚀 Creating redux structure for: $MODULE"

mkdir -p src/redux/actions/${MODULE}Action
touch src/redux/actions/${MODULE}Action/${MODULE}Action.ts
touch src/redux/actions/${MODULE}Action/${MODULE}ActionInterface.ts

mkdir -p src/redux/reducers/${MODULE}Reducer
touch src/redux/reducers/${MODULE}Reducer/${MODULE}Reducer.ts
touch src/redux/reducers/${MODULE}Reducer/${MODULE}ReducerInterface.ts

mkdir -p src/redux/sagas/handlers/${MODULE}Handler
touch src/redux/sagas/handlers/${MODULE}Handler/${MODULE}Handler.ts
touch src/redux/sagas/handlers/${MODULE}Handler/${MODULE}HandlerInterface.ts

mkdir -p src/redux/sagas/requests/${MODULE}Request
touch src/redux/sagas/requests/${MODULE}Request/${MODULE}Request.ts
touch src/redux/sagas/requests/${MODULE}Request/${MODULE}RequestInterface.ts

echo "✅ Done!"