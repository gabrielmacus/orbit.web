import { createHashRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import MeetingPage from './features/meetings/MeetingPage';
import PublishersListPage from './features/publishers/PublishersListPage';

const router = createHashRouter(createRoutesFromElements(<Route  >
  <Route path='/admin'>
    <Route path='' element={<MeetingPage />} />
    <Route path='publicadores' element={<PublishersListPage />} />
  </Route>
</Route>));

export function Router() {
  return <RouterProvider router={router} />;
}
