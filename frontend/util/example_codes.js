export const MERGE_SORT_EXAMPLE = `//Write an Array#merge_sort method; it should not modify the original array.
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

console.log(mergeSort([1,9,2,3,0,5,6,6,43,24]));
`;

export const CURRYING_EXAMPLE = `function curriedSum(numArgs) {
  let numbers = [];

  function _curriedSum(num) {
    numbers.push(num);

    if(numbers.length === numArgs) {
      return numbers.reduce((total,val) => {
        return total+val;
      })
    } else {
      return _curriedSum;
    }
  }

  return _curriedSum;
}

const sum = curriedSum(4);
console.log(sum(5)(30)(20)(1)); // => 56`;

export const DEBOUNCING_EXAMPLE = `function debounce(callback, wait, context = this) {
  let timeout = null
  let callbackArgs = null

  const later = () => callback.apply(context, callbackArgs)

  return function() {
    callbackArgs = arguments
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}`;
