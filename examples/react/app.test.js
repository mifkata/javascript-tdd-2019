const React = require('react');
const { shallow } = require('enzyme');
const { App } = require('./app');
const sinon = require('sinon');

const selectors = {
  form: 'form[name="fibonacci"]',
  input: 'form[name="fibonacci"] > input[type="text"]',
  submit: 'form[name="fibonacci"] > button[type="submit"]',
  error: 'form[name="fibonacci"] > .error',
  output: 'form[name="fibonacci"] > .output'
};

const sandbox = sinon.createSandbox();
const successResponse = {
  body: {
    value: `test${Date.now()}`,
  },
};

describe('App component', () => {
  let wrapper, post, preventDefault;

  const setText = value =>
    wrapper.find(selectors.input).simulate('change', { target: { value } });

  const submitForm = () =>
    wrapper.find(selectors.form).simulate('submit', { preventDefault });

  const submitFailure = async (response = {}, text = '') => {
    post.rejects(response);
    setText(text);
    submitForm();

    return wrapper.update();
  }

  const submitSuccess = async (response = {}, text = '') => {
    post.resolves(response);
    setText(text);
    submitForm();

    return wrapper.update();
  }

  beforeEach(() => {
    const superagent = require('superagent');
    post = sandbox.stub(superagent, 'post');
    preventDefault = sandbox.spy();
    wrapper = shallow(<App />);
  });

  afterEach(() => sandbox.restore());

  it('should have a labeled submit button', () => {
    const submit = wrapper.find(selectors.submit);
    expect(submit.text().trim()).to.not.equal('');
  });

  it('should call superagent correctly', async () => {
    await submitSuccess(successResponse, 'test');
    expect(preventDefault.callCount).to.equal(1);
    expect(post.args).to.deep.equal([[
      '/fibonacci',
      { num: 'test' }
    ]]);
  });

  describe('on form submit failure', () => {
    beforeEach(async () => submitFailure());

    it('should display an error', () => {
      const error = wrapper.find(selectors.error);
      expect(error.text()).to.equal('Something went wrong');
    });
  
    it('should hide the error, if next submission succeeds', async () => {
      await submitSuccess(successResponse);
      const error = wrapper.find(selectors.error);
      expect(error.length).to.equal(0);
    });
  
    it('should display correct error, if request fails with 400', async () => {
      await submitFailure({ statusCode: 400 });
      const error = wrapper.find(selectors.error);
      expect(error.text()).to.equal('Invalid position!');
    });
  });

  describe('on form submit success', () => {
    beforeEach(async () => submitSuccess(successResponse));

    it('should display correct output', () => {
      const output = wrapper.find(selectors.output);
      expect(output.text()).to.equal(`Value: ${successResponse.body.value}`);
    });
  
    it('should hide the output, if an error occurs', async () => {
      await submitFailure();
  
      const output = wrapper.find(selectors.output);
      const error = wrapper.find(selectors.error);
  
      expect(output.length).to.equal(0);
      expect(error.length).to.equal(1);
    });
  });
});
