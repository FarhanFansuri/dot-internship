import {
    createBrowserRouter,

} from 'react-router-dom'
import Login from '../view/containers/login/Login';
import Quiz from '../view/containers/quiz/Quiz';

const router = createBrowserRouter([
    {
        path:"/",
        element: <Login />,
        errorElement: <h1>404 Not Found</h1>
    },
    {
        path:"/quiz",
        element: <Quiz/>,
    }
])

export default router;