import { useContext } from "react";
import logoSvg from "@/assets/react.svg";
import styles from "./index.module.scss";
import { PlaygroundContext } from "@/ReactPlayground/PlaygroundContext";
import { message } from "antd";
import {
  MoonOutlined,
  SunOutlined,
  ShareAltOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { copy, downloadFiles } from "../../utils";

const Header = () => {
  const { theme, setTheme, files } = useContext(PlaygroundContext);
  return (
    <div className={styles.header}>
      <div className={styles.logo}>
        <img src={logoSvg} alt="logo" />
        <span>React </span>
      </div>
      <div className={styles.links}>
        {theme === "light" && (
          <MoonOutlined
            title="切换暗色"
            className={styles.theme}
            onClick={() => {
              setTheme("dark");
            }}
          />
        )}
        {theme === "dark" && (
          <SunOutlined
            title="切换亮色"
            className={styles.theme}
            onClick={() => {
              setTheme("light");
            }}
          />
        )}
        <ShareAltOutlined
          style={{
            marginLeft: "10px",
          }}
          onClick={(e) => {
            copy(e, window.location.href);
            message.success("分享链接已经复制");
          }}
        />
        <DownloadOutlined
          style={{ marginLeft: "10px" }}
          onClick={async () => {
            await downloadFiles(files);
            message.success("下载完成");
          }}
        />
      </div>
    </div>
  );
};

export default Header;
