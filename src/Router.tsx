import { createHashRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import MeetingPage from './features/meetings/MeetingPage';
import PublishersListPage from './features/publishers/PublishersListPage';
import PublishersSavePage from './features/publishers/PublishersSavePage';

const router = createHashRouter(createRoutesFromElements(<Route  >
  <Route path='/admin'>
    <Route path='' element={<MeetingPage />} />
    <Route path='publicadores' >
      <Route path='' element={<PublishersListPage />} />
      <Route path='crear' element={<PublishersSavePage />} />
    </Route>
  </Route>
</Route>));

export function Router() {
  return <RouterProvider router={router} />;
}
