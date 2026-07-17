const toDataURLMock = jest.fn(() => 'data:image/jpeg;base64,fake');
const html2canvasMock = jest.fn();
const addImageMock = jest.fn();
const addPageMock = jest.fn();
const saveMock = jest.fn();
const jsPDFMock = jest.fn();

jest.mock('html2canvas', () => ({
  __esModule: true,
  default: (...args) => html2canvasMock(...args),
}));

jest.mock('jspdf', () => ({
  __esModule: true,
  jsPDF: function (...args) {
    jsPDFMock(...args);
    return {
      internal: { pageSize: { getWidth: () => 210, getHeight: () => 297 } },
      addImage: addImageMock,
      addPage: addPageMock,
      save: saveMock,
    };
  },
}));

import { exportElementToPdf } from '../exportCvPdf';

beforeEach(() => {
  jest.clearAllMocks();
});

it('throws when the element is missing', async () => {
  await expect(exportElementToPdf(null, 'cv.pdf')).rejects.toThrow('Nothing to export: element not found.');
  expect(html2canvasMock).not.toHaveBeenCalled();
});

it('captures the element with the documented html2canvas options and saves a single-page pdf', async () => {
  html2canvasMock.mockResolvedValue({
    width: 800,
    height: 1000,
    toDataURL: toDataURLMock,
  });

  const element = { scrollWidth: 800, scrollHeight: 1000 };

  await exportElementToPdf(element, 'my-cv.pdf');

  expect(html2canvasMock).toHaveBeenCalledWith(element, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    logging: false,
    backgroundColor: '#ffffff',
    width: 800,
    height: 1000,
  });
  expect(toDataURLMock).toHaveBeenCalledWith('image/jpeg', 0.95);
  expect(addPageMock).not.toHaveBeenCalled();
  expect(addImageMock).toHaveBeenCalledTimes(1);
  expect(saveMock).toHaveBeenCalledWith('my-cv.pdf');
});

it('paginates across multiple pages when the captured canvas is taller than one A4 page', async () => {
  // width 800 -> imgWidth = pageWidth (210mm); imgHeight = (canvas.height * imgWidth) / canvas.width
  // canvas.height much larger than canvas.width forces imgHeight > pageHeight (297mm), i.e. multiple pages.
  html2canvasMock.mockResolvedValue({
    width: 800,
    height: 800 * 20, // very tall capture
    toDataURL: toDataURLMock,
  });

  const element = { scrollWidth: 800, scrollHeight: 800 * 20 };

  await exportElementToPdf(element, 'long-cv.pdf');

  expect(addImageMock.mock.calls.length).toBeGreaterThan(1);
  expect(addPageMock.mock.calls.length).toBe(addImageMock.mock.calls.length - 1);
  expect(saveMock).toHaveBeenCalledWith('long-cv.pdf');
});
