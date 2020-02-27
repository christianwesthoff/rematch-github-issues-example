import idx from 'idx';

const get = <T1 extends NonNullable<any>, T2 extends NonNullable<any>>(
    prop: T1,
    accessor: (prop: T1) => T2 | null | undefined, 
    ifEmpty: T2
  ): T2 =>
{
  return idx(prop, accessor) || ifEmpty;
}

export default get;