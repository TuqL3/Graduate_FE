'use client';

import { useAppSelector, useAppDispatch } from '../../../lib/redux/hook';
import { addUser, removeUser } from '../../../lib/redux/features/couterSlice';

const Rooms = () => {
  const count = useAppSelector((state) => state.counter.user);
  const dispatch = useAppDispatch();

  return (
    <div>
      {/* <button onClick={() => dispatch(decrement())}>-</button>
      <span>{count}</span>
      <button onClick={() => dispatch(increment())}>+</button>
      <button onClick={() => dispatch(incrementByAmount(5))}>+5</button> */}
    </div>
  );
};

export default Rooms;
