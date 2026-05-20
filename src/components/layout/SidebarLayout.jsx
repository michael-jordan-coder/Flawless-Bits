import { Box } from '@chakra-ui/react';
import Navbar from '../landingnew/Navbar/Navbar';
import Sidebar from '../navs/Sidebar';
import ProCard from '../common/ProCard';
import SponsorsCard from '../common/SponsorsCard';
import ProCardMobile from '../common/ProCardMobile';

export default function SidebarLayout({ children }) {
  return (
    <main className="app-container">
      <Navbar showDocs />
      <section className="category-wrapper">
        <Sidebar />
        <Box minW={0}>{children}</Box>
        <aside className="right-panel">
          <Box className="right-panel-inner">
            <ProCard />
            <SponsorsCard />
          </Box>
        </aside>
      </section>
      <ProCardMobile />
    </main>
  );
}
