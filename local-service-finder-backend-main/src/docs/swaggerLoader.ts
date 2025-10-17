import dotenv from 'dotenv';
import path from 'path';
import YAML from 'yamljs';

const swaggerDocument = YAML.load(
  path.join(__dirname, './swagger.yaml'),
) as Record<string, unknown>;

dotenv.config();

const port = process.env.PORT || '3000';
const basePath = process.env.BASE_PATH || '/api/v1';
const hostname = process.env.HOST || 'localhost';

// Override `servers` dynamically
swaggerDocument.servers = [
  {
    url: `http://${hostname}:${port}${basePath}`,
    description: 'Local development server',
  },
];

export default swaggerDocument;
