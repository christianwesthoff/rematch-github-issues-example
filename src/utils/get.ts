import idx from 'idx';

const get = <T1 extends any, T2 extends any>(
    prop: T1,
    accessor: (prop: T1) => T2 | null | undefined, 
    defaultVal: T2
  ): T2 =>
{
  return idx(prop, accessor) || defaultVal;
}

export default get;