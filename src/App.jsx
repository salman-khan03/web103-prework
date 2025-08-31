import { useRoutes } from 'react-router-dom'
import ShowCreators from './pages/ShowCreators'
import ViewCreator from './pages/ViewCreator'
import AddCreator from './pages/AddCreator'
import EditCreator from './pages/EditCreator'
import '@picocss/pico'
import './App.css'

function App() {
  // Define the routes and elements
  const element = useRoutes([
    {
      path: '/',
      element: <ShowCreators />
    },
    {
      path: '/new',
      element: <AddCreator />
    },
    {
      path: '/:id',
      element: <ViewCreator />
    },
    {
      path: '/edit/:id',
      element: <EditCreator />
    }
  ])

  return (
    <div className="App">
      {element}
    </div>
  )
}

export default App
