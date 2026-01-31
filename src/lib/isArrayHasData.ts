const isArrayHasData = (arr: Record<string, any>[]) =>
  Array.isArray(arr) && arr.length > 0;

export default isArrayHasData;
