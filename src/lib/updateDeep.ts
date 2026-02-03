const updateDeep = (
  obj: Record<string, unknown>,
  path: string[],
  val: unknown,
): Record<string, unknown> => {
  const [head, ...tail] = path;
  if (tail.length === 0) {
    return {
      ...obj,
      [head]: val,
    };
  }
  return {
    ...obj,
    [head]: updateDeep((obj[head] as Record<string, unknown>) || {}, tail, val),
  };
};

export default updateDeep;
