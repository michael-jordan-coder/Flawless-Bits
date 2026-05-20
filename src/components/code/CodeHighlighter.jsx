import { useState } from 'react';
import { Box, Button, Icon } from '@chakra-ui/react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { TbCopy, TbCopyCheckFilled } from 'react-icons/tb';
import { colors } from '../../constants/colors';

const CodeHighlighter = ({ language, codeString, showLineNumbers = true }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!codeString) return;
    await navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!codeString) {
    return (
      <Box color={colors.textMuted} fontSize="14px" my={4}>
        No code available.
      </Box>
    );
  }

  return (
    <Box position="relative">
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        showLineNumbers={showLineNumbers}
        className="code-highlighter"
        customStyle={{
          margin: 0,
          background: colors.bgCard,
          border: `1px solid ${colors.borderPrimary}`,
          padding: '1em'
        }}
      >
        {codeString}
      </SyntaxHighlighter>

      <Button
        position="absolute"
        top="0.65em"
        right="0.6em"
        size="sm"
        bg={copied ? colors.primary : colors.bgBody}
        color={copied ? 'black' : 'white'}
        borderRadius="10px"
        border={`1px solid ${colors.borderSecondary}`}
        _hover={{ bg: copied ? colors.primary : colors.bgElevated }}
        onClick={handleCopy}
        aria-label={copied ? 'Copied' : 'Copy code'}
      >
        <Icon as={copied ? TbCopyCheckFilled : TbCopy} boxSize={4} />
      </Button>
    </Box>
  );
};

export default CodeHighlighter;
