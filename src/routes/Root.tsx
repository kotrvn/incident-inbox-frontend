import { Outlet } from 'react-router-dom';

export function Root() {
  return (
    <div className="app">
      <header>
        <h1>Incident Inbox</h1>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}