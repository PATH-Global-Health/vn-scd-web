import { useMemo } from 'react';
import useDispatch from './use-dispatch';
import { addErrorCallback } from '../slices/global';

type UseError = (
  title: string,
  data: string[],
  message: string,
  callback: () => void | Promise<void>,
) => void;

const useError = (): UseError => {
  const dispatch = useDispatch();
  const error = useMemo(
    () => (
      title: string,
      data: string[],
      message: string,
      callback: () => void,
    ): void => {
      dispatch(addErrorCallback({ title, data, message, callback }));
    },
    [dispatch],
  );

  return error;
};

export default useError;
