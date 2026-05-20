import fs from 'fs';
import path from 'path';
import process from 'process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

const args = process.argv.slice(2);
if (args.length < 2) {
  console.error('Usage: npm run new:component -- <Category> <ComponentName>');
  process.exit(1);
}

const [category, componentName] = args;
if (!/^[A-Z][A-Za-z0-9]*$/.test(category)) {
  console.error(`Invalid category "${category}". Use PascalCase, e.g. Components.`);
  process.exit(1);
}
if (!/^[A-Z][A-Za-z0-9]*$/.test(componentName)) {
  console.error(`Invalid component name "${componentName}". Use PascalCase, e.g. HoneycombGrid.`);
  process.exit(1);
}

const camelName = componentName.charAt(0).toLowerCase() + componentName.slice(1);
const kebabName = componentName
  .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
  .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
  .toLowerCase();
const displayName = componentName.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/([A-Z])([A-Z][a-z])/g, '$1 $2');

const paths = {
  content: path.join(root, 'src/content', category, componentName),
  tailwind: path.join(root, 'src/tailwind', category, componentName),
  ts: path.join(root, 'src/ts-default', category, componentName),
  tsTailwind: path.join(root, 'src/ts-tailwind', category, componentName),
  demo: path.join(root, 'src/demo', category),
  codeMeta: path.join(root, 'src/constants/code', category)
};

Object.values(paths).forEach(dir => {
  fs.mkdirSync(dir, { recursive: true });
});

const writeIfMissing = (file, contents) => {
  if (fs.existsSync(file)) return;
  fs.writeFileSync(file, contents);
};

const jsCssComponent = `import './${componentName}.css';

export default function ${componentName}() {
  return <div className="${kebabName}-root">${displayName} component</div>;
}
`;

const cssFile = `.${kebabName}-root {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1em;
  color: #fff;
}
`;

const jsTwComponent = `export default function ${componentName}() {
  return <div className="flex items-center justify-center p-4 text-white">${displayName} component</div>;
}
`;

const tsCssComponent = `import './${componentName}.css';

export interface ${componentName}Props {
  className?: string;
}

export default function ${componentName}({ className = '' }: ${componentName}Props) {
  return <div className={\`${kebabName}-root \${className}\`}>${displayName} component</div>;
}
`;

const tsTwComponent = `export interface ${componentName}Props {
  className?: string;
}

export default function ${componentName}({ className = '' }: ${componentName}Props) {
  return (
    <div className={\`flex items-center justify-center p-4 text-white \${className}\`}>${displayName} component</div>
  );
}
`;

const demoFile = `import { useMemo } from 'react';
import { Flex } from '@chakra-ui/react';
import { CodeTab, PreviewTab, TabsLayout } from '../../components/common/TabsLayout';
import Customize from '../../components/common/Preview/Customize';
import CodeExample from '../../components/code/CodeExample';
import RefreshButton from '../../components/common/Preview/RefreshButton';
import PropTable from '../../components/common/Preview/PropTable';
import Dependencies from '../../components/code/Dependencies';
import useForceRerender from '../../hooks/useForceRerender';
import useComponentProps from '../../hooks/useComponentProps';
import { ComponentPropsProvider } from '../../components/context/ComponentPropsContext';

import ${componentName} from '../../content/${category}/${componentName}/${componentName}';
import { ${camelName} } from '../../constants/code/${category}/${camelName}Code';

const DEFAULT_PROPS = {};

const ${componentName}Demo = () => {
  const [key, forceRerender] = useForceRerender();
  const { props, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);

  const propData = useMemo(
    () => [
      { name: 'className', type: 'string', default: '', description: 'Optional class applied to the root element.' }
    ],
    []
  );

  return (
    <ComponentPropsProvider props={props} defaultProps={DEFAULT_PROPS} resetProps={resetProps} hasChanges={hasChanges}>
      <TabsLayout>
        <PreviewTab>
          <Flex
            overflow="hidden"
            justifyContent="center"
            alignItems="center"
            minH="400px"
            position="relative"
            className="demo-container"
          >
            <${componentName} key={key} {...props} />
            <RefreshButton onClick={forceRerender} />
          </Flex>

          <Customize>{/* Add controls here */}</Customize>

          <PropTable data={propData} />
          <Dependencies dependencyList={[]} />
        </PreviewTab>

        <CodeTab>
          <CodeExample codeObject={${camelName}} componentName="${componentName}" />
        </CodeTab>
      </TabsLayout>
    </ComponentPropsProvider>
  );
};

export default ${componentName}Demo;
`;

