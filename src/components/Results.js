import React from 'react';

export default props => {
  return (
    <main>
      <section>Main content: {props.match.params.id}</section>
      <aside>Sidebar</aside>
    </main>
  );
};
