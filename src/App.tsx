import React, { useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { appWindow } from "@tauri-apps/api/window";
import { Outlet } from "react-router-dom";
import { ChannelList } from "./components/Subscribes";
import { useBearStore } from "@/stores";
import * as dataAgent from "./helpers/dataAgent";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RouteConfig } from "./config";
import { ArticleContainer } from "./layout/Article";
import { SettingContainer } from "./layout/Setting";

import { General } from "./components/SettingPanel/General";
import { FeedManager } from "./components/SettingPanel/Content";
import { ImportAndExport } from "./components/SettingPanel/ImportAndExport";
import { WelcomePage } from "./components/WelcomePage";
import { Appearance } from "./components/SettingPanel/Appearance";

import "./styles/index.global.scss";
import { Shortcut } from "./components/SettingPanel/ShortCut";

function App() {
  const store = useBearStore((state) => ({
    goPreviousArticle: state.goPreviousArticle,
    goNextArticle: state.goNextArticle,
    getUserConfig: state.getUserConfig,
  }));

  useEffect(() => {
    document
      .getElementById("titlebar-minimize")
      ?.addEventListener("click", () => appWindow.minimize());
    document
      .getElementById("titlebar-maximize")
      ?.addEventListener("click", () => appWindow.toggleMaximize());
    document
      .getElementById("titlebar-close")
      ?.addEventListener("click", () => appWindow.close());
  }, []);

  useEffect(() => {
    store.getUserConfig();

    dataAgent.getUserConfig().then((cfg: any) => {
      const { theme, customize_style } = cfg as UserConfig;

      if (theme === 'system') {
        document.documentElement.dataset.colorScheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      } else {
        document.documentElement.dataset.colorScheme = theme;
      }

      customize_style &&
        Object.keys(customize_style).length &&
        Object.keys(customize_style).forEach((key: string) => {
          document.documentElement.style.setProperty(
            `--reading-editable-${key.replace(/_/gi, "-")}`,
            customize_style[key as keyof CustomizeStyle] as string,
          );
        });
    });
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path={"/"}
          element={
            <DndProvider backend={HTML5Backend}>
              <div className="flex h-full max-h-full">
                <ChannelList />
                <Outlet />
              </div>
            </DndProvider>
          }
        >
          <Route path={"/"} element={<WelcomePage />} />
          <Route path={RouteConfig.TODAY} element={<ArticleContainer />} />
          <Route path={RouteConfig.ALL} element={<ArticleContainer />} />
          <Route path={RouteConfig.CHANNEL} element={<ArticleContainer />} />
          <Route path={RouteConfig.SETTINGS} element={<SettingContainer />}>
            <Route path={RouteConfig.SETTINGS_GENERAL} element={<General />} />
            <Route
              path={RouteConfig.SETTINGS_APPEARANCE}
              element={<Appearance />}
            />
            <Route
              path={RouteConfig.SETTINGS_SHORTCUT}
              element={<Shortcut />}
            />
            <Route
              path={RouteConfig.SETTINGS_FEED_MANAGER}
              element={<FeedManager />}
            />
            <Route
              path={RouteConfig.SETTINGS_IMPORT}
              element={<ImportAndExport />}
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