const codeMetaFile = `import code from '@content/${category}/${componentName}/${componentName}.jsx?raw';
import css from '@content/${category}/${componentName}/${componentName}.css?raw';
import tailwind from '@tailwind/${category}/${componentName}/${componentName}.jsx?raw';
import tsCode from '@ts-default/${category}/${componentName}/${componentName}.tsx?raw';
import tsTailwind from '@ts-tailwind/${category}/${componentName}/${componentName}.tsx?raw';

export const ${camelName} = {
  dependencies: '',
  usage: \`import ${componentName} from './${componentName}';

<${componentName} />\`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
`;

writeIfMissing(path.join(paths.content, `${componentName}.jsx`), jsCssComponent);
writeIfMissing(path.join(paths.content, `${componentName}.css`), cssFile);
writeIfMissing(path.join(paths.tailwind, `${componentName}.jsx`), jsTwComponent);
writeIfMissing(path.join(paths.ts, `${componentName}.tsx`), tsCssComponent);
writeIfMissing(path.join(paths.ts, `${componentName}.css`), cssFile);
writeIfMissing(path.join(paths.tsTailwind, `${componentName}.tsx`), tsTwComponent);
writeIfMissing(path.join(paths.demo, `${componentName}Demo.jsx`), demoFile);
writeIfMissing(path.join(paths.codeMeta, `${camelName}Code.js`), codeMetaFile);

// Update Components.js
const componentsFile = path.join(root, 'src/constants/Components.js');
let componentsSrc = fs.readFileSync(componentsFile, 'utf8');
const importLine = `  '${kebabName}': () => import('../demo/${category}/${componentName}Demo')`;
if (!componentsSrc.includes(`'${kebabName}':`)) {
  componentsSrc = componentsSrc.replace(/const components = \{([\s\S]*?)\};/, (match, body) => {
    const trimmed = body.trim();
    const newBody = trimmed.length === 0 ? `\n${importLine}\n` : `${body.replace(/\s+$/, '')},\n${importLine}\n`;
    return `const components = {${newBody}};`;
  });
  fs.writeFileSync(componentsFile, componentsSrc);
}

// Update Categories.js
const categoriesFile = path.join(root, 'src/constants/Categories.js');
let categoriesSrc = fs.readFileSync(categoriesFile, 'utf8');
const categoryEntryRegex = new RegExp(
  `(\\{\\s*name:\\s*'${category}'[\\s\\S]*?subcategories:\\s*\\[)([^\\]]*)(\\])`
);
if (categoryEntryRegex.test(categoriesSrc)) {
  categoriesSrc = categoriesSrc.replace(categoryEntryRegex, (_match, open, body, close) => {
    if (body.includes(`'${displayName}'`)) return `${open}${body}${close}`;
    const trimmed = body.trim();
    const newBody = trimmed.length === 0 ? `\n      '${displayName}'\n    ` : `${body.replace(/\s+$/, '')},\n      '${displayName}'\n    `;
    return `${open}${newBody}${close}`;
  });
  fs.writeFileSync(categoriesFile, categoriesSrc);
} else {
  console.warn(`Category "${category}" not found in Categories.js. Add it manually.`);
}

// Update Information.js
const informationFile = path.join(root, 'src/constants/Information.js');
let informationSrc = fs.readFileSync(informationFile, 'utf8');
const metadataEntry = `  '${category}/${componentName}': {
    description: '${displayName} component.',
    category: '${category}',
    name: '${componentName}',
    tags: []
  }`;
if (!informationSrc.includes(`'${category}/${componentName}':`)) {
  informationSrc = informationSrc.replace(
    /export const componentMetadata = \{([\s\S]*?)\};/,
    (_match, body) => {
      const trimmed = body.trim();
      const newBody = trimmed.length === 0 ? `\n${metadataEntry}\n` : `${body.replace(/\s+$/, '')},\n${metadataEntry}\n`;
      return `export const componentMetadata = {${newBody}};`;
    }
  );
  fs.writeFileSync(informationFile, informationSrc);
}

console.log(`Scaffolded ${category}/${componentName} — route /${category.toLowerCase()}/${kebabName}`);
