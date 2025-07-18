import '@testing-library/jest-dom';

import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder as unknown as typeof window.TextEncoder;
global.TextDecoder = TextDecoder as unknown as typeof window.TextDecoder;