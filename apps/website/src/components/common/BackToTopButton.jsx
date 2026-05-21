import { useEffect, useState } from 'react';
import { Button, Icon } from '@chakra-ui/react';
import { FiArrowUp } from 'react-icons/fi';

const BackToTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <Button
      fontWeight={500}
      rounded="xl"
      py={4}
      right={{ base: '12px', md: '2em' }}
      position="fixed"
      zIndex={98}
      boxShadow="10px 0 25px rgba(0, 0, 6, 1)"
      transition="0.3s ease"
      opacity={visible ? 1 : 0}
      bottom={visible ? { base: '6em', md: '2.5em' } : '1em'}
      cursor={visible ? 'pointer' : 'default'}
      onClick={() => visible && window.scrollTo({ top: 0, behavior: 'smooth' })}
      bg="#1B1722"
      border="1px solid #2F293A"
    >
      <Icon as={FiArrowUp} color="#fff" boxSize={4} />
    </Button>
  );
};

export default BackToTopButton;
