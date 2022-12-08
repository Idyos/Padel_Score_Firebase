import * as React from 'react';
import { Drawer } from 'react-native-paper';

const Cajillero = () => {
  const [active, setActive] = React.useState('');

  return (
    <Drawer.Section title="Some title" showDivider={false}>
      <Drawer.Item
        label="First Item"
        active={active === 'first'}
        onPress={() => setActive('first')}
      />
      <Drawer.Item
        label="Second Item"
        active={active === 'second'}
        onPress={() => setActive('second')}
      />
    </Drawer.Section>
  );
};

export default Cajillero;