const util = {
  isMapContainsObj(map, property, value) {
    if (map) {
      for (let m of map.values()) {
        return m[property] == value;
      }
    }
  }
};

export default util;