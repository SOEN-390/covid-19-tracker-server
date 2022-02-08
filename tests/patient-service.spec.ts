import resetAllMocks = jest.resetAllMocks;

describe('Patient service unit-test', () => {
    test('HelloWorld',  () => {
        expect(true).toEqual(true);
    })
    afterAll(() => {
        resetAllMocks()
    })
});