import { Box, Text } from '@chakra-ui/react';
import Navbar from '../components/landingnew/Navbar/Navbar';

const SponsorsPage = () => (
  <main className="app-container">
    <Navbar />
    <Box maxW="900px" mx="auto" p="4em 2em">
      <Text color="#fff" fontSize="32px" fontWeight={600}>
        Sponsors
      </Text>
      <Text color="#a1a1aa" mt={3}>
        Backing this project? Reach out to be listed here.
      </Text>
    </Box>
  </main>
);

export default SponsorsPage;
