import styles from "./styles/common.module.css";
import {TopPage} from "./pages/top.tsx";

function App() {
  return <div className={styles.top}>
    <TopPage/>
  </div>;
}

export default App;
