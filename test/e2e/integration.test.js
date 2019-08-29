const selectors = {
  init: '[id="app"] *',
  form: 'form[name="fibonacci"]',
  input: 'form[name="fibonacci"] > input[type="text"]',
  submit: 'form[name="fibonacci"] > button[type="submit"]',
  output: 'form[name="fibonacci"] > .output',
  error: 'form[name="fibonacci"] > .error',
};

describe('Integration test', () => {
  beforeEach(async () => {
    const url = `http://localhost:4000/unknown-url-${Date.now()}`;
    await page.goto(url);
    await page.waitFor(selectors.init);
  });

  it('should load the fibonacci form', async () => {
    const form = await page.$(selectors.form);
    expect(form).to.not.equal(null);
  });

  it('should display values correctly', async () => {
    await page.type(selectors.input, '11');
    await page.click(selectors.submit);
    await page.waitFor(selectors.output);

    const text = await page.$eval(selectors.output, e => e.textContent);
    expect(text).to.equal('Value: 89');
  });

  it('should display infinity values correctly', async () => {
    await page.type(selectors.input, '3000');
    await page.click(selectors.submit);
    await page.waitFor(selectors.output);

    const text = await page.$eval(selectors.output, e => e.textContent);
    expect(text).to.equal('Value: Infinity');
  });

  it('should display errors correctly', async () => {
    await page.type(selectors.input, 'asdad');
    await page.click(selectors.submit);
    await page.waitFor(selectors.error);

    const text = await page.$eval(selectors.error, e => e.textContent);
    expect(text).to.equal('Something went wrong');
  });
});
