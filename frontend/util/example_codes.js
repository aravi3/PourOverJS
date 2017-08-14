export const MERGE_SORT_EXAMPLE = `// Demonstration of the merge sort algorithm

function mergeSort(array) {
if (array.length <= 1) {
  return array;
} else {
  const mid = Math.floor(array.length / 2);

  const left = mergeSort(array.slice(0, mid));
  const right = mergeSort(array.slice(mid));

  return merge(left, right);
}
}

function merge(left, right) {

const sorted = [];
while (left.length > 0 && right.length > 0) {

  if (left[0] <= right[0]) {
    sorted.push(left.shift());
  } else if (right[0] < left[0]){
    sorted.push(right.shift());
  }
}
return sorted.concat(left, right);
}

mergeSort([9,2,-5,7]);
`;

export const BFS_EXAMPLE = `// Breadth-First Search to find target "e"
// Feel free to change target position in the tree!

const tree = [
  ["x", "x", "x", "x", "x", "x", "x"],
  ["x", "x", "x", "x", "x", "x", "x"],
  ["x", "x", "x", "x", "x", "x", "x"],
  ["x", "x", "x", "x", "x", "x", "x"],
  ["x", "x", "x", "x", "x", "x", "x"],
  ["x", "x", "x", "x", "e", "x", "x"],
  ["x", "x", "x", "x", "x", "x", "x"]
];

class TreeNode {
  constructor(pos, parent) {
    this.pos = pos;
    this.parent = parent;
  }
}

function arraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }

  return true;
}

function includedIn(childArr, parentArr) {
  for (let i = 0; i < parentArr.length; i++) {
    if (arraysEqual(childArr, parentArr[i])) {
      return true;
    }
  }

  return false;
}

function upPos(pos) {
  return [pos[0] - 1, pos[1]];
}

function rightPos(pos) {
  return [pos[0], pos[1] + 1];
}

function downPos(pos) {
  return [pos[0] + 1, pos[1]];
}

function leftPos(pos) {
  return [pos[0], pos[1] - 1];
}

function occupiable(pos) {
  if (tree[pos[0]][pos[1]] === "x" || tree[pos[0]][pos[1]] === "e") {
    return true;
  }

  return false;
}

function bfs(startPos) {
  let targetFound = false;
  let neighborRow, neighborCol;
  let topNode, neighbors;
  let up, right, down, left;
  let visitedNodes = [];
  let nodeQueue = [];
  let trail = [];

  trail.push(new TreeNode(startPos, undefined));
  nodeQueue.push(new TreeNode(startPos, undefined));
  visitedNodes.push(startPos);

  while (!targetFound && nodeQueue.length > 0) {
    topNode = nodeQueue.shift();
    neighbors = [];
    up = upPos(topNode.pos);
    right = rightPos(topNode.pos);
    down = downPos(topNode.pos);
    left = leftPos(topNode.pos);
    neighbors.push(up, right, down, left);

    for (let i = 0; i < neighbors.length; i++) {
      neighborRow = neighbors[i][0];
      neighborCol = neighbors[i][1];

      if (neighborRow < 0 || neighborCol < 0 ||
          neighborRow >= tree.length ||
          neighborCol >= tree[0].length) {
            continue;
          }

      if (occupiable(neighbors[i]) && !includedIn(neighbors[i], visitedNodes)) {
        visitedNodes.push(neighbors[i]);
        nodeQueue.push(new TreeNode(neighbors[i], topNode));
        trail.push(new TreeNode(neighbors[i], topNode));

        if (tree[neighborRow][neighborCol] === "e") {
          targetFound = true;
          return [neighborRow, neighborCol];
        }
      }
    }
  }
}

bfs([0, 0]);`;

export const QUICK_SORT_EXAMPLE = `// Demonstration of the quick sort algorithm

function quickSort(arr) {
  if (arr.length <= 1) {
    return arr;
  }

  let pivot = [arr[0]];

  let arrToSort = arr.splice(1);

  let left = arrToSort.filter(el => {
    return el <= pivot;
  });

  let right = arrToSort.filter(el => {
    return el > pivot;
  });

  let leftSort = quickSort(left);
  let rightSort = quickSort(right);

  return leftSort.concat(pivot).concat(rightSort);
}

quickSort([9,2,-5,7])`;
