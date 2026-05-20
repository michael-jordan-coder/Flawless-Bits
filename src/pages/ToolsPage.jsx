import { Box, Text } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/landingnew/Navbar/Navbar';

const ToolsPage = () => {
  const { toolId } = useParams();
  return (
    <main className="app-container">
      <Navbar />
      <Box maxW="900px" mx="auto" p="4em 2em">
        <Text color="#fff" fontSize="32px" fontWeight={600}>
          Tools{toolId ? ` — ${toolId}` : ''}
        </Text>
        <Text color="#a1a1aa" mt={3}>
          Companion tools will be listed here.
        </Text>
      </Box>
    </main>
  );
};

export default ToolsPage;
