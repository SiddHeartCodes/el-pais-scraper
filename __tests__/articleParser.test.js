jest.mock('../src/utils/selenium', () => ({
  safeFind: jest.fn()
}));

const { safeFind } = require('../src/utils/selenium');
const parser = require('../src/scraper/articleParser');

describe('articleParser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getTitle returns h1 text when element is found', async () => {
    const fakeElement = {
      getText: jest.fn().mockResolvedValue('Título de prueba')
    };

    safeFind.mockResolvedValue(fakeElement);

    const title = await parser.getTitle({});

    expect(safeFind).toHaveBeenCalled();
    expect(title).toBe('Título de prueba');
  });

  test('getTitle returns empty string when element is missing', async () => {
    safeFind.mockResolvedValue(null);

    const title = await parser.getTitle({});

    expect(title).toBe('');
  });

  test('getContent returns filtered text from main container', async () => {
    const shortParagraph = {
      getText: jest.fn().mockResolvedValue('corto')
    };
    const longParagraph = {
      getText: jest.fn().mockResolvedValue('Este es un párrafo de contenido largo que supera el mínimo.')
    };

    const container = {
      findElements: jest.fn().mockResolvedValue([shortParagraph, longParagraph])
    };

    safeFind.mockResolvedValueOnce(container);

    const content = await parser.getContent({});

    expect(content).toContain('Este es un párrafo de contenido largo');
    expect(content).not.toContain('corto');
  });

  test('getContent falls back to article selector when primary container is missing', async () => {
    const paragraph = {
      getText: jest.fn().mockResolvedValue('Contenido desde el fallback article.')
    };
    const fallbackContainer = {
      findElements: jest.fn().mockResolvedValue([paragraph])
    };

    safeFind
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(fallbackContainer);

    const content = await parser.getContent({});

    expect(safeFind).toHaveBeenCalledTimes(2);
    expect(content).toContain('Contenido desde el fallback article.');
  });

  test('getContent returns empty string when no container is found', async () => {
    safeFind
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);

    const content = await parser.getContent({});

    expect(content).toBe('');
  });

  test('getImage returns src from primary selector when present', async () => {
    const imgElement = {
      getAttribute: jest.fn().mockResolvedValue('http://example.com/img.jpg')
    };

    safeFind.mockResolvedValueOnce(imgElement);

    const src = await parser.getImage({});

    expect(src).toBe('http://example.com/img.jpg');
  });

  test('getImage falls back to secondary selector when primary is missing', async () => {
    const imgElement = {
      getAttribute: jest.fn().mockResolvedValue('http://example.com/fallback.jpg')
    };

    safeFind
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(imgElement);

    const src = await parser.getImage({});

    expect(safeFind).toHaveBeenCalledTimes(2);
    expect(src).toBe('http://example.com/fallback.jpg');
  });

  test('getImage returns null when no image is found', async () => {
    safeFind
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);

    const src = await parser.getImage({});

    expect(src).toBeNull();
  });

  test('retry logic handles stale element once and then succeeds (via getImage)', async () => {
    const staleError = new Error('stale element');
    staleError.name = 'StaleElementReferenceError';

    const imgElement = {
      getAttribute: jest.fn().mockResolvedValue('http://example.com/retry.jpg')
    };

    safeFind
      .mockRejectedValueOnce(staleError)
      .mockResolvedValueOnce(imgElement);

    const src = await parser.getImage({});

    expect(src).toBe('http://example.com/retry.jpg');
    expect(safeFind).toHaveBeenCalledTimes(2);
  });
}
);
