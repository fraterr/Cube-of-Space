export const colorMap = {
  "Pale Yellow": "#fcfac5",
  "Yellow": "#ffd700",
  "Blue": "#0000ff",
  "Green": "#008000",
  "Red": "#ff0000",
  "Red-Orange": "#ff4500",
  "Orange": "#ffa500",
  "Yellow-Orange": "#ffae42",
  "Yellow-Green": "#9acd32",
  "Violet": "#ee82ee",
  "Blue-Green": "#0d98ba",
  "Blue-Violet": "#8a2be2",
  "Scarlet": "#ff2400",
  "Red-Violet": "#c71585",
  "Indigo": "#4b0082",
};

export const positionMap = {
  "Above": { type: "face", pos: [0, 2, 0], rot: [-Math.PI / 2, 0, 0] },
  "Below": { type: "face", pos: [0, -2, 0], rot: [Math.PI / 2, 0, 0] },
  "East": { type: "face", pos: [2, 0, 0], rot: [0, Math.PI / 2, 0] },
  "West": { type: "face", pos: [-2, 0, 0], rot: [0, -Math.PI / 2, 0] },
  "North": { type: "face", pos: [0, 0, -2], rot: [0, Math.PI, 0] },
  "South": { type: "face", pos: [0, 0, 2], rot: [0, 0, 0] },

  "North-East": { type: "edge", pos: [2, 0, -2], rot: [0, 0, 0] },
  "South-East": { type: "edge", pos: [2, 0, 2], rot: [0, 0, 0] },
  "North-West": { type: "edge", pos: [-2, 0, -2], rot: [0, 0, 0] },
  "South-West": { type: "edge", pos: [-2, 0, 2], rot: [0, 0, 0] },
  
  "East-Above": { type: "edge", pos: [2, 2, 0], rot: [Math.PI / 2, 0, 0] },
  "East-Below": { type: "edge", pos: [2, -2, 0], rot: [Math.PI / 2, 0, 0] },
  "West-Above": { type: "edge", pos: [-2, 2, 0], rot: [Math.PI / 2, 0, 0] },
  "West-Below": { type: "edge", pos: [-2, -2, 0], rot: [Math.PI / 2, 0, 0] },
  
  "North-Above": { type: "edge", pos: [0, 2, -2], rot: [0, 0, Math.PI / 2] },
  "North-Below": { type: "edge", pos: [0, -2, -2], rot: [0, 0, Math.PI / 2] },
  "South-Above": { type: "edge", pos: [0, 2, 2], rot: [0, 0, Math.PI / 2] },
  "South-Below": { type: "edge", pos: [0, -2, 2], rot: [0, 0, Math.PI / 2] },

  "Above to Below": { type: "axis", pos: [0, 0, 0], rot: [0, 0, 0] },
  "East to West": { type: "axis", pos: [0, 0, 0], rot: [0, 0, Math.PI / 2] },
  "North to South": { type: "axis", pos: [0, 0, 0], rot: [Math.PI / 2, 0, 0] },

  "Center": { type: "center", pos: [0, 0, 0], rot: [0, 0, 0] },
  
  "Lower SE to Upper NW": { type: "diagonal", pos: [0, 0, 0], target: [-2, 2, -2] },
  "Lower NE to Upper SW": { type: "diagonal", pos: [0, 0, 0], target: [-2, 2, 2] },
  "Lower SW to Upper NE": { type: "diagonal", pos: [0, 0, 0], target: [2, 2, -2] },
  "Lower NW to Upper SE": { type: "diagonal", pos: [0, 0, 0], target: [2, 2, 2] },
};
