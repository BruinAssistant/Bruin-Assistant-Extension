pm.test("Test 3: PUT Request", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.id).to.eql("15");
    pm.expect(jsonData.username).to.eql("Bob");
    pm.expect(jsonData.orderedLocations).to.eql("{ Monday: [loc_1], Tuesday: [loc_2], Wednesday: [loc_1], Thursday: [loc_2, loc_3], Friday: [loc_1, loc_2, loc_3]}");
})