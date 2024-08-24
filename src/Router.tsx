import { createHashRouter, RouterProvider } from 'react-router-dom';
import MeetingPage from './features/meetings/MeetingPage';


const router = createHashRouter([
  {
    path: '/',
    element: <MeetingPage />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
