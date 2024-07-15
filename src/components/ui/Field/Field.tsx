import { forwardRef, InputHTMLAttributes } from "react";

import styles from "./Field.module.css";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  icon?: React.ReactNode;
};

export const Field = forwardRef<HTMLInputElement, Props>(
  ({ icon, ...inputProps }, ref) => {
    return (
      <label className={styles.Field}>
        {icon}
        <input ref={ref} className={styles.Input} {...inputProps} />
      </label>
    );
  },
);
