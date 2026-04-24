import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Layout } from "./Layout";
import { HomePage } from "./pages/HomePage";
import { ThemingPage } from "./pages/foundations/ThemingPage";
import { ButtonsPage } from "./pages/foundations/ButtonsPage";
import { InputsPage } from "./pages/foundations/InputsPage";
import { AlignmentPage } from "./pages/foundations/AlignmentPage";
import { I18nPage } from "./pages/foundations/I18nPage";
import { FormsPage } from "./pages/foundations/FormsPage";
import { DisplayPage } from "./pages/foundations/DisplayPage";
import { DataPage } from "./pages/foundations/DataPage";
import { FeedbackPage } from "./pages/foundations/FeedbackPage";
import { OverlaysPage } from "./pages/foundations/OverlaysPage";
import { NavigationPage } from "./pages/foundations/NavigationPage";
import { ContainersPage } from "./pages/foundations/ContainersPage";
import { SectionsPage } from "./pages/foundations/SectionsPage";
import { ResponsivePage } from "./pages/foundations/ResponsivePage";
import { BackgroundsPage } from "./pages/foundations/BackgroundsPage";
import { CoordinationPage } from "./pages/patterns/CoordinationPage";
import { CanvasPage } from "./pages/patterns/CanvasPage";
import { FlyoutToolbarPage } from "./pages/patterns/FlyoutToolbarPage";
import { ContentSwapPage } from "./pages/patterns/ContentSwapPage";
import { IDEPage } from "./pages/apps/IDEPage";
import { DesktopPage } from "./pages/apps/DesktopPage";
import { DesignPage } from "./pages/apps/DesignPage";
import { MusicPage } from "./pages/apps/MusicPage";
import { MediaPage } from "./pages/apps/MediaPage";
import { DevPage } from "./pages/apps/DevPage";
import { ChatPage } from "./pages/apps/ChatPage";
import { CollabPage } from "./pages/apps/CollabPage";
import { DashboardPage } from "./pages/apps/DashboardPage";
import { FileManagerPage } from "./pages/apps/FileManagerPage";
import { EmailPage } from "./pages/apps/EmailPage";
import { KanbanPage } from "./pages/apps/KanbanPage";
import { InfraPage } from "./pages/apps/InfraPage";
import { AccessPage } from "./pages/apps/AccessPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="foundations">
            <Route path="theming" element={<ThemingPage />} />
            <Route path="buttons" element={<ButtonsPage />} />
            <Route path="inputs" element={<InputsPage />} />
            <Route path="alignment" element={<AlignmentPage />} />
            <Route path="i18n" element={<I18nPage />} />
            <Route path="forms" element={<FormsPage />} />
            <Route path="display" element={<DisplayPage />} />
            <Route path="data" element={<DataPage />} />
            <Route path="feedback" element={<FeedbackPage />} />
            <Route path="overlays" element={<OverlaysPage />} />
            <Route path="navigation" element={<NavigationPage />} />
            <Route path="containers" element={<ContainersPage />} />
            <Route path="sections" element={<SectionsPage />} />
            <Route path="responsive" element={<ResponsivePage />} />
            <Route path="backgrounds" element={<BackgroundsPage />} />
          </Route>
          <Route path="patterns">
            <Route path="coordination" element={<CoordinationPage />} />
            <Route path="canvas" element={<CanvasPage />} />
            <Route path="flyout-toolbar" element={<FlyoutToolbarPage />} />
            <Route path="content-swap" element={<ContentSwapPage />} />
          </Route>
          <Route path="apps">
            <Route path="ide" element={<IDEPage />} />
            <Route path="desktop" element={<DesktopPage />} />
            <Route path="design" element={<DesignPage />} />
            <Route path="music" element={<MusicPage />} />
            <Route path="media" element={<MediaPage />} />
            <Route path="dev" element={<DevPage />} />
            <Route path="chat" element={<ChatPage />} />
            <Route path="collab" element={<CollabPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="files" element={<FileManagerPage />} />
            <Route path="email" element={<EmailPage />} />
            <Route path="kanban" element={<KanbanPage />} />
            <Route path="infra" element={<InfraPage />} />
            <Route path="access" element={<AccessPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
