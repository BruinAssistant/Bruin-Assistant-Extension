/**
* @jest-environment jsdom
*/
const fetchInstBruinwalk = require("./bruinwalk");

test('Find a professor name from dummy html', () =>{
    expect(fetchInstBruinwalk('<!DOCTYPE html>\
    <html><body>\
    <h1>My First Heading</h1>\
    <p>My first paragraph.</p>\
    </body>\
    </html>', ['Kim', 'M.'])).toBe("");
});