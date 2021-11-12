pm.test("Test 1: POST Request", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.username).to.eql("Bob");
    pm.expect(jsonData.orderedLocations).to.eql("{ Monday: [loc_1, loc_2], Tuesday: [], Wednesday: [loc_1, loc_2], Thursday: [loc_3], Friday: [loc_1, loc_2, loc_3]}");
})