import { FC, ReactNode } from 'react';

type Props = {
  children?: ReactNode;
};

export type FunctionComponentWithProps<T = {}> = FC<T & Props>;
