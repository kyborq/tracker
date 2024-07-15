import styles from "./IconButton.module.css";

type Props = {
  icon: React.ReactNode;
  onClick?: () => void;
};

export const IconButton = ({ icon, onClick }: Props) => {
  return (
    <button onClick={onClick} className={styles.IconButton}>
      {icon}
    </button>
  );
};
