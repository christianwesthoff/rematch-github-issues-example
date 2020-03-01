import _idx from 'idx';

const idx = <T1 extends NonNullable<any>, T2 extends NonNullable<any>>(
    prop: T1,
    accessor: (prop: T1) => T2 | null | undefined, 
    defaultVal: T2
  ): T2 =>
{
  return _idx(prop, accessor) || defaultVal;
}

export default idx;