const { PassThrough } = require('stream');

jest.mock('axios');
jest.mock('fs');
jest.mock('../src/utils/file', () => ({
  getImagePath: jest.fn().mockReturnValue('images/test.jpg')
}));
jest.mock('../src/utils/logger', () => ({
  warn: jest.fn()
}));

const axios = require('axios');
const fs = require('fs');
const getImagePath = require('../src/utils/file').getImagePath;
const logger = require('../src/utils/logger');

const downloadImage = require('../src/services/imageDownloader');

describe('imageDownloader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('successfully downloads and writes stream to file', async () => {
    // create a readable stream that will act as axios response data
    const resStream = new PassThrough();

    // create a writable stream (mock of fs.createWriteStream)
    const writeStream = new PassThrough();

    // mock axios.get to resolve with our readable stream
    axios.get.mockResolvedValue({ data: resStream });

    // mock fs.createWriteStream to return our writable stream
    fs.createWriteStream.mockImplementation(() => writeStream);

    const promise = downloadImage('http://example.com/img.jpg', 'img.jpg');

    // write some data and end the readable stream so piping finishes
    resStream.write('hello');
    resStream.end();

    // wait for the downloadImage promise to resolve
    await expect(promise).resolves.toBeUndefined();

    // assert that getImagePath and fs.createWriteStream were used
    expect(getImagePath).toHaveBeenCalledWith('img.jpg');
    expect(fs.createWriteStream).toHaveBeenCalledWith('images/test.jpg');
  });

  test('returns early for invalid url', async () => {
    const result = await downloadImage(null, 'img.jpg');
    expect(result).toBeUndefined();
    expect(axios.get).not.toHaveBeenCalled();
  });

  test('logs warning when axios.get fails', async () => {
    axios.get.mockRejectedValue(new Error('network error'));

    await expect(downloadImage('http://example.com/fail.jpg', 'fail.jpg')).resolves.toBeUndefined();

    expect(logger.warn).toHaveBeenCalledWith('Image download failed: fail.jpg');
  });
});
