import { classes } from "@/utils";
import styles from "./IconButton.module.css";

type Props = {
  icon: React.ReactNode;
  isInline?: boolean;
  onClick?: () => void;
};

export const IconButton = ({ icon, isInline, onClick }: Props) => {
  return (
    <button
      onClick={onClick}
      className={classes(styles.IconButton, isInline && styles.Inline)}
    >
      {icon}
    </button>
  );
};
