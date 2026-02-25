jest.mock('axios');
const axios = require('axios');
const translate = require('../src/services/translator');
const logger = require('../src/utils/logger');

jest.mock('../src/utils/logger', () => ({
  warn: jest.fn()
}));

describe('translator service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns translated text on success', async () => {
    axios.get.mockResolvedValue({ data: { responseData: { translatedText: 'Hello World' } } });

    const res = await translate('Hola Mundo');

    expect(res).toBe('Hello World');
  });

  test('retries and falls back to original text when API fails', async () => {
    axios.get.mockRejectedValue(new Error('network')); // will trigger retry and ultimately fallback

    const res = await translate('Texto de prueba');

    expect(res).toBe('Texto de prueba');
    expect(logger.warn).toHaveBeenCalledWith('Translation failed');
  });
});
