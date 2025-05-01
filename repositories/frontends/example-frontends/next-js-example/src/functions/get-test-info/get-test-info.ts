type Params = {
  name: string;
  age: number;
};

export function getTestInfo(params: Params, isThrowError?: boolean) {
  if (isThrowError === true) {
    throw new Error('test error');
  }

  return {
    name: params.name,
    age: params.age,
  };
}
