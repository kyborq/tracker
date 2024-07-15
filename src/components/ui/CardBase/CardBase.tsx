import { AnimatePresence, motion } from "framer-motion";

import styles from "./CardBase.module.css";

type Props = {
  width?: number;
  children?: React.ReactNode;
};

export const CardBase = ({ width, children }: Props) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        className={styles.CardBase}
        style={{ width }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
